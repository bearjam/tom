# Usage

`yarn add @bearjam/tom`

```ts
import { withUndoableReducer } from "@bearjam/tom"

const initialState: State = {
  // ...
}

const reducer = (state: State, action: Action): State => {
  // ...
}

export const useCanvasStore = create(withUndoableReducer(reducer, initialState))
```

Then you can call this hook in your React app:

```ts
const [state, dispatch, undo, redo, canUndo, canRedo] = useCanvasStore(
  store => [
    store.state,
    store.dispatch,
    store.undo,
    store.redo,
    store.canUndo,
    store.canRedo,
  ],
  shallow
)
```
