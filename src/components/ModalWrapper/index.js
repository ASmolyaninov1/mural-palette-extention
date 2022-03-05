import React from 'react'
import ReactDOM from 'react-dom'

import './ModalWrapper.css'

const ModalWrapper = ({ open, onClose, children }) => {
  if (!open) return null

  return ReactDOM.createPortal((
    <div className={'modal-wrapper'}>
      <div className={'modal-overlay'} onClick={onClose} />
      <div className={'modal'}>
        {children}
      </div>
    </div>
  ), document.getElementById('modal'))
}

export default ModalWrapper