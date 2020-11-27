import * as googleActions from "../actions/googleActions"

const initialState = {
  isCoreApiLoaded: false,
  isClientApiLoaded: false,
  isSignedIn: false,
}

export default function google(state=initialState, action={}) {
  switch(action.type) {
    case googleActions.GOOGLE_API_LOADED:
      return {...state, isCoreApiLoaded: true}
    case googleActions.CLIENT_API_LOADED:
      return {...state, isClientApiLoaded: true}
    case googleActions.GOOGLE_SIGNED_IN:
      return {...state, isSignedIn: true}
    case googleActions.GOOGLE_SIGNED_OUT:
      return {...state, isSignedIn: false}
    default:
      return state
  }
}
