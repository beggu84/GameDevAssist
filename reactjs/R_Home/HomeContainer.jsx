import React from "react"

import spIcon from "../images/spIcon.png"
import sbsIcon from "../images/sbsIcon.png"

export default class HomeContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onSPClick = this.onSPClick.bind(this)
    this.onSBSClick = this.onSBSClick.bind(this)
  }

  componentDidMount() {
  }

  onSPClick() {
    const redirectUrl = location.protocol + '//' +
      location.host + '/SpritePacker'
    location.href = redirectUrl
  }

  onSBSClick() {
    const redirectUrl = location.protocol + '//' +
      location.host + '/SpriteBakingStudio'
    location.href = redirectUrl
  }

  renderHeader() {
    let style = {
      header: {
        height: '100px',
        textAlign: 'center'
      },
      title: {
        display: 'inline-block',
        height: '100%',
        lineHeight: '100px',
        fontSize: '50px'
      }
    }

    return (
      <header style={style.header}>
        <div style={style.title}>GameDevAssist</div>
      </header>
    )
  }

  renderBody() {
    let style = {
      body: {
        width: '700px',
        margin: '50px auto 0 auto'
      },
      sp: {
        float: 'left',
        position: 'relative',
        cursor: 'pointer'
      },
      sbs: {
        float: 'right',
        position: 'relative',
        cursor: 'pointer'
      },
      sbsLink: {
        textDecoration: 'none',
        color: 'black'
      },
      title: {
        fontSize: '24px',
        textAlign: 'center',
      },
      icon: {
        width: '300px',
        height: '300px',
        border: '1px solid black'
      }
    }

    return (
      <section style={style.body}>
        <div style={style.sp}
          onClick={this.onSPClick}>
          <div style={style.title}>Sprite Packer</div>
          <img src={spIcon} style={style.icon}/>
        </div>
        <div style={style.sbs}
          onClick={this.onSBSClick}>
            <div style={style.title}>Sprite Baking Studio</div>
            <img src={sbsIcon} style={style.icon}/>
        </div>
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
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    )
  }
}
