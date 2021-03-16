import produce, { Draft } from "immer"
import { applyPatch, createPatch, Patch } from "rfc6902"
import { GetState, SetState, State as StateBase, StoreApi } from "zustand"

type ActionBase<T = string> = { type: T; undoable?: boolean }

type Dispatcher<S, A> = {
  state: S
  dispatch: (a: A) => A
}

type Patcher = {
  patches: Patch[]
  inversePatches: Patch[]
  patchIndex: number
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export const withReducer = <
  T extends unknown,
  S extends StateBase,
  A extends ActionBase<T>
>(
  reducer: (state: S, action: A) => S,
  initialState: S
) => (
  set: SetState<Dispatcher<S, A>>,
  _get: GetState<Dispatcher<S, A>>,
  api: StoreApi<Dispatcher<S, A>> & {
    dispatch?: (a: A) => A
    undo?: () => void
    redo?: () => void
  }
): Dispatcher<S, A> => {
  api.dispatch = (action: A) => {
    set(p => ({
      ...p,
      state: reducer(p.state, action),
    }))
    return action
  }
  return {
    state: initialState,
    dispatch: api.dispatch,
  }
}

export const withUndoableReducer = <
  T extends unknown,
  S extends StateBase,
  A extends ActionBase<T>
>(
  reducer: (state: S, action: A) => S,
  initialState: S
) => (
  set: SetState<Dispatcher<S, A> & Patcher>,
  get: GetState<Dispatcher<S, A> & Patcher>,
  api: StoreApi<Dispatcher<S, A> & Patcher> & {
    dispatch?: (a: A) => A
    undo?: () => void
    redo?: () => void
  }
): Dispatcher<S, A> & Patcher => {
  api.dispatch = (action: A) => {
    if (typeof action.undoable === "undefined" || action.undoable) {
      set(p => {
        const n = reducer(p.state, action)
        const patch = createPatch(p.state, n)
        const inversePatch = createPatch(n, p.state)
        return produce(p, draft => {
          draft.state = n as Draft<S>
          draft.patches.splice(draft.patchIndex + 1)
          draft.patches.push(patch)
          draft.inversePatches.splice(draft.patchIndex + 1)
          draft.inversePatches.push(inversePatch)
          draft.patchIndex += 1
          draft.canUndo =
            typeof draft.inversePatches[draft.patchIndex] !== "undefined"
          draft.canRedo =
            typeof draft.patches[draft.patchIndex + 1] !== "undefined"
        })
      })
    } else {
      set(p => ({
        ...p,
        state: reducer(p.state, action),
      }))
    }
    return action
  }

  api.undo = () => {
    const { canUndo } = get()
    if (!canUndo) return

    set(p =>
      produce(p, draft => {
        applyPatch(draft.state, draft.inversePatches[draft.patchIndex])
        draft.patchIndex -= 1
        draft.canUndo =
          typeof draft.inversePatches[draft.patchIndex] !== "undefined"
        draft.canRedo =
          typeof draft.patches[draft.patchIndex + 1] !== "undefined"
      })
    )
  }

  api.redo = () => {
    const { canRedo } = get()
    if (!canRedo) return
    set(p =>
      produce(p, draft => {
        applyPatch(draft.state, draft.patches[draft.patchIndex + 1])
        draft.patchIndex += 1
        draft.canRedo =
          typeof draft.patches[draft.patchIndex + 1] !== "undefined"
        draft.canUndo =
          typeof draft.inversePatches[draft.patchIndex] !== "undefined"
      })
    )
  }

  return {
    state: initialState,
    dispatch: api.dispatch,
    patches: [],
    inversePatches: [],
    patchIndex: -1,
    undo: api.undo,
    redo: api.redo,
    canUndo: false,
    canRedo: false,
  }
}
