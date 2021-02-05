import produce, {
  applyPatches,
  Draft,
  enablePatches,
  Patch,
  produceWithPatches,
} from "immer"
import { GetState, SetState, State as StateBase, StoreApi } from "zustand"

enablePatches()

type Patcher = {
  patches: Patch[][]
  inversePatches: Patch[][]
  patchIndex: number
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

type ActionBase<T = string> = { type: T; undoable?: boolean }

type Dispatcher<S, A> = {
  state: S
  dispatch: (a: A) => A
}

export const reduxUndoable = <
  T extends unknown,
  S extends StateBase,
  A extends ActionBase<T>
>(
  producer: (draft: Draft<S>, action: A) => void,
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
        const [n, patches, inversePatches] = produceWithPatches(
          p.state,
          draft => {
            producer(draft, action)
          }
        )
        return produce(p, draft => {
          draft.state = n as Draft<S>
          draft.patchIndex += 1
          draft.patches.push(patches)
          draft.inversePatches.push(inversePatches)
          draft.patches.splice(draft.patchIndex + 1)
          draft.inversePatches.splice(draft.patchIndex + 1)
          draft.canUndo =
            typeof draft.inversePatches[draft.patchIndex] !== undefined
          draft.canRedo = typeof draft.patches[draft.patchIndex] !== undefined
        })
      })
    } else {
      set(p => produce(p, draft => producer(draft.state, action)))
    }
    return action
  }

  api.undo = () => {
    const { canUndo } = get()
    if (!canUndo) return

    set(p =>
      produce(p, draft => {
        draft.state = applyPatches(
          draft.state,
          draft.inversePatches[draft.patchIndex]
        )
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
        draft.state = applyPatches(
          draft.state,
          draft.patches[draft.patchIndex + 1]
        )
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
