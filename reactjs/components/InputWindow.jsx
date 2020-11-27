import React from "react"
import { connect } from "react-redux"

import * as virtualDriveActions from "../actions/virtualDriveActions"

import googleDriveService from "../services/googleDriveService"
import fileStorage from "../services/fileStorage"
import * as styleService from "../services/styleService"

import FileList from "../components/FileList"

@connect(state => ({
  google: state.google,
  virtualDrive: state.virtualDrive
}))
export default class InputWindow extends React.Component {
  constructor(props) {
    super(props)

    this.googleDriveService = new googleDriveService()
    this.fileStorage = new fileStorage()

    this.reloadFiles = this.reloadFiles.bind(this)
    this.onFileSelect = this.onFileSelect.bind(this)
    this.onAllFilesSelect = this.onAllFilesSelect.bind(this)
    this.onAllFilesUnselect = this.onAllFilesUnselect.bind(this)
    this.onFileListClear = this.onFileListClear.bind(this)
  }

  reloadFiles() {
    const {dispatch, virtualDrive} = this.props

    let files = []
    virtualDrive.filesInAtlas.forEach(file => {
      files.push({id: file.id})
    })
    dispatch(virtualDriveActions.setFiles(files))

    files.forEach(file => {
      this.googleDriveService.loadFileDetail(file, (detailedFile) => {
        dispatch(virtualDriveActions.updateFile(detailedFile))
        this.fileStorage.updateFile(file)
      })
    })
  }

  onFileSelect(file) {
    if(!file) {
      alert('invalid file')
      return
    }

    if(!file.downloadUrl || !file.image)
      return

    const {dispatch} = this.props
    dispatch(virtualDriveActions.selectFile(file))
  }

  onAllFilesSelect() {
    const {virtualDrive} = this.props

    let invalid = virtualDrive.filesInAtlas.some(file => {
      return !file.downloadUrl
    })
    if(invalid)
      return

    invalid = virtualDrive.filesInAtlas.some(file => {
      return !file.image
    })
    if(invalid)
      return

    const {dispatch} = this.props
    dispatch(virtualDriveActions.selectAllFiles())
  }

  onAllFilesUnselect() {
    const {dispatch} = this.props
    dispatch(virtualDriveActions.unselectAllFiles())
  }

  onFileListClear() {
    const {dispatch} = this.props
    dispatch(virtualDriveActions.clearFiles())
  }

  renderCover() {
    const {google} = this.props

    if(google.isSignedIn)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  render() {
    const {virtualDrive} = this.props

    const titleHeight = styleService.getContainerHeight() - styleService.getFileListHeight()

    let style = {
      component: {
        display: 'inline-block',
        position: 'relative',
        width: this.props.width + 'px',
        height: '100%',
        verticalAlign: 'top'
      },
      title: {
        height: titleHeight + 'px',
        lineHeight: titleHeight + 'px',
        textAlign: 'center',
        fontSize: '25px'
      }
    }

    return (
      <div style={style.component}>
        <div style={style.title}>
          Sprites
        </div>
        <FileList files={virtualDrive.filesInAtlas}
          selectedFiles={virtualDrive.selectedFiles}
          fullDownload={true}
          parentWidth={this.props.width}
          reloadFiles={this.reloadFiles}
          onFileSelect={this.onFileSelect}
          onAllFilesSelect={this.onAllFilesSelect}
          onAllFilesUnselect={this.onAllFilesUnselect}
          onFileListClear={this.onFileListClear}/>
        {this.renderCover()}
      </div>
    )
  }
}
