# KeyboardInput

Object that knows key states.

## Usage

```javascript
import Keyboard from "./path/to/Keyboard.js";

const keyboard = new Keyboard();
```

To update state do this

```javascript
function someLoopingFunction(args) {
  keyboard.update() 
  /* do something... */
}
```

or if you don't have looping function and you want it to update internally use these methods

```javascript
keyboard.startInternalLoop();
keyboard.stopInternalLoop();
```

To destroy it

```javascript
keyboard.destroy();
```

Finally to query state

```javascript
  getPressedKeys() // Returns set of keys that got pressed between this frame and the last frame
  getReleasedKeys() // Returns set of keys that got released between this frame and the last frame
  getHeldKeys() // Returns set of keys that the user is currently holding down

  // key is https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
  isPressed(key) // Returns true if key got pressed between this frame and the last frame
  isReleased(key) // Returns true if key got released between this frame and the last frame
  isHeld(key) // Returns if key is being held down this frame
```
