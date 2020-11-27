import * as packerActions from "../actions/packerActions"

import * as spritemapService from "../services/spritemapService"

let _instance = null

export default class packerService {
  constructor() {
    if(_instance)
      return _instance
    _instance = this

    this.isBlockVisible = false
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch
  }

  setCanvas(canvas, initialLength) {
    this.canvas = canvas
    this.initialCanvasLength = initialLength

    this.canvas.width = initialLength
    this.canvas.height = initialLength
  }

  packAndDrawImages(filesInAtlas, options) {
    this.filesInAtlas = filesInAtlas.slice()
    this.options = options

    let todoFiles = this.initImages()
    this.packImages(todoFiles)
    this.drawImages()

    if(this.options.todoTrim && this.checkTrimmable()) {
      todoFiles = this.initImages(true)
      this.packImages(todoFiles)
      this.drawImages(true)
    }

    this.dispatch(packerActions.updateCanvasLength(this.canvas.width))
  }

  initImages(todoTrim) {
    let todoFiles = []
    this.filesInAtlas.forEach(file => {
      file.x = -100000
      file.y = -100000
      if(!todoTrim) {
        file.w = file.image.width
        file.h = file.image.height
      }
      todoFiles.push(file)
    })

    todoFiles.sort((a,b) => {
      return a.h - b.h
    })

    this.maxX = 0
    this.maxY = 0

    this.canvas.width = this.initialCanvasLength
    this.canvas.height = this.initialCanvasLength

    return todoFiles
  }

  packImages(todoFiles) {
    let nextX = 0
    let nextY = 0

    while(todoFiles.length > 0) {
      let file = todoFiles.pop()
  
      if (this.maxX == 0) {
        file.x = 0
        file.y = 0
        nextX += file.w + this.options.padding
  
      } else {
        if (!this.placeImage(file)) {
          if (nextX + file.w > this.maxY) {
            nextY = this.maxY
            nextX = 0
          }
          file.x = nextX
          file.y = nextY
          nextX += file.w + this.options.padding
        }
      }
  
      this.maxX = Math.max(this.maxX, file.x + file.w + this.options.padding)
      this.maxY = Math.max(this.maxY, file.y + file.h + this.options.padding)

      const maxLength = Math.max(this.maxX, this.maxY)
      let squareCanvasLength = 2
      while(maxLength > squareCanvasLength)
        squareCanvasLength *= 2

      if(this.canvas.width < squareCanvasLength) {
        this.canvas.width = squareCanvasLength
        this.canvas.height = squareCanvasLength
        //console.log('Size: ' + this.canvas.width + ', ' + this.canvas.height)
      }
    }
  }

  placeImage(file) {
    for (let x = 0; x < this.maxX; x += this.options.padding) {
      for (let y = 0; y < this.maxX; y += this.options.padding) {
        if (!this.imageCollide(file, x, y)) {
          file.x = x
          file.y = y
          return true
        }
      }
    }

    return false
  }

  imageCollide(file, x, y) {
    for (let i = 0; i < this.filesInAtlas.length; i++) {
      const s2 = this.filesInAtlas[i]
      if (s2 === file)
        continue

      if (!(s2.x + s2.image.width + this.options.padding < x ||
            s2.x > x + file.w + this.options.padding ||
            s2.y + s2.image.height + this.options.padding < y ||
            s2.y > y + file.h + this.options.padding))
        return true
    }

    return false
  }

  drawImages(todoTrim) {
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.filesInAtlas.forEach(file => {
      //console.log(file.x + ', ' + file.y + ', ' + file.w + ', ' + file.h)

      if(todoTrim) {
        ctx.drawImage(file.image,
          file.tX, file.tY, file.w, file.h,
          file.x, file.y, file.w, file.h)
      } else {
        //inversed y = this.canvas.height - file.h - file.y
        ctx.drawImage(file.image,
          file.x, file.y, file.w, file.h)
      }

      if(this.isBlockVisible &&
        (!this.options.todoTrim || todoTrim)) {
        ctx.lineWidth = 1

        ctx.strokeStyle = '#008000'
        ctx.strokeRect(0, 0, this.maxX, this.maxY)

        ctx.strokeStyle = '#FF0000'
        ctx.strokeRect(file.x, file.y, file.w, file.h)
      }
    })
  }

  checkTrimmable() {
    const ctx = this.canvas.getContext('2d')
    
    let isTrimmable = false
    this.filesInAtlas.forEach(file => {
      const pixels = ctx.getImageData(file.x, file.y, file.w, file.h)

      let bound = {
        left: file.w,
        top: file.h,
        right: 0,
        bottom: 0
      }

      for (let i = 0; i < pixels.data.length; i += 4) {
        const alpha = pixels.data[i+3]

        const x = (i / 4) % file.w
        const y = ~~((i / 4) / file.w)

        if (alpha > 0) {
          if (x < bound.left)
            bound.left = x
          if (y < bound.top)
            bound.top = y
          if (bound.right < x)
            bound.right = x
          if (bound.bottom < y)
            bound.bottom = y
        }
      }

      file.tX = bound.left
      file.tY = bound.top
      const tW = bound.right - bound.left + 1
      const tH = bound.bottom - bound.top + 1

      if(tW < file.w || tH < file.h) {
        //console.log(file.name + ' - ' + file.w + ', ' + file.h + ' : ' + tW + ', ' + tH)
        file.w = tW
        file.h = tH
        isTrimmable = true
      }
    })

    return isTrimmable
  }

  getSpritesheetUrl() {
    if(!this.filesInAtlas)
      return undefined

    return this.canvas.toDataURL()
  }

  getSpritemapText(type, todoCompress) {
    if(!this.filesInAtlas)
      return undefined

    let text = ''
    if(type == spritemapService.Type.JSON) {
      if(todoCompress) {
        let array = []
        this.filesInAtlas.forEach((file, index) => {
          const obj = {
            name: this.extractSpriteName(file),
            x: file.x,
            y: file.y,
            w: file.w,
            h: file.h
          }
          array.push(obj)
        })
        text = JSON.stringify(array)

      } else {
        text = '[\n'
        this.filesInAtlas.forEach((file, index) => {
          text += '\t{\n'
          text += '\t\t"name":"' + this.extractSpriteName(file) + '",\n'
          text += '\t\t"x":' + file.x + ',\n'
          text += '\t\t"y":' + file.y + ',\n'
          text += '\t\t"w":' + file.w + ',\n'
          text += '\t\t"h":' + file.h + '\n'
          text += '\t}'
          if(index < this.filesInAtlas.length-1)
            text += ','
          text += '\n'
        })
        text += ']'
      }

    } else if(type == spritemapService.Type.XML) {
      if(todoCompress) {
        text = '<?xml version="1.0" encoding="utf-8"?>'
        text += '<spritemap>'
        this.filesInAtlas.forEach((file, index) => {
          text += '<sprite>'
          text += '<name>' + this.extractSpriteName(file) + '</name>'
          text += '<x>' + file.x + '</x>'
          text += '<y>' + file.y + '</y>'
          text += '<w>' + file.w + '</w>'
          text += '<h>' + file.h + '</h>'
          text += '</sprite>'
        })
        text += '</spritemap>'

      } else {
        text = '<?xml version="1.0" encoding="utf-8"?>\n'
        text += '<spritemap>\n'
        this.filesInAtlas.forEach((file, index) => {
          text += '\t<sprite>\n'
          text += '\t\t<name>' + this.extractSpriteName(file) + '</name>\n'
          text += '\t\t<x>' + file.x + '</x>\n'
          text += '\t\t<y>' + file.y + '</y>\n'
          text += '\t\t<w>' + file.w + '</w>\n'
          text += '\t\t<h>' + file.h + '</h>\n'
          text += '\t</sprite>\n'
        })
        text += '</spritemap>'
      }

    } else {
      this.filesInAtlas.forEach((file, index) => {
        text += this.extractSpriteName(file) + ','
             + file.x + ','
             + file.y + ','
             + file.w + ','
             + file.h
        if(index < this.filesInAtlas.length-1)
          text += '\n'
      })
    }

    return text
  }

  extractSpriteName(file) {
    const fileName = (file.name ? file.name : file.title)
    const dotPos = fileName.indexOf('.')
    if(dotPos >= 0)
      return fileName.slice(0, dotPos)
    else
      return fileName
  }
}
