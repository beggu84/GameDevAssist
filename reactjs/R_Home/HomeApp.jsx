import React from "react"
import { render } from "react-dom"

import HomeContainer from "./HomeContainer"

import "../styles/body.css"

class HomeApp extends React.Component {
  render() {
    return (
      <HomeContainer/>
    )
  }
}

render(<HomeApp/>, document.getElementById('app'))
