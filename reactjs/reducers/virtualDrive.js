import * as virtualDriveActions from "../actions/virtualDriveActions"

const initialState = {
  atlases: [],
  selectedAtlas: null,
  filesInAtlas: [],
  selectedFiles: []
}

function sortAtlasesByDate(atlases) {
  atlases.sort((a,b) => {
    if(a.date > b.date)
      return -1
    else if(a.date < b.date)
      return 1
    else
      return 0
  })

  return atlases
}

export default function virtualDrive(state=initialState, action={}) {
  switch(action.type) {
    case virtualDriveActions.INIT_ATLASES: {
      sortAtlasesByDate(action.atlases)
      return {...state, atlases: action.atlases}
    }

    case virtualDriveActions.SAVE_ATLAS: {
      let atlases = state.atlases.filter(oldAtlas => {
        if(oldAtlas.name === action.atlas.name)
          return false
        return true
      })
      atlases.push(action.atlas)
      sortAtlasesByDate(atlases)

      return {...state, atlases, selectedAtlas: action.atlas}
    }

    case virtualDriveActions.DELETE_ATLAS: {
      let atlases = state.atlases.filter(oldAtlas => {
        if(oldAtlas.name === action.atlasName)
          return false
        return true
      })
      return {...state, atlases, selectedAtlas: null}
    }

    case virtualDriveActions.SELECT_ATLAS:
      return {...state, selectedAtlas: action.atlas}

    case virtualDriveActions.UNSELECT_ATLAS:
      return {...state, selectedAtlas: null}

    case virtualDriveActions.SET_SPRITE_FILES:
      return {...state, filesInAtlas: action.files}

    case virtualDriveActions.ADD_SPRITE_FILES: {
      let filesInAtlas = state.filesInAtlas.filter(srcFile => {
        for(let i=0; i<action.files.length; i++) {
          if(action.files[i].id === srcFile.id)
            return false
        }
        return true
      })

      filesInAtlas = filesInAtlas.concat(action.files)
      filesInAtlas.sort((a,b) => {
        if(a.name < b.name)
          return -1
        else if(a.name > b.name)
          return 1
        else
          return 0
      })

      return {...state, filesInAtlas, selectedFiles: []}
    }

    case virtualDriveActions.UPGRADE_SPRITE_FILE: {
      let filesInAtlas = state.filesInAtlas.slice()
      for(let i=0; i<filesInAtlas.length; i++) {
        if(filesInAtlas[i].id === action.file.id) {
          filesInAtlas[i] = Object.assign(filesInAtlas[i], action.file)
          break
        }
      }
      return {...state, filesInAtlas}
    }

    case virtualDriveActions.REMOVE_SPRITE_FILES: {
      const filesInAtlas = state.filesInAtlas.filter(srcFile => {
        let selected = false
        for(let i=0; i<state.selectedFiles.length; i++) {
          if(state.selectedFiles[i].id === srcFile.id) {
            selected = true
            break
          }
        }
        return !selected
      })
      return {...state, filesInAtlas, selectedFiles: []}
    }

    case virtualDriveActions.SELECT_SPRITE_FILE: {
      let selectedFiles = null
      if(state.selectedFiles.includes(action.file)) {
        selectedFiles = state.selectedFiles.filter((file) => {
          return (file !== action.file)
        })
      } else {
        selectedFiles = state.selectedFiles.slice()
        selectedFiles.push(action.file)
      }
      return {...state, selectedFiles}
    }

    case virtualDriveActions.SELECT_ALL_SPRITE_FILES: {
      return {...state, selectedFiles: state.filesInAtlas.slice()}
    }

    case virtualDriveActions.UNSELECT_ALL_SPRITE_FILES: {
      return {...state, selectedFiles: []}
    }

    case virtualDriveActions.CLEAR_SPRITE_FILES: {
      return {...state, filesInAtlas: [], selectedFiles: []}
    }

    default:
      return state
  }
}
