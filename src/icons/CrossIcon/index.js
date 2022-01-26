import React from 'react'
import './CrossIcon.css'

const CrossIcon = () => {
  return (
    <svg className={'cross-icon'} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11L11 1M1 1L11 11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default CrossIcon