// Tab loses focus, so it can never be detected. Warn against use.

// If I release fn mid key-press, kb will think they are held
const fnProblemKeys = new Set([
  "VolumeDown",
  "VolumeUp",
  "AudioVolumeUp",
  "AudioVolumeDown"
]);
for (let i = 1; i < 25; i++) {
  fnProblemKeys.add("F"+i);
}

// Key up fires immediatelly after keydown for the following
const releaseProblemKeys = new Set([
  "VolumeMute",
  "AudioVolumeMute",
  "MediaTrackPrevious",
  "MediaPlayPause",
  "MediaTrackNext"
]);

const miscUnstableKeys = new Set([
  "",
  // "Pause", // Look into pause // Probs safe
  // "ScrollLock", // I think it's safe
  "PrintScreen",
  "Unidentified",
  "OSLeft",
  "MetaLeft",
  "OSRight",
  "MetaRight",
  "Power",
  "BrowserSearch",
  "BrowserFavorites",
  "BrowserRefresh",
  "BrowserStop",
  "BrowserForward",
  "BrowserBack",
  "LaunchMail",
  "LaunchMediaPlayer",
  "MediaSelect"
]);
for (let i = 1; i < 3; i++) {
  miscUnstableKeys.add("LaunchApp"+i)
}

const ignoreKeys = new Set([...releaseProblemKeys, ...miscUnstableKeys]);
const dontHoldKeys = new Set(fnProblemKeys);

class Keyboard {
  constructor() {
    this._prevDef = true;
    this._loopInternally = false;
    this._updatedForThisFrame = false;
    this._pendingHeldKeys = new Set();
    this._pendingReleasedKeys = new Set();
    // held keys could be a map (key: timestamp)
    // but that would be unable to detect keypresses
    // that lasted less than update interval.
    this._pressedKeys = new Set();
    this._releasedKeys = new Set();
    this._heldKeys = new Set();
    this._intervalID = setInterval(() => this._internalLoop());
    this._listeners = {
      keydown: e => {
        if (this._prevDef) e.preventDefault();
        if (ignoreKeys.has(e.code)) return;
        this._pendingHeldKeys.add(e.code);
      },

      keyup: e => {
        if (ignoreKeys.has(e.code) || dontHoldKeys.has(e.code)) return;
        this._pendingReleasedKeys.add(e.code);
      },

      blur: () => {
        this._pendingReleasedKeys = new Set(this._heldKeys.keys());
        this._pendingHeldKeys.clear();
      }
    };

    // Start listening
    for (const [type, callback] of Object.entries(this._listeners)) {
      document.addEventListener(type, callback);
    }
  }

  preventDefaults(bool) {
    this._prevDef = bool;
  }

  _internalLoop() {
    this._updatedForThisFrame = false;
    if (this._loopInternally) this.update();
  }

  getPressedKeys() {
    return new Set(this._pressedKeys);
  }

  getReleasedKeys() {
    return new Set(this._releasedKeys);
  }

  getHeldKeys() {
    return new Set(this._heldKeys);
  }

  isPressed(key) {
    return this._pressedKeys.has(key);
  }

  isReleased(key) {
    return this._releasedKeys.has(key);
  }

  isHeld(key) {
    return this._heldKeys.has(key);
  }

  update() {
    if (this._updatedForThisFrame) throw Error("Can only call update once per frame.")

    this._pressedKeys.clear();
    this._releasedKeys.clear();

    for (const key of this._pendingHeldKeys) {
      if (!this._heldKeys.has(key)) {
        this._pressedKeys.add(key);
        if (!dontHoldKeys.has(key)) this._heldKeys.add(key);
      }
    }
    this._pendingHeldKeys.clear();

    for (const key of this._pendingReleasedKeys) {
      if (this._heldKeys.has(key)) {
        this._releasedKeys.add(key);
        this._heldKeys.delete(key);
      }
    }
    this._pendingReleasedKeys.clear();

    this._updatedForThisFrame = true;
  }

  startInternalLoop() {
    this._loopInternally = true;
  }

  stopInternalLoop() {
    this._loopInternally = false;
  }

  destroy() {
    for (const [type, callback] of Object.entries(this._listeners)) {
      document.removeEventListener(type, callback);
    }
    clearInterval(this._intervalID);
  }
}

export default Keyboard;
