import React from "react"
import { connect } from "react-redux"

import * as virtualDriveActions from "../actions/virtualDriveActions"

import virtualDriveService from "../services/virtualDriveService"
import googleDriveService from "../services/googleDriveService"
import fileStorage from "../services/fileStorage"
import * as styleService from "../services/styleService"

@connect(state => ({
}))
export default class Workspace extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: ''
    }

    this.virtualDriveService = new virtualDriveService()
    this.googleDriveService = new googleDriveService()
    this.fileStorage = new fileStorage()

    this.onNameChange = this.onNameChange.bind(this)
    this.onSaveBtnClick = this.onSaveBtnClick.bind(this)
    this.onLoadBtnClick = this.onLoadBtnClick.bind(this)
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this)

    //this.height = 183 // 20 + 110 + 23+5*2 + 20
    this.lineHeight = 20
    this.nameInputHeight = 33 // 23 + 5(padding)*2
    this.atlasListHeight = this.props.height - this.lineHeight*2 - this.nameInputHeight

    this.nameStyle = {
      display: 'inline-block',
      position: 'relative',
      width: '70%',
      height: '100%',
      fontSize: '14px',
      textAlign: 'center',
      lineHeight: (this.lineHeight+1) + 'px',
      boxSizing: 'border-box',
      verticalAlign: 'top'
    }
    this.sizeStyle = {
      display: 'inline-block',
      width: '30%',
      height: '100%',
      fontSize: '14px',
      textAlign: 'center',
      lineHeight: (this.lineHeight+1) + 'px',
      boxSizing: 'border-box'
    }
  }

  onAtlasSelect(atlas) {
    this.setState({name: atlas.name})

    const {dispatch} = this.props
    dispatch(virtualDriveActions.selectAtlas(atlas))
  }

  onNameChange(e) {
    const inputName = e.target.value
    this.setState({name: inputName})

    const {dispatch} = this.props

    let selected = false
    for(let i=0; i<this.props.atlases.length; i++) {
      const atlas = this.props.atlases[i]
      if(atlas.name === inputName) {
        dispatch(virtualDriveActions.selectAtlas(atlas))
        selected = true
        break
      }
    }

    if(!selected)
      dispatch(virtualDriveActions.unselectAtlas())
  }

  onSaveBtnClick() {
    if(this.state.name.length == 0)
      return

    const spriteFileIds = []
    this.props.spriteFiles.forEach(file => {
      spriteFileIds.push(file.id)
    })

    this.virtualDriveService.saveAtlas(this.state.name, spriteFileIds)
  }

  onLoadBtnClick() {
    if(!this.props.selectedAtlas)
      return

    const {dispatch} = this.props

    let spriteFiles = []
    this.props.selectedAtlas.spriteFileIds.forEach(fileId => {
      spriteFiles.push({id: fileId})
    })
    dispatch(virtualDriveActions.setFiles(spriteFiles))
    
    spriteFiles.forEach(file => {
      const refFile = this.fileStorage.getSameFile(file.id)
      if(refFile) {
        file = refFile
        dispatch(virtualDriveActions.updateFile(file))
      } else {
        this.googleDriveService.loadFileDetail(file, (detailedFile) => {
          dispatch(virtualDriveActions.updateFile(detailedFile))
          this.fileStorage.addFile(file)
        })
      }
    })
  }

  onDeleteBtnClick() {
    if(!this.props.selectedAtlas)
      return

    this.setState({name: ''})
    this.virtualDriveService.deleteAtlas(this.props.selectedAtlas.name)
  }

  renderHeader() {
    let style = {
      header: {
        position: 'relative',
        height: this.lineHeight + 'px',
        fontSize: 0,
        background: 'lightgray'
      }
    }

    return (
      <div style={style.header}>
        <div style={this.nameStyle}>
          Name
          {styleService.renderVerticalSeparator()}
        </div>
        <div style={this.sizeStyle}>Sprites</div>
      </div>
    )
  }

  renderAtlases() {
    if(!this.props.atlases)
      return null

    let style = {
      atlases: {
        height: this.atlasListHeight + 'px',
        overflowY: 'auto'
      }
    }

    let nameStyle = Object.assign({}, this.nameStyle)
    nameStyle.paddingLeft = '2px'
    nameStyle.textAlign = 'left'

    return (
      <div className="ms_scrollbar" style={style.atlases}>
        {
          this.props.atlases.map((atlas, index) =>
            this.renderAtlas(atlas, index, nameStyle)
          )
        }
      </div>
    )
  }

  renderAtlas(atlas, index, nameStyle) {
    let style = {
      atlas: {
        position: 'relative',
        height: this.lineHeight + 'px',
        fontSize: 0,
        background: '#F3F3F3'
      }
    }

    if(atlas === this.props.selectedAtlas)
      style.atlas.background = 'yellow'

    return (
      <div key={index} style={style.atlas}
        onClick={this.onAtlasSelect.bind(this, atlas)}>>
        <div style={nameStyle}>
          {atlas.name}
        </div>
        <div style={this.sizeStyle}>
          {atlas.spriteFileIds.length}
        </div>
      </div>
    )
  }

  renderNameInput() {
    let style = {
      holder: {
        padding: '5px',
        fontSize: '0',
        height: this.nameInputHeight + 'px',
        boxSizing: 'border-box'
      },
      name: {
        display: 'inline-block',
        width: '40%',
        fontSize: '14px',
        boxSizing: 'border-box'
      },
      input: {
        width: '60%',
        fontSize: '14px',
        boxSizing: 'border-box'
      }
    }

    return (
      <div style={style.holder}>
        <label style={style.name}>Name:</label>
        <input type="text" style={style.input}
          value={this.state.name}
          onChange={this.onNameChange}/>
      </div>
    )
  }
  
  renderFooter() {
    let style = {
      footer: {
        position: 'relative',
        height: this.lineHeight + 'px',
        fontSize: 0,
        background: '#F0F0F0',
        cursor: 'pointer'
      },
      button: {
        display: 'inline-block',
        position: 'relative',
        width: '33.33%',
        height: '100%',
        verticalAlign: 'middle',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: (this.lineHeight+2) + 'px'
      }
    }

    return (
      <div style={style.footer}>
        <div style={style.button}
          onClick={this.onSaveBtnClick}>
          Save
          {styleService.renderVerticalSeparator()}
          {this.renderSaveBtnCover()}
        </div>
        <div style={style.button}
          onClick={this.onLoadBtnClick}>
          Load
          {styleService.renderVerticalSeparator()}
          {this.renderLoadBtnCover()}
        </div>
        <div style={style.button}
          onClick={this.onDeleteBtnClick}>
          Delete
          {this.renderDeleteBtnCover()}
        </div>
      </div>
    )
  }

  renderSaveBtnCover() {
    if(this.state.name.length > 0)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  renderLoadBtnCover() {
    if(this.props.selectedAtlas)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  renderDeleteBtnCover() {
    if(this.props.selectedAtlas)
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
        height: this.props.height + 'px',
        fontSize: '10px'
      }
    }

    return (
      <div style={style.component}>
        {this.renderHeader()}
        {this.renderAtlases()}
        {this.renderNameInput()}
        {this.renderFooter()}
      </div>
    )
  }
}
