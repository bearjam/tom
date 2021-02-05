import { Draft } from "immer"
import * as React from "react"
import "react-app-polyfill/ie11"
import * as ReactDOM from "react-dom"
import create from "zustand"

import { reduxUndoable } from "../src"

type State = {
  count: number
}

type Inc = {
  type: "INC"
}

type Dec = {
  type: "DEC"
}

type Set = {
  type: "SET"
  payload: number
}

type Reset = {
  type: "RESET"
}

type Action = (Inc | Dec | Set | Reset) & { undoable?: boolean }

const producer = (draft: Draft<State>, action: Action): void => {
  switch (action.type) {
    case "DEC": {
      draft.count--
      return
    }
    case "INC": {
      draft.count++
      return
    }
    case "RESET": {
      draft.count = 0
      return
    }
    case "SET": {
      draft.count = action.payload
      return
    }
  }
}

const initialState = {
  count: 0,
}

const useStore = create(reduxUndoable(producer, initialState))

const App = () => {
  const {
    state,
    dispatch,
    undo,
    redo,
    canUndo,
    canRedo,
    patchIndex,
    patches,
    inversePatches,
  } = useStore()
  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={undo} disabled={!canUndo}>
        undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        redo
      </button>
      <button onClick={() => void dispatch({ type: "INC" })}>inc</button>
      <button onClick={() => void dispatch({ type: "DEC" })}>dec</button>
      <pre>
        {JSON.stringify({ patches, inversePatches, patchIndex }, null, 2)}
      </pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
