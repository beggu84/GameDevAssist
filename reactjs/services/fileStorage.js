let _instance = null

export default class fileStorage {
  constructor() {
    if(_instance)
      return _instance
    _instance = this

    this.cachedFiles = []
  }
  
  getSameFile(fileId) {
    return this.cachedFiles.find(
      cchFile => cchFile.id === fileId && cchFile.image
    )
  }

  addFile(file) {
    this.cachedFiles.push(file)
  }

  updateFile(file) {
    let newFile = true
    for(let i=0; i<this.cachedFiles.length; i++) {
      if(this.cachedFiles[i].id === file.id) {
        this.cachedFiles[i] = file
        newFile = false
      }
    }

    if(newFile)
      this.cachedFiles.push(file)
  }

  printFileIds() {
    this.cachedFiles.forEach(file => {
      console.log(file.id)
    })
  }
}
