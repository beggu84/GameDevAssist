export const SET_DRIVE_FOLDERS = 'SET_DRIVE_FOLDERS'
export const SET_DRIVE_FILES = 'SET_DRIVE_FILES'
export const UPGRADE_DRIVE_FILE = 'UPGRADE_DRIVE_FILE'
export const INSERT_IMAGE_TO_DRIVE_FILE = 'INSERT_IMAGE_TO_DRIVE_FILE'
export const SELECT_DRIVE_FILE = 'SELECT_DRIVE_FILE'
export const SELECT_ALL_DRIVE_FILES = 'SELECT_ALL_DRIVE_FILES'
export const UNSELECT_ALL_DRIVE_FILES = 'UNSELECT_ALL_DRIVE_FILES'

export function setFolders(folders) {
  return {type: SET_DRIVE_FOLDERS, folders}
}

export function setFiles(files) {
  return {type: SET_DRIVE_FILES, files}
}

export function updateFile(file) {
  return {type: UPGRADE_DRIVE_FILE, file}
}

export function insertImageToFile(file, image) {
  return {type: INSERT_IMAGE_TO_DRIVE_FILE, file, image}
}

export function selectFile(file) {
  return {type: SELECT_DRIVE_FILE, file}
}

export function selectAllFiles() {
  return {type: SELECT_ALL_DRIVE_FILES}
}

export function unselectAllFiles() {
  return {type: UNSELECT_ALL_DRIVE_FILES}
}
