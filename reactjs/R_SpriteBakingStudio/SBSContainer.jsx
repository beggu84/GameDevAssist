import React from "react"

import * as localeService from "../services/localeService"

const version = '1.7.0'

export default class SBSContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onHomeClick = this.onHomeClick.bind(this)
    this.onSPClick = this.onSPClick.bind(this)
  }

  componentDidMount() {
  }

  onHomeClick() {
    const redirectUrl = location.protocol + '//' + location.host
    location.href = redirectUrl
  }

  onSPClick() {
    const redirectUrl = location.protocol + '//' +
      location.host + '/SpritePacker'
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
        <div style={style.title}>Sprite Baking Studio</div>
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

    let manualUrl = 'https://putrescible-tachome.000webhostapp.com/SpriteBakingStudio/readme_' + localeService.getLocale() + '.pdf'

    return (
      <div style={style.nav}>
        <span style={style.item}
          onClick={this.onHomeClick}>
          Home
        </span>
        <a href={manualUrl} style={style.item}>
          Manual
        </a>
        <span style={style.item}
          onClick={this.onSPClick}>
          SpritePacker
        </span>
      </div>
    )
  }

  renderBody() {
    let style = {
      body: {
        margin: '30px auto 0 auto'
      },
    }

    return (
      <section style={style.body}>
        <b>Sprite Baking Studio</b> is an automatical sprite generating tool in Unity Asset Store.
        <br/>
        An animating 3D model is snapshotted into 2D sprite sheets.
        <br/><br/>
        You can download here.&nbsp;
        <a href="https://www.assetstore.unity3d.com/#!/content/31247" target="_blank">Asset Store</a>
        <br/><br/>
        If any questions or requirements, feel free to contact me.&nbsp;<a href="mailto:beggu84@gmail.com">beggu84@gmail.com</a>
        <br/>
        or comment here.
      </section>
    )
  }

  renderFooter() {
    let style = {
      footer: {
        height: '30px',
        lineHeight: '30px',
        fontSize: '16px',
      }
    }

    return (
      <footer style={style.footer}>
      </footer>
    )
  }

  render() {
    let style = {
      container: {
        width: '1060px',
        margin: '0 auto'
      },
      body: {
        width: '100%',
        //height: '500px',
        //border: '1px solid black',
        fontSize: 0
      }
    }

    return (
      <div style={style.container}>
        {this.renderHeader()}
        {this.renderNav()}
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    )
  }
}
