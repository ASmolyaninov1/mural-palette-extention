import React, { useEffect } from 'react'
import './Notification.css'

const Notification = ({ style, options, message, close }) => {
  useEffect(() => {
    console.log('check')
    setTimeout(close, 2000)
  }, [])
  return (
    <div className={'notification'} style={style}>
      {message}
    </div>
  )
}

export default Notification