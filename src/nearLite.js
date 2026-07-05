// [BUG FIX - "JsonRpcProvider is not a constructor"] near-api-js v7's
// browser bundle has a genuine, reproducible bug with Vite/Rollup - its
// exported classes come out broken in every production build tried
// (confirmed across several different bundler-config fixes, all failing
// the same way). Rather than keep guessing at bundler config, this file
// re-implements the small handful of NEAR primitives this game actually
// needs, using only two tiny, extremely well-established, dependency-
// free crypto libraries (tweetnacl, bs58) plus the browser's own native
// fetch() - nothing here has any of near-api-js's own internal
// complexity or bundling history, so there's nothing left for a bundler
// to get wrong.
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const DEFAULT_RPC_URL = 'https://rpc.testnet.near.org';

// ---- Unit conversion helpers (same names/behavior as near-api-js's
// own nearToYocto/yoctoToNear/teraToGas, so every existing call site
// that already used those keeps working unchanged). ----
export function nearToYocto(amountStr) {
  const amount = String(amountStr || '0').trim();
  const [whole, frac = ''] = amount.split('.');
  const fracPadded = (frac + '0'.repeat(24)).slice(0, 24);
  const yocto = BigInt((whole || '0') + fracPadded || '0');
  return yocto;
}
export function yoctoToNear(yoctoStr, decimals = 4) {
  const yocto = BigInt(yoctoStr || '0');
  const whole = yocto / 1000000000000000000000000n;
  const frac = yocto % 1000000000000000000000000n;
  const fracStr = frac.toString().padStart(24, '0').slice(0, decimals);
  return `${whole.toString()}.${fracStr}`;
}
export function teraToGas(n) {
  return BigInt(n) * 1000000000000n;
}

// ---- KeyPair - drop-in enough replacement for near-api-js's KeyPair
// for the handful of methods this game actually calls. ----
export class KeyPair {
  constructor(secretKeyBytes64) {
    this._raw = nacl.sign.keyPair.fromSecretKey(secretKeyBytes64);
  }
  static fromString(secretKeyStr) {
    const raw = bs58.decode(String(secretKeyStr).replace(/^ed25519:/, ''));
    return new KeyPair(raw);
  }
  static fromRandom() {
    const raw = nacl.sign.keyPair();
    return new KeyPair(raw.secretKey);
  }
  getPublicKey() {
    const pub = this._raw.publicKey;
    return { data: pub, toString: () => `ed25519:${bs58.encode(pub)}` };
  }
  toString() {
    return `ed25519:${bs58.encode(this._raw.secretKey)}`;
  }
  sign(messageBytes) {
    const signature = nacl.sign.detached(messageBytes, this._raw.secretKey);
    return { signature };
  }
}

// ---- Minimal Borsh writer - just the primitives NEAR transactions
// actually use (fixed-width ints, length-prefixed strings/bytes, fixed-
// length byte arrays). NEAR's own transaction Borsh schema has been
// stable for years, so this is safe to hand-write directly rather than
// pull in a general-purpose Borsh library. ----
class BorshWriter {
  constructor() { this.chunks = []; }
  u8(n) { this.chunks.push(Uint8Array.of(n)); }
  u32(n) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n, true);
    this.chunks.push(b);
  }
  uintLE(value, byteLen) {
    let bn = BigInt(value);
    const b = new Uint8Array(byteLen);
    for (let i = 0; i < byteLen; i++) { b[i] = Number(bn & 0xffn); bn >>= 8n; }
    this.chunks.push(b);
  }
  u64(v) { this.uintLE(v, 8); }
  u128(v) { this.uintLE(v, 16); }
  fixedBytes(bytes) { this.chunks.push(bytes); }
  varBytes(bytes) { this.u32(bytes.length); this.chunks.push(bytes); }
  string(str) { this.varBytes(new TextEncoder().encode(str)); }
  toBytes() {
    const total = this.chunks.reduce((s, c) => s + c.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const c of this.chunks) { out.set(c, offset); offset += c.length; }
    return out;
  }
}

function writePublicKey(w, publicKeyStr) {
  w.u8(0); // curve type: 0 = ED25519
  w.fixedBytes(bs58.decode(String(publicKeyStr).replace(/^ed25519:/, '')));
}

// ---- Action builders - matches near-api-js's own `actions.transfer(...)`
// / `actions.functionCall(...)` helper shape closely enough for this
// file's own internal use. ----
export const actions = {
  transfer: (yoctoAmount) => ({ type: 'Transfer', deposit: BigInt(yoctoAmount) }),
  functionCall: (methodName, args, gas, deposit) => ({
    type: 'FunctionCall', methodName, args, gas: BigInt(gas), deposit: BigInt(deposit || 0n),
  }),
};

function writeAction(w, action) {
  if (action.type === 'Transfer') {
    w.u8(3);
    w.u128(action.deposit);
  } else if (action.type === 'FunctionCall') {
    w.u8(2);
    w.string(action.methodName);
    w.varBytes(new TextEncoder().encode(JSON.stringify(action.args || {})));
    w.u64(action.gas);
    w.u128(action.deposit);
  } else {
    throw new Error(`Unsupported action type: ${action.type}`);
  }
}

async function rpc(method, params, rpcUrl) {
  const res = await fetch(rpcUrl || DEFAULT_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'dontcare', method, params }),
  });
  const data = await res.json();
  if (data.error) {
    const msg = data.error.cause?.info?.error_message || data.error.data || data.error.message || 'RPC error';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return data.result;
}

// ---- Read-only calls - free, no key needed. ----
export async function viewFunction({ contractId, method, args = {}, rpcUrl }) {
  const result = await rpc('query', {
    request_type: 'call_function',
    account_id: contractId,
    method_name: method,
    args_base64: btoa(JSON.stringify(args)),
    finality: 'optimistic',
  }, rpcUrl);
  const text = new TextDecoder().decode(new Uint8Array(result.result));
  return text ? JSON.parse(text) : null;
}

export async function viewAccount({ accountId, rpcUrl }) {
  return rpc('query', { request_type: 'view_account', account_id: accountId, finality: 'optimistic' }, rpcUrl);
}

// ---- Signed transactions - construct, sign, and broadcast a
// transaction with a raw private key, entirely by hand. ----
export async function signAndSendTransaction({ signerId, receiverId, actions: actionList, secretKey, rpcUrl }) {
  const keyPair = KeyPair.fromString(secretKey);
  const publicKeyStr = keyPair.getPublicKey().toString();

  const accessKey = await rpc('query', {
    request_type: 'view_access_key', finality: 'final', account_id: signerId, public_key: publicKeyStr,
  }, rpcUrl);
  const nonce = BigInt(accessKey.nonce) + 1n;
  const blockHashBytes = bs58.decode(accessKey.block_hash);

  const txWriter = new BorshWriter();
  txWriter.string(signerId);
  writePublicKey(txWriter, publicKeyStr);
  txWriter.u64(nonce);
  txWriter.string(receiverId);
  txWriter.fixedBytes(blockHashBytes);
  txWriter.u32(actionList.length);
  actionList.forEach((a) => writeAction(txWriter, a));
  const txBytes = txWriter.toBytes();

  const hashBuffer = await crypto.subtle.digest('SHA-256', txBytes);
  const { signature } = keyPair.sign(new Uint8Array(hashBuffer));

  const signedWriter = new BorshWriter();
  signedWriter.fixedBytes(txBytes);
  signedWriter.u8(0); // signature curve type: ED25519
  signedWriter.fixedBytes(signature);
  const signedBytes = signedWriter.toBytes();

  let binary = '';
  signedBytes.forEach((b) => { binary += String.fromCharCode(b); });
  const signedBase64 = btoa(binary);

  const result = await rpc('broadcast_tx_commit', [signedBase64], rpcUrl);
  if (result.status && result.status.Failure) {
    const failure = result.status.Failure;
    const errMsg = failure.ActionError?.kind
      ? JSON.stringify(failure.ActionError.kind)
      : JSON.stringify(failure);
    throw new Error(errMsg);
  }
  const successValue = result.status?.SuccessValue;
  const returnValue = (successValue !== undefined && successValue !== null && successValue !== '')
    ? JSON.parse(atob(successValue))
    : null;
  return { result, returnValue };
}
