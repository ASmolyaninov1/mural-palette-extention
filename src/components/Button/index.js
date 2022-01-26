import React from 'react'
import './Button.css'

const Button = ({ loading, children, ...props }) => {
  return (
    <button className={'button'} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button