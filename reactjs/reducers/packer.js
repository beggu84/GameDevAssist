import * as packerActions from "../actions/packerActions"

const initialState = {
  canvasLength: 128
}

export default function packer(state=initialState, action={}) {
  switch(action.type) {
    case packerActions.UPDATE_CANVAS_LENGTH:
      return {...state, canvasLength: action.length}
    default:
      return state
  }
}
