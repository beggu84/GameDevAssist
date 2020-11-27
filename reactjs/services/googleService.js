import * as googleActions from "../actions/googleActions"

import * as googleKeys from "../services/googleKeys"
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly'

let _instance = null

export default class googleService {
  constructor() {
    if(_instance)
      return _instance
    _instance = this
    
    this.onSignedStateUpdated = this.onSignedStateUpdated.bind(this)
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch
  }

  setSignedInCallback(callback) {
    this.signedInCallback = callback
  }

  init() {
    this.loadCoreApi()
  }

  loadCoreApi() {
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      this.dispatch(googleActions.setGoogleApiLoaded())
      this.loadClientApi()
    }
    document.body.appendChild(script)
  }

  loadClientApi() {
    gapi.load('client:auth2', {callback: () => {
      this.dispatch(googleActions.setClientApiLoaded())
      this.initClient()
    }})
  }

  initClient() {
    gapi.client.init({
      apiKey: googleKeys.API_KEY,
      clientId: googleKeys.CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.onSignedStateUpdated)
      this.onSignedStateUpdated(gapi.auth2.getAuthInstance().isSignedIn.get())
      this.setRefreshTimer()
    })
  }

  setRefreshTimer() {
    const authResponse = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
    if(authResponse && authResponse.expires_in) {
      console.log('expires in ' + authResponse.expires_in)

      setTimeout(() => {
        gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
        this.setRefreshTimer()
      }, authResponse.expires_in * 1000)
    }
  }

  onSignedStateUpdated(isSignedIn) {
    this.dispatch(googleActions.setGoogleSignedIn(isSignedIn))

    if(isSignedIn) {
      const userId = gapi.auth2.getAuthInstance().currentUser.get().getId()
      if(this.signedInCallback)
        this.signedInCallback('G'+userId)
    }
  }

  signIn() {
      gapi.auth2.getAuthInstance().signIn()
  }

  signOut() {
      gapi.auth2.getAuthInstance().signOut()
  }

  loadPickerApi(pickerCallback) {
    const response = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()

    gapi.load('picker', {callback: () => {
      //var docsView = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      var docsView = new google.picker.DocsView()
        .setIncludeFolders(true)
        //.setMimeTypes('application/vnd.google-apps.photo')
        .setMimeTypes('application/vnd.google-apps.folder')
        .setSelectFolderEnabled(true)
        .setOwnedByMe(true)

      var picker = new google.picker.PickerBuilder()
        .addView(docsView)
        .setOAuthToken(response.access_token)
        .setDeveloperKey(googleKeys.API_KEY)
        //.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setCallback(pickerCallback)
        .build()

      picker.setVisible(true)
    }})
  }
}
