import React from "react"
import { connect } from "react-redux"

import googleService from "../services/googleService"
import googleDriveService from "../services/googleDriveService"
import virtualDriveService from "../services/virtualDriveService"
import packerService from "../services/packerService"
import * as styleService from "../services/styleService"
import * as localeService from "../services/localeService"

import FinderWindow from "../components/FinderWindow"
import FileInOutBar from "../components/FileInOutBar"
import InputWindow from "../components/InputWindow"
import OutputWindow from "../components/OutputWindow"
import MenuWindow from "../components/MenuWindow"

const version = '1.0.0'

@connect(state => ({
  google: state.google
}))
export default class SPContainer extends React.Component {
  constructor(props) {
    super(props)

    this.googleService = new googleService()
    this.googleDriveService = new googleDriveService()
    this.virtualDriveService = new virtualDriveService()
    this.packerService = new packerService()

    const {dispatch} = this.props
    this.googleService.setDispatch(dispatch)
    this.googleDriveService.setDispatch(dispatch)
    this.virtualDriveService.setDispatch(dispatch)
    this.packerService.setDispatch(dispatch)

    this.onSignedIn = this.onSignedIn.bind(this)
    this.googleService.setSignedInCallback(this.onSignedIn)

    this.onHomeClick = this.onHomeClick.bind(this)
    this.onManualClick = this.onManualClick.bind(this)
    this.onSBSClick = this.onSBSClick.bind(this)
    this.onPrivacyPolicyClick = this.onPrivacyPolicyClick.bind(this)

    this.containerHeight = 500
    styleService.setContainerHeight(this.containerHeight)

    const fileListHeight = 420
    styleService.setFileListHeight(fileListHeight)
  }

  componentDidMount() {
    this.googleService.init()
  }

  onSignedIn(userId) {
    this.virtualDriveService.getAtlases(userId)
  }

  onHomeClick() {
    const redirectUrl = location.protocol + '//' + location.host
    location.href = redirectUrl
  }

  onManualClick() {
    const redirectUrl = location.protocol + '//' +
      location.host + location.pathname +
      'manual/' + localeService.getLocale()
    location.href = redirectUrl
  }

  onSBSClick() {
    const redirectUrl = location.protocol + '//' +
      location.host + '/SpriteBakingStudio'
    location.href = redirectUrl
  }

  onPrivacyPolicyClick() {
    const redirectUrl = location.protocol + '//' +
      //location.host + '/PrivacyPolicy'
      location.host + '/PrivatePolicy'
    location.href = redirectUrl
  }

  renderHeader() {
    let style = {
      header: {
        height: '50px',
        textAlign: 'center'
      },
      title: {
        display: 'inline-block',
        height: '100%',
        lineHeight: '50px',
        fontSize: '30px'
      },
      version: {
        display: 'inline-block',
        fontSize: '10px',
        verticalAlign: 'text-bottom'
      }
    }

    return (
      <header style={style.header}>
        <div style={style.title}>Sprite Packer</div>
        <div style={style.version}>{version}</div>
      </header>
    )
  }

  renderNav() {
    let style = {
      nav: {
        height: '30px',
        lineHeight: '30px',
        fontSize: '16px'
      },
      item: {
        cursor: 'pointer',
        marginRight: '20px',
        textDecoration: 'none',
        color: 'black'
      }
    }

    return (
      <div style={style.nav}>
        <span style={style.item}
          onClick={this.onHomeClick}>
          Home
        </span>
        <span style={style.item}
          onClick={this.onManualClick}>
          Manual
        </span>
        <span style={style.item}
          onClick={this.onSBSClick}>
          SpriteBakingStudio
        </span>
      </div>
    )
  }

  renderFooter() {
    let style = {
      footer: {
        height: '30px',
        lineHeight: '30px',
        fontSize: '16px',
      },
      privatePolicy: {
        float: 'right',
        cursor: 'pointer'
      }
    }

    return (
      <footer style={style.footer}>
        <div style={style.privatePolicy}
          onClick={this.onPrivacyPolicyClick}>
          Privacy Policy
        </div>
      </footer>
    )
  }

  render() {
    const normalWindowWidth = 180
    const fileInOutBarWidth = 20
    const outputWindowLength = this.containerHeight
    const containerWidth = normalWindowWidth * 3 + fileInOutBarWidth + outputWindowLength

    let style = {
      container: {
        width: containerWidth + 'px',
        margin: '0 auto'
      },
      body: {
        width: '100%',
        height: styleService.getContainerHeight(),
        border: '1px solid black',
        fontSize: 0
      }
    }

    return (
      <div style={style.container}>
        {this.renderHeader()}
        {this.renderNav()}
        <section style={style.body}>
          <FinderWindow width={normalWindowWidth}/>
          <FileInOutBar width={fileInOutBarWidth}/>
          <InputWindow width={normalWindowWidth}/>
          <OutputWindow length={outputWindowLength}/>
          <MenuWindow width={normalWindowWidth}/>
        </section>
        {this.renderFooter()}
      </div>
    )
  }
}
