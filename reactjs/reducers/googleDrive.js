import * as googleDriveActions from "../actions/googleDriveActions"

const initialState = {
  folders: [],
  filesInFolder: [],
  selectedFiles: []
}

export default function googleDrive(state=initialState, action={}) {
  switch(action.type) {
    case googleDriveActions.SET_DRIVE_FOLDERS:
      return {...state, folders: action.folders, filesInFolder: [], selectedFiles: []}

    case googleDriveActions.SET_DRIVE_FILES:
      return {...state, filesInFolder: action.files, selectedFiles: []}

    case googleDriveActions.UPGRADE_DRIVE_FILE: {
      let filesInFolder = state.filesInFolder.slice()
      for(let i=0; i<filesInFolder.length; i++) {
        if(filesInFolder[i].id === action.file.id) {
          filesInFolder[i] = Object.assign(filesInFolder[i], action.file)
          break
        }
      }
      return {...state, filesInFolder}
    }

    case googleDriveActions.INSERT_IMAGE_TO_DRIVE_FILE: {
      let filesInFolder = state.filesInFolder.slice()
      for(let i=0; i<filesInFolder.length; i++) {
        if(filesInFolder[i].id === action.file.id) {
          filesInFolder[i].image = action.image
          break
        }
      }
      return {...state, filesInFolder}
    }

    case googleDriveActions.SELECT_DRIVE_FILE: {
      let selectedFiles = null
      if(state.selectedFiles.includes(action.file)) {
        selectedFiles = state.selectedFiles.filter(file => {
          return (file !== action.file)
        })
      } else {
        selectedFiles = state.selectedFiles.slice()
        selectedFiles.push(action.file)
      }
      return {...state, selectedFiles}
    }

    case googleDriveActions.SELECT_ALL_DRIVE_FILES: {
      return {...state, selectedFiles: state.filesInFolder.slice()}
    }

    case googleDriveActions.UNSELECT_ALL_DRIVE_FILES: {
      return {...state, selectedFiles: []}
    }
      
    default:
      return state
  }
}
