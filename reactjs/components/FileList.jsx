import React from "react"

import googleDriveService from "../services/googleDriveService"
import * as styleService from "../services/styleService"

import listViewIcon from "../images/ListViewIcon.png"
import gridViewIcon from "../images/GridViewIcon.png"

const ViewType = {
  List: 1,
  Grid: 2
}

export default class FileList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      viewType: ViewType.List
    }

    this.onListViewBtnClick = this.onListViewBtnClick.bind(this)
    this.onGridViewBtnClick = this.onGridViewBtnClick.bind(this)

    this.height = styleService.getFileListHeight()
    this.headerHeight = 20

    this.lastSelectedFileIndex = undefined
  }

  onListViewBtnClick() {
    this.setState({viewType: ViewType.List})
  }

  onGridViewBtnClick() {
    this.setState({viewType: ViewType.Grid})
  }

  onFileSelect(e, file, index) {
    if(e.shiftKey && this.lastSelectedFileIndex != undefined &&
      this.lastSelectedFileIndex != index) {
      const minIndex = Math.min(index, this.lastSelectedFileIndex)
      const maxIndex = Math.max(index, this.lastSelectedFileIndex)
      
      let selectedFiles = []
      for(let i=minIndex; i<=maxIndex; i++) {
        if(i != this.lastSelectedFileIndex)
          selectedFiles.push(this.props.files[i])
      }

      selectedFiles.forEach(file => {
        if(this.props.onFileSelect)
          this.props.onFileSelect(file)
      })

    } else {
      if(this.props.onFileSelect)
        this.props.onFileSelect(file)

      this.lastSelectedFileIndex = index
    }
  }

  renderHeader() {
    //if(!this.props.files || this.props.files.length == 0)
    //  return null
      
    let style = {
      header: {
        position: 'relative',
        width: '100%',
        height: this.headerHeight + 'px',
        fontSize: 0,
        background: 'lightgray',
        cursor: 'pointer'
      },
      viewTypeBtn: {
        display: 'inline-block',
        position: 'relative',
        width: '25%',
        height: '100%',
        verticalAlign: 'middle',
        textAlign: 'center'
      },
      viewTypeImg: {
        width: this.headerHeight + 'px',
        height: this.headerHeight + 'px',
        verticalAlign: 'middle'
      },
      reloadBtn: {
        display: 'inline-block',
        position: 'relative',
        width: '50%',
        height: '100%',
        verticalAlign: 'middle',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: (this.headerHeight+1) + 'px'
      }
    }

    return (
      <div style={style.header}>
        <div style={style.viewTypeBtn}
          onClick={this.onListViewBtnClick}>
          <img src={listViewIcon} style={style.viewTypeImg}/>
          {styleService.renderVerticalSeparator()}
        </div>
        <div style={style.viewTypeBtn}
          onClick={this.onGridViewBtnClick}>
          <img src={gridViewIcon} style={style.viewTypeImg}/>
          {styleService.renderVerticalSeparator()}
        </div>
        <div style={style.reloadBtn}
          onClick={this.props.reloadFiles}>
          Reload
        </div>
      </div>
    )
  }

  renderFiles() {
    if(!this.props.files || this.props.files.length == 0)
      return null

    let style = {
      files: {
        height: (this.height-this.headerHeight*2) + 'px',
        overflowY: 'auto'
      }
    }

    return (
      <div className="ms_scrollbar" style={style.files}>
        {
          this.props.files.map((file, index) =>
            this.state.viewType == ViewType.List ?
            this.renderListFile(file, index) :
            this.renderGridFile(file, index)
          )
        }
      </div>
    )
  }

  renderListFile(file, index) {
    const lineHeight = 25

    let style = {
      file: {
        position: 'relative',
        height: lineHeight + 'px',
        padding: '1px',
        fontSize: '14px',
      },
      image: {
        width: lineHeight + 'px',
        height: lineHeight + 'px',
        verticalAlign: 'middle'
      }
    }

    if(this.props.selectedFiles && this.props.selectedFiles.length > 0) {
      if(this.props.selectedFiles.includes(file))
        style.file.background = 'lightgreen'
    }

    return (
      <div key={file.id} style={style.file}
        onClick={e => this.onFileSelect(e, file, index)}>
        <img src={file.thumbnailLink} style={style.image}/>
        &nbsp;
        {file.name ? file.name : file.title}
        {this.renderFileCover1(file)}
        {this.renderFileCover2(file)}
      </div>
    )
  }

  renderGridFile(file, index) {
    const padding = 2
    const imageLength = this.props.parentWidth / 3 - padding * 2

    let style = {
      file: {
        display: 'inline-block',
        position: 'relative',
        padding: padding + 'px',
        fontSize: '10px',
        textAlign: 'center'
      },
      image: {
        width: imageLength + 'px',
        height: imageLength + 'px',
      }
    }

    if(this.props.selectedFiles && this.props.selectedFiles.length > 0) {
      if(this.props.selectedFiles.includes(file))
        style.file.background = 'lightgreen'
    }

    //onClick={this.onFileSelect.bind(this, file)}>

    return (
      <div key={file.id} style={style.file}
        onClick={e => this.onFileSelect(e, file, index)}>
        <img src={file.thumbnailLink} style={style.image}/>
        <br/>
        {file.name ? file.name : file.title}
        {this.renderFileCover1(file)}
        {this.renderFileCover2(file)}
      </div>
    )
  }

  renderFileCover1(file) {
    if(file.downloadUrl)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  renderFileCover2(file) {
    if(!this.props.fullDownload)
      return null

    if(file.image)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  renderFooter() {
    //if(!this.props.files || this.props.files.length == 0)
    //  return null

    let defaultBtnWidth = undefined
    let clearBtnWidth = undefined
    let clearBtnDisplay = undefined

    if(this.props.onFileListClear) {
      defaultBtnWidth = '33%'
      clearBtnDisplay = 'inline-block'
      clearBtnWidth = '33%'
    } else {
      defaultBtnWidth = '50%'
      clearBtnDisplay = 'none'
      clearBtnWidth = 0
    }
      
    let style = {
      footer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: this.headerHeight + 'px',
        fontSize: 0,
        background: '#F0F0F0',
        cursor: 'pointer'
      },
      defaultBtn: {
        display: 'inline-block',
        position: 'relative',
        width: defaultBtnWidth,
        height: '100%',
        verticalAlign: 'middle',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: (this.headerHeight+2) + 'px'
      },
      clearBtn: {
        display: clearBtnDisplay,
        width: clearBtnWidth,
        height: '100%',
        verticalAlign: 'middle',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: (this.headerHeight+2) + 'px'
      },
      text: {
        display: 'inline-block',
        verticalAlign: 'middle'
      }
    }

    return (
      <div style={style.footer}>
        <div style={style.defaultBtn}
          onClick={this.props.onAllFilesSelect}>
          All
          {styleService.renderVerticalSeparator()}
          {this.renderAllBtnCover()}
        </div>
        <div style={style.defaultBtn}
          onClick={this.props.onAllFilesUnselect}>
          None
          {
            this.props.onFileListClear &&
            styleService.renderVerticalSeparator()
          }
        </div>
        <div style={style.clearBtn}
          onClick={this.props.onFileListClear}>
          Clear
        </div>
      </div>
    )
  }

  renderAllBtnCover() {
    let allFilesValid = this.props.files.every(file => {
      return file.downloadUrl
    })

    if(this.fullDownload) {
      allFilesValid &= this.props.files.every(file => {
        return file.image
      })
    }
    
    if(allFilesValid)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  render() {
    let style = {
      component: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: this.height + 'px'
      }
    }

    return (
      <div style={style.component}>
        {this.renderHeader()}
        {this.renderFiles()}
        {this.renderFooter()}
      </div>
    )
  }
}
