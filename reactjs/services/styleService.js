import React from "react"

let containerHeight = 500 // default
export function setContainerHeight(height) {
  containerHeight = height
}
export function getContainerHeight() {
  return containerHeight
}

let fileListHeight = 430 // default
export function setFileListHeight(height) {
  fileListHeight = height
}
export function getFileListHeight() {
  return fileListHeight
}

export function getCoverStyle() {
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'brown',
    opacity: 0.8
  }
}

export function renderVerticalSeparator() {
  const style = {
    position: 'absolute',
    right: 0,
    top: '5%',
    width: '1px',
    height: '90%',
    background: 'gray'
  }
  return <div style={style}/>
}

export function renderHorizontalSeparator() {
  const style = {
    position: 'absolute',
    left: '5%',
    bottom: 0,
    width: '90%',
    height: '1px',
    background: 'gray'
  }
  return <div style={style}/>
}

export function renderVerticalCriteria(width) {
  const style = {
    display: 'inline-block',
    width: width + 'px',
    height: '100%',
    verticalAlign: 'middle',
  }
  return <div style={style}/>
}

export function getButtonStyle() {
  const buttonHeight = 20

  return {
    display: 'block',
    width: '90%',
    height: buttonHeight + 'px',
    margin: '3px auto 0 auto',
    border: '1px solid black',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
    lineHeight: (buttonHeight+1) + 'px',
    cursor: 'pointer',
    color: 'black',
    textDecoration: 'none'
  }
}
