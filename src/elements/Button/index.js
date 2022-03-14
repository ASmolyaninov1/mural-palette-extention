import React from 'react'
import './Button.css'

const Button = ({ loading, children, type = 'primary', size = 'lg', ...props }) => {
  const typeClassName = type + '-button'
  const sizeClassName = size + '-button'
  return (
    <button className={`button ${typeClassName} ${sizeClassName}`} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button