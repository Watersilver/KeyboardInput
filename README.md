# KeyboardInput

Object that knows key states.

## Usage

```javascript
import Keyboard from "./path/to/Keyboard.js";

// The preventDefault object calls e.preventDefault() for keys that are true
// will also work if mutated even after a Keyboard instance starts using it
// a key code is https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
// code values: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
let preventDefault = {"F5": true, /* [code]: true */};

const keyboard = new Keyboard(preventDefault);
```

To update state do this

```javascript
function someLoopingFunction(args) {
  keyboard.update() 
  /* do something... */
}
```

To destroy it

```javascript
keyboard.destroy();
```

Finally to query state

```javascript
// following methods return Set
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
keyboard.getPressedKeys(); // keys that got pressed between this frame and the last frame
keyboard.getReleasedKeys(); // keys that got released between this frame and the last frame
keyboard.getHeldKeys(); // keys that the user is currently holding down


keyboard.isPressed(code); // Returns true if key got pressed between this frame and the last frame
keyboard.isReleased(code); // Returns true if key got released between this frame and the last frame
keyboard.isHeld(code); // Returns true if key is being held down this frame
```
