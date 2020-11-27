export const GOOGLE_API_LOADED = 'GOOGLE_API_LOADED'
export const CLIENT_API_LOADED = 'CLIENT_API_LOADED'
export const GOOGLE_SIGNED_IN = 'GOOGLE_SIGNED_IN'
export const GOOGLE_SIGNED_OUT = 'GOOGLE_SIGNED_OUT'

export function setGoogleApiLoaded() {
  return {type: GOOGLE_API_LOADED}
}

export function setClientApiLoaded() {
  return {type: CLIENT_API_LOADED}
}

export function setGoogleSignedIn(isSignedIn) {
  if(isSignedIn)
    return {type: GOOGLE_SIGNED_IN}
  else
    return {type: GOOGLE_SIGNED_OUT}
}
