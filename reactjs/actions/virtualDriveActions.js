export const INIT_ATLASES = 'INIT_ATLASES'
export const SAVE_ATLAS = 'SAVE_ATLAS'
export const DELETE_ATLAS = 'DELETE_ATLAS'
export const SELECT_ATLAS = 'SELECT_ATLAS'
export const UNSELECT_ATLAS = 'UNSELECT_ATLAS'
export const SET_SPRITE_FILES = 'SET_SPRITE_FILES'
export const ADD_SPRITE_FILES = 'ADD_SPRITE_FILES'
export const UPGRADE_SPRITE_FILE = 'UPGRADE_SPRITE_FILE'
export const REMOVE_SPRITE_FILES = 'REMOVE_SPRITE_FILES'
export const SELECT_SPRITE_FILE = 'SELECT_SPRITE_FILE'
export const SELECT_ALL_SPRITE_FILES = 'SELECT_ALL_SPRITE_FILES'
export const UNSELECT_ALL_SPRITE_FILES = 'UNSELECT_ALL_SPRITE_FILES'
export const CLEAR_SPRITE_FILES = 'CLEAR_SPRITE_FILES'

export function initAtlases(atlases) {
  return {type: INIT_ATLASES, atlases}
}

export function saveAtlas(atlas) {
  return {type: SAVE_ATLAS, atlas}
}

export function deleteAtlas(atlasName) {
  return {type: DELETE_ATLAS, atlasName}
}

export function selectAtlas(atlas) {
  return {type: SELECT_ATLAS, atlas}
}

export function unselectAtlas() {
  return {type: UNSELECT_ATLAS}
}

export function setFiles(files) {
  return {type: SET_SPRITE_FILES, files}
}

export function addFiles(files) {
  return {type: ADD_SPRITE_FILES, files}
}

export function updateFile(file) {
  return {type: UPGRADE_SPRITE_FILE, file}
}

export function removeFiles() {
  return {type: REMOVE_SPRITE_FILES}
}

export function selectFile(file) {
  return {type: SELECT_SPRITE_FILE, file}
}

export function selectAllFiles() {
  return {type: SELECT_ALL_SPRITE_FILES}
}

export function unselectAllFiles() {
  return {type: UNSELECT_ALL_SPRITE_FILES}
}

export function clearFiles() {
  return {type: CLEAR_SPRITE_FILES}
}
