import React, { useState } from 'react'
import { Button, ModalWrapper } from "components"

import './RenamePaletteModal.css'

const RenamePaletteModal = ({ open, onClose, onCancel, onComplete }) => {
  const [title, setTitle] = useState('')
  const handleChange = (e) => {
    const value = e.target.value
    setTitle(value)
  }
  const handleComplete = () => onComplete(title)

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className={'rename-palette-modal'}>
        <div className={'rename-palette-modal-title'}>Renaming palette</div>
        <input
          className={'rename-palette-modal-input'}
          placeholder={'Type new title here'}
          onChange={handleChange}
        />
        <div className={'rename-palette-modal-actions'}>
          <Button size={'md'} type={'secondary'} onClick={onCancel}>Cancel</Button>
          <Button size={'md'} onClick={handleComplete}>Save palette</Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default RenamePaletteModal