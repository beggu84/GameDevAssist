import React from "react"
import { render } from "react-dom"
import {
  createStore,
  //compose,
  //applyMiddleware,
  combineReducers,
} from "redux"
import { Provider } from "react-redux"
//import thunk from "redux-thunk"

import * as reducers from "../reducers"
import SBSContainer from "./SBSContainer"

import "../styles/body.css"

/*
let finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)
let reducer = combineReducers(reducers)
let store = finalCreateStore(reducer)
*/

let reducer = combineReducers(reducers)
let store = createStore(reducer)

class SBSApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SBSContainer/>
      </Provider>
    )
  }
}

render(<SBSApp/>, document.getElementById('app'))
