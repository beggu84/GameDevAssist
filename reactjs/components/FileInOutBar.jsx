import React from "react"
import { connect } from "react-redux"

import * as googleDriveActions from "../actions/googleDriveActions"
import * as virtualDriveActions from "../actions/virtualDriveActions"

import fileStorage from "../services/fileStorage"
import * as styleService from "../services/styleService"

import fileInIcon from "../images/FileInIcon.png"
import fileOutIcon from "../images/FileOutIcon.png"

@connect(state => ({
  googleDrive: state.googleDrive,
  virtualDrive: state.virtualDrive
}))
export default class FileInOutBar extends React.Component {
  constructor(props) {
    super(props)

    this.fileStorage = new fileStorage()
  
    this.onFilesInClick = this.onFilesInClick.bind(this)
    this.onFilesOutClick = this.onFilesOutClick.bind(this)
  }

  onFilesInClick() {
    /*
    if(!this.isInBtnEnabled())
      return
    */

    const {dispatch, googleDrive, virtualDrive} = this.props

    const files = googleDrive.selectedFiles.slice()
    for(let i=0; i<files.length; i++) {
      const ccFile = this.fileStorage.getSameFile(files[i].id)
      if(ccFile)
        files[i] = ccFile
    }

    dispatch(virtualDriveActions.addFiles(files))
    dispatch(googleDriveActions.unselectAllFiles())
  }

  onFilesOutClick() {
    /*
    if(!this.isOutBtnEnabled())
      return
    */

    const {dispatch} = this.props
    dispatch(virtualDriveActions.removeFiles())
  }

  isInBtnEnabled() {
    const {googleDrive} = this.props

    /*
    if(googleDrive.filesInFolder.length == 0)
      return false
    if(!googleDrive.filesInFolder.every(file => file.downloadUrl))
      return false
    */
    if(googleDrive.selectedFiles.length == 0)
      return false

    return true
  }

  isOutBtnEnabled() {
    const {virtualDrive} = this.props
    
    /*
    if(virtualDrive.filesInAtlas.length == 0)
      return false
    if(!virtualDrive.filesInAtlas.every(file => file.downloadUrl))
      return false
    */
    if(virtualDrive.selectedFiles.length == 0)
      return false

    return true
  }

  renderInBtnCover() {
    if(this.isInBtnEnabled())
      return null
    else
      return <div style={styleService.getCoverStyle()}></div>
  }

  renderOutBtnCover() {
    if(this.isOutBtnEnabled())
      return null
    else
      return <div style={styleService.getCoverStyle()}></div>
  }

  render() {
    const containerHeight = styleService.getContainerHeight()
    const height = styleService.getFileListHeight()

    const barWidth = 20
    const border = 1
    const criteria = 1
    const imageLength = barWidth - border*2 - criteria

    let style = {
      component: {
        display: 'inline-block',
        position: 'relative',
        width: barWidth + 'px',
        height: '100%',
        verticalAlign: 'top',
        borderLeft: border + 'px solid black',
        borderRight: border + 'px solid black',
        boxSizing: 'border-box',
        fontSize: 0
      },
      dummy: {
        width: '100%',
        height: (containerHeight - height) + 'px',
        background: 'gray'
      },
      in: {
        position: 'absolute',
        left: 0,
        top: (containerHeight - height) + 'px',
        width: '100%',
        height: (height/2) + 'px',
      },
      inImg: {
        display: 'inline-block',
        width: imageLength + 'px',
        height: imageLength + 'px',
        verticalAlign: 'middle'
      },
      out: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: (height/2) + 'px',
      },
      outImg: {
        display: 'inline-block',
        width: imageLength + 'px',
        height: imageLength + 'px',
        verticalAlign: 'middle'
      }
    }

    return (
      <div style={style.component}>
        <div style={style.dummy}/>
        <div style={style.in} onClick={this.onFilesInClick}>
          {styleService.renderVerticalCriteria(1)}
          <img src={fileInIcon} style={style.inImg}/>
          {styleService.renderHorizontalSeparator()}
          {this.renderInBtnCover()}
        </div>
        <div style={style.out} onClick={this.onFilesOutClick}>
          {styleService.renderVerticalCriteria(1)}
          <img src={fileOutIcon} style={style.outImg}/>
          {this.renderOutBtnCover()}
        </div>
      </div>
    )
  }
}
