import axios from "axios"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

import * as virtualDriveActions from "../actions/virtualDriveActions"

let _instance = null

export default class virtualDriveService {
  constructor() {
    if(_instance)
      return _instance
    _instance = this

    this.userId = ''
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch
  }

  getAtlases(userId) {
    this.userId = userId

    if(!this.userId || this.userId.length == 0) {
      console.log('no userId')
      return
    }

    const url = '/SpritePacker/' + this.userId + '/atlas/list'

    axios.get(url)
    .then(response => {
      this.dispatch(virtualDriveActions.initAtlases(response.data.atlases))
    })
    .catch(response => {
      console.log(response)
    })
  }

  saveAtlas(name, spriteFileIds) {
    if(!this.userId || this.userId.length == 0) {
      console.log('no userId')
      return
    }

    const url = '/SpritePacker/' + this.userId + '/atlas/save'

    let atlas = {
      name,
      spriteFileIds,
      date: new Date().getTime()
    }

    axios.post(url, atlas)
    .then(response => {
      this.dispatch(virtualDriveActions.saveAtlas(atlas))
    })
    .catch(response => {
      console.log(response)
    })
  }

  deleteAtlas(name) {
    if(!this.userId || this.userId.length == 0) {
      console.log('no userId')
      return
    }

    const url = '/SpritePacker/' + this.userId + '/atlas/delete'

    axios.post(url, {name})
    .then(response => {
      this.dispatch(virtualDriveActions.deleteAtlas(name))
    })
    .catch(response => {
      console.log(response)
    })
  }
}
