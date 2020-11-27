import * as googleDriveActions from "../actions/googleDriveActions"

let _instance = null

export default class googleDriveService {
  constructor() {
    if(_instance)
      return _instance
    _instance = this
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch
  }

  loadFoldersByName(folderName) {
    if(folderName.length == 0)
      return

    gapi.client.drive.files.list({
      q: "mimeType = 'application/vnd.google-apps.folder' and name contains '" + folderName + "'",
      fields: 'files(id, name)',
      spaces: 'drive',
    }).then(resp => {
      this.dispatch(googleDriveActions.setFolders(resp.result.files))
    }, reason => {
      if(reason.result.error.code == 401) {
        gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
        alert('Authorization expired and refreshed. Try again.')
      }
    })
  }

  loadFilesInFolder(folderId, callback) {
    if(!folderId)
      return

    gapi.client.drive.files.list({
      q: "'" + folderId + "' in parents and mimeType contains 'image/'",
      fields: 'files(id, name, thumbnailLink)',
      spaces: 'drive',
    }).then(resp => {
      if(callback)
        callback(resp.result.files)
    }, reason => {
      if(reason.result.error.code == 401) {
        gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
        alert('Authorization expired and refreshed. Try again.')
      }
    })
  }

  loadFileDetail(file, fileUpdateCallback) {
    gapi.client.request({
      'path': 'https://www.googleapis.com/drive/v2/files/' + file.id
    }).then(resp => {
      const detailedFile = resp.result
      if(fileUpdateCallback)
        fileUpdateCallback(detailedFile)
      this.downloadImage(detailedFile, fileUpdateCallback)
    }, reason => {
      console.log(reason)
    })
  }

  downloadImage(file, fileUpdateCallback) {
    if(!file.downloadUrl) {
      alert('invalid download url')
      return
    }

    //let accessToken = gapi.auth.getToken().access_token
    let googleUser = gapi.auth2.getAuthInstance().currentUser.get()
    let authResponse = googleUser.getAuthResponse()
    let accessToken = authResponse.access_token

    let xhr = new XMLHttpRequest()
    xhr.open('GET', file.downloadUrl)
    xhr.responseType = "arraybuffer"
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
    xhr.onload = () => {
      let arrayBufferView = new Uint8Array(xhr.response)
      let blob = new Blob([arrayBufferView], {type: file.mimeType})
      let urlCreator = window.URL || window.webkitURL
      let blobUrl = urlCreator.createObjectURL(blob)

      let image = document.createElement('img')
      //image.crossOrigin = 'anonymous'
      image.onload = () => {
        file.image = image
        if(fileUpdateCallback)
          fileUpdateCallback(file)
      }
      image.src = blobUrl
    }
    xhr.onerror = () => {
      console.log('download error')
    }
    
    xhr.send()
  }
}
