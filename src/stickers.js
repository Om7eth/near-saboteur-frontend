// [PLAY PASS - STICKERS] The 24 chat stickers (Play Pass perk). The server
// keeps the same id list and only accepts these ids from Play Pass holders.
const files = import.meta.glob('./assets/stickers/*.png', { eager: true, import: 'default' });
const LIST = [
  ['angry', 'Angry'], ['nervous', 'Nervous'], ['facepalm', 'Facepalm'], ['shh', 'Shh!'], ['sus', 'SUS!'], ['smug', 'Smug'],
  ['not-me', 'Not me!'], ['im-crewmate', "I'm Crewmate!"], ['im-saboteur', "I'm Saboteur!"], ['i-saw-you', 'I saw you!'], ['follow-me', 'Follow me!'], ['wait', 'Wait!'],
  ['where', 'Where?'], ['doing-tasks', 'Doing tasks!'], ['task-done', 'Task done!'], ['fixing', 'Fixing...'], ['check-cams', 'Check cams!'], ['sabotage', 'Sabotage!'],
  ['vote', 'Vote!'], ['skip', 'Skip!'], ['discuss', 'Discuss!'], ['trust-me', 'Trust me!'], ['run', 'Run!'], ['im-ghost', "I'm Ghost!"],
];
export const STICKERS = LIST.map(([id, label]) => ({ id, label, src: files[`./assets/stickers/${id}.png`] }));
const BY_ID = Object.fromEntries(STICKERS.map((s) => [s.id, s]));
export const stickerSrc = (id) => (BY_ID[id] ? BY_ID[id].src : null);
export const stickerLabel = (id) => (BY_ID[id] ? BY_ID[id].label : 'Sticker');
