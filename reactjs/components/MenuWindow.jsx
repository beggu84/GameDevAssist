import React from "react"
import { connect } from "react-redux"

import googleService from "../services/googleService"
import packerService from "../services/packerService"
import * as styleService from "../services/styleService"
import * as spritemapService from "../services/spritemapService"

import Workspace from "../components/Workspace"

@connect(state => ({
  google: state.google,
  virtualDrive: state.virtualDrive
}))
export default class MenuWindow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      padding: 2,
      todoTrim: false,
      downloadable: false,
      spritesheetName: 'spritesheet',
      spritemapType: spritemapService.Type.Simple,
      spritemapCompress: true,
      spritemapName: 'spritemap'
    }

    this.googleService = new googleService()
    this.packerService = new packerService()

    this.onPaddingChange = this.onPaddingChange.bind(this)
    this.onTodoTrimChange = this.onTodoTrimChange.bind(this)
    this.onPackBtnClick = this.onPackBtnClick.bind(this)
    this.onSpritesheetNameChange = this.onSpritesheetNameChange.bind(this)
    this.onSpritemapTypeChange = this.onSpritemapTypeChange.bind(this)
    this.onSpritemapCompressChange = this.onSpritemapCompressChange.bind(this)
    this.onSpritemapNameChange = this.onSpritemapNameChange.bind(this)
  }

  componentDidMount() {
    let spritesheetDownload = document.getElementById('spritesheet-download')
    spritesheetDownload.addEventListener('click', () => {
      const spritesheetUrl = this.packerService.getSpritesheetUrl()
      if(spritesheetUrl) {
        spritesheetDownload.href = spritesheetUrl
        spritesheetDownload.download = this.state.spritesheetName + '.png'
      }
    }, false)

    let spritemapDownload = document.getElementById('spritemap-download')
    spritemapDownload.addEventListener('click', () => {
      const spritemapText = this.packerService.getSpritemapText(
        this.state.spritemapType,
        this.state.spritemapCompress
      )
      if(spritemapText) {
        //console.log(spritemapText)
        spritemapDownload.href =
          'data:text/plain;charset=utf-8,' + encodeURIComponent(spritemapText)
        spritemapDownload.download =
          this.state.spritemapName + '.' + spritemapService.getExtension(this.state.spritemapType)
      }
    }, false)
  }

  onPaddingChange(e) {
    this.setState({padding: Number(e.target.value)})
  }

  onTodoTrimChange(e) {
    this.setState({todoTrim: e.target.checked})
  }

  onPackBtnClick() {
    const {virtualDrive} = this.props

    const promise = setInterval(() => {
      let allImageLoaded = true
      for(let i=0; i<virtualDrive.filesInAtlas.length; i++) {
        if(!virtualDrive.filesInAtlas[i].image) {
          allImageLoaded = false
          break
        }
      }

      if(allImageLoaded) {
        clearInterval(promise)
        const options = Object.assign({}, this.state)
        this.packerService.packAndDrawImages(virtualDrive.filesInAtlas, options)
        this.setState({downloadable: true})
      }
    }, 10)
  }

  onSpritesheetNameChange(e) {
    this.setState({spritesheetName: e.target.value})
  }

  onSpritemapTypeChange(e) {
    this.setState({spritemapType: e.target.value})
  }

  onSpritemapCompressChange(e) {
    this.setState({spritemapCompress: e.target.checked})
  }

  onSpritemapNameChange(e) {
    this.setState({spritemapName: e.target.value})
  }

  renderDownloadContents(parentStyle) {
    let localStyle = {
      download: {
        position: 'relative',
        visibility: (this.state.downloadable ? 'visible' : 'hidden'),
        fontSize: '10px'
      },
      separator: {
        margin: '0 auto',
        width: '95%',
        height: '1px',
        background: 'gray'
      }
    }

    const style = Object.assign({}, parentStyle, localStyle)

    return (
      <div style={style.download}>
        <br/><br/>
        <div style={style.separator}/>
        <br/>
        <div style={style.optionLine}>
          <label style={style.optionName}>Name:</label>
          <input type="text" style={style.optionInput}
            value={this.state.spritesheetName}
            onChange={this.onSpritesheetNameChange}/>
        </div>
        <a style={styleService.getButtonStyle()} id="spritesheet-download">Download Spritesheet</a>
        <br/><br/>

        <div style={style.optionLine}>
          <label style={style.optionName}>Type:</label>
          <select style={style.optionSelect}
            value={this.state.spritemapType}
            onChange={this.onSpritemapTypeChange}>
            <option value={spritemapService.Type.Simple}>Simple</option>
            <option value={spritemapService.Type.JSON}>JSON</option>
            <option value={spritemapService.Type.XML}>XML</option>
          </select>
        </div>
        {
          this.state.spritemapType != spritemapService.Type.Simple &&
          <div style={style.optionLine}>
            <label style={style.optionName}>Compress:</label>
            <input type="checkbox"
              checked={this.state.spritemapCompress}
              onChange={this.onSpritemapCompressChange}/>
          </div>
        }
        <div style={style.optionLine}>
          <label style={style.optionName}>Name:</label>
          <input type="text" style={style.optionInput}
            value={this.state.spritemapName}
            onChange={this.onSpritemapNameChange}/>
        </div>
        <a style={styleService.getButtonStyle()} id="spritemap-download">Download Spritemap</a>
      </div>
    )
  }

  renderCover() {
    const {google, virtualDrive} = this.props

    if(google.isSignedIn && virtualDrive.filesInAtlas.length > 0)
      return null
    else
      return <div style={styleService.getCoverStyle()}/>
  }

  render() {
    const {virtualDrive} = this.props

    const upperHeight = 300
    const workspaceHeight = styleService.getContainerHeight() - upperHeight

    let style = {
      component: {
        display: 'inline-block',
        position: 'relative',
        width: this.props.width + 'px',
        height: '100%'
      },
      upper: {
        position: 'relative',
        width: this.props.width + 'px',
        padding: '5px',
        height: upperHeight + 'px',
        fontSize: '14px',
        //verticalAlign: 'top',
        boxSizing: 'border-box'
      },
      optionLine: {
        position: 'relative',
        width: '100%',
        fontSize: 0
      },
      optionName: {
        display: 'inline-block',
        width: '40%',
        fontSize: '14px',
        boxSizing: 'border-box'
      },
      optionInput: {
        width: '60%',
        fontSize: '14px',
        boxSizing: 'border-box'
      }
    }

    return (
      <div style={style.component}>
        <div style={style.upper}>
          <div style={style.optionLine}>
            <label style={style.optionName}>Padding:</label>
            <input type="number" style={style.optionInput}
              value={this.state.padding}
              onChange={this.onPaddingChange}/>
          </div>
          <div style={style.optionLine}>
            <label style={style.optionName}>Trim:</label>
            <input type="checkbox"
              checked={this.state.todoTrim}
              onChange={this.onTodoTrimChange}/>
          </div>

          <div style={styleService.getButtonStyle()}
            onClick={this.onPackBtnClick}>Pack</div>

          {this.renderDownloadContents(style)}

          {this.renderCover()}
        </div>

        <Workspace atlases={virtualDrive.atlases}
          selectedAtlas={virtualDrive.selectedAtlas}
          spriteFiles={virtualDrive.filesInAtlas}
          height={workspaceHeight}/>
      </div>
    )
  }
}
