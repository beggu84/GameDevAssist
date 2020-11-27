import React from "react"
import { connect } from "react-redux"

import * as googleDriveActions from "../actions/googleDriveActions"

import googleService from "../services/googleService"
import googleDriveService from "../services/googleDriveService"
import fileStorage from "../services/fileStorage"
import * as styleService from "../services/styleService"

import FileList from "../components/FileList"

import signInBtnImg from "../images/btn_google_signin_light_normal_web@2x.png"

@connect(state => ({
  google: state.google,
  googleDrive: state.googleDrive
}))
export default class FinderWindow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }

    this.googleService = new googleService()
    this.googleDriveService = new googleDriveService()
    this.fileStorage = new fileStorage()
    
    this.onSignInBtnClick = this.onSignInBtnClick.bind(this)
    this.onSignOutBtnClick = this.onSignOutBtnClick.bind(this)
    this.onFolderSelectBtnClick = this.onFolderSelectBtnClick.bind(this)
    this.onPickerAction = this.onPickerAction.bind(this)
    this.onFilesLoad = this.onFilesLoad.bind(this)

    this.reloadFiles = this.reloadFiles.bind(this)
    this.onFileSelect = this.onFileSelect.bind(this)
    this.onAllFilesSelect = this.onAllFilesSelect.bind(this)
    this.onAllFilesUnselect = this.onAllFilesUnselect.bind(this)
  }

  onSignInBtnClick() {
    const {google} = this.props

    if(!google.isClientApiLoaded)
      return
    if(google.isSignedIn)
      return

    this.googleService.signIn()
  }

  onSignOutBtnClick() {
    const {google} = this.props

    if(!google.isSignedIn)
      return

    this.googleService.signOut()
  }

  onFolderSelectBtnClick() {
    this.googleService.loadPickerApi(this.onPickerAction)
  }

  onPickerAction(data) {
    if(data.action !== 'picked' || !data.docs || data.docs.length != 1)
      return

    this.googleDriveService.loadFilesInFolder(data.docs[0].id, this.onFilesLoad)
  }

  onFilesLoad(files) {
    const {dispatch} = this.props

    files.sort((a,b) => {
      if(a.name < b.name)
        return -1
      else if(a.name > b.name)
        return 1
      else
        return 0
    })
    dispatch(googleDriveActions.setFiles(files))

    files.forEach(file => {
      const refFile = this.fileStorage.getSameFile(file.id)
      if(refFile) {
        file = refFile
        dispatch(googleDriveActions.updateFile(file))
      } else {
        this.googleDriveService.loadFileDetail(file, (detailedFile) => {
          dispatch(googleDriveActions.updateFile(detailedFile))
          this.fileStorage.addFile(file)
        })
      }
    })
  }

  reloadFiles() {
    const {dispatch, googleDrive} = this.props

    let files = []
    googleDrive.filesInFolder.forEach(file => {
      files.push({id: file.id})
    })
    dispatch(googleDriveActions.setFiles(files))

    files.forEach(file => {
      this.googleDriveService.loadFileDetail(file, (detailedFile) => {
        dispatch(googleDriveActions.updateFile(detailedFile))
        this.fileStorage.updateFile(file)
      })
    })
  }

  onFileSelect(file) {
    if(!file) {
      alert('invalid file')
      return
    }

    if(!file.downloadUrl)
      return

    const {dispatch} = this.props
    dispatch(googleDriveActions.selectFile(file))
  }

  onAllFilesSelect() {
    const {googleDrive} = this.props

    let invalid = googleDrive.filesInFolder.some(file => {
      return !file.downloadUrl
    })
    if(invalid)
      return
      
    const {dispatch} = this.props
    dispatch(googleDriveActions.selectAllFiles())
  }

  onAllFilesUnselect() {
    const {dispatch} = this.props
    dispatch(googleDriveActions.unselectAllFiles())
  }

  renderSignInButton() {
    const {google} = this.props

    if(google.isSignedIn)
      return null

    let style = {
      signInBtn: {
        display: 'inline-block',
        width: '100%',
        cursor: 'pointer'
      }
    }

    return (
      <img src={signInBtnImg} style={style.signInBtn}
        onClick={this.onSignInBtnClick}/>
    )
  }

  renderSignState() {
    const {google} = this.props

    if(!google.isSignedIn)
      return null

    let style = {
      component: {
        width: '100%',
        color: 'gray',
        fontSize: '12px',
        textAlign: 'center'
      },
      signout: {
        textDecoration: 'underline',
        cursor: 'pointer'
      }
    }

    return (
      <div style={style.component}>
        <span>Google signed in.</span>
        &nbsp;&nbsp;
        <span style={style.signout}
          onClick={this.onSignOutBtnClick}>
          sign out
        </span>
      </div>
    )
  }

  renderFolderSelectButton() {
    const {google} = this.props

    if(!google.isSignedIn)
      return null

    let btnStyle = Object.assign({}, styleService.getButtonStyle())
    btnStyle.marginTop = '5px'
    btnStyle.paddingTop = '5px'
    btnStyle.height = '40px'
    btnStyle.lineHeight = '18px'

    return (
      <div style={btnStyle}
        onClick={this.onFolderSelectBtnClick}>
          Select Folder
          <br/>
          In Google Drive
        </div>
    )
  }

  renderCover() {
    const {google} = this.props

    if(google.isClientApiLoaded)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  render() {
    const {google, googleDrive} = this.props

    let style = {
      component: {
        display: 'inline-block',
        position: 'relative',
        width: this.props.width + 'px',
        height: '100%',
        padding: '5px',
        verticalAlign: 'top',
        fontSize: '16px',
        boxSizing: 'border-box'
      }
    }

    return (
      <div style={style.component}>
        {this.renderSignInButton()}
        {this.renderSignState()}
        {this.renderFolderSelectButton()}
        <br/>
        
        <FileList files={googleDrive.filesInFolder}
          selectedFiles={googleDrive.selectedFiles}
          fullDownload={false}
          parentWidth={this.props.width}
          reloadFiles={this.reloadFiles}
          onFileSelect={this.onFileSelect}
          onAllFilesSelect={this.onAllFilesSelect}
          onAllFilesUnselect={this.onAllFilesUnselect}/>
        {this.renderCover()}
      </div>
    )
  }
}
