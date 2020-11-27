import React from "react"
import { connect } from "react-redux"

import packerService from "../services/packerService"
import * as styleService from "../services/styleService"

@connect(state => ({
  google: state.google,
  virtualDrive: state.virtualDrive,
  packer: state.packer
}))
export default class OutputWindow extends React.Component {
  constructor(props) {
    super(props)

    this.packerService = new packerService()

    this.mainCanvas = null
  }

  componentDidMount() {
    const {packer} = this.props
    
    this.mainCanvas = document.getElementById('main_canvas')
    this.packerService.setCanvas(this.mainCanvas, packer.canvasLength)

    this.drawBackground()
  }

  drawBackground() {
    let backCanvas = document.getElementById('back_canvas')
    backCanvas.width = 256
    backCanvas.height = 256

    const boxLength = 4

    const ctx = backCanvas.getContext('2d')
    for(let y = 0; y < backCanvas.height; y += boxLength) {
      for(let x = 0; x < backCanvas.width; x += boxLength) {
        let yIndex = y / boxLength
        let xIndex = x / boxLength
        if(yIndex % 2 == 0)
          ctx.fillStyle = (xIndex % 2 == 0 ? 'gray' : 'lightgray')
        else
          ctx.fillStyle = (xIndex % 2 == 0 ? 'lightgray' : 'gray')
        ctx.fillRect(x, y, boxLength, boxLength)
      }
    }
  }

  renderCanvasSize() {
    if(!this.mainCanvas)
      return null
      
    let style = {
      canvasSize: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        padding: '1px',
        fontSize: '16px',
        background: 'white',
        opacity: 0.5
      }
    }

    return (
      <span style={style.canvasSize}>
        {this.mainCanvas.width} X {this.mainCanvas.height}
      </span>
    )
  }

  render() {
    let style = {
      component: {
        display: 'inline-block',
        position: 'relative',
        width: styleService.getContainerHeight(),
        height: '100%',
        verticalAlign: 'top',
        fontSize: 0
      },
      backCanvas: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        //background: 'transparent'
      },
      mainCanvas: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        //background: 'transparent'
      }
    }

    return (
      <div style={style.component}>
        <canvas id="back_canvas" style={style.backCanvas}/>
        <canvas id="main_canvas" style={style.mainCanvas}/>
        {this.renderCanvasSize()}
      </div>
    )
  }
}
