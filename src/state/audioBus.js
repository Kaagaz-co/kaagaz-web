// Simple audio state bus to coordinate background music and effects
let _playing = false;
const _listeners = new Set();

export function setBgMusicPlaying(val) {
  _playing = !!val;
  for (const cb of _listeners) {
    try { cb(_playing); } catch {}
  }
}

export function getBgMusicPlaying() {
  return _playing;
}

export function subscribeBgMusic(cb) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}
