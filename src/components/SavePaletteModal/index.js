import React, { useEffect, useState } from 'react'
import { ModalWrapper, PaletteAccessRadio } from "components"
import { Button } from 'elements'

import './SavePaletteModal.css'

const SavePaletteModal = ({ open, onClose, onCancel, onComplete, title: propsTitle = '' }) => {
  const [title, setTitle] = useState('')
  const [access, setAccess] = useState('me')

  useEffect(() => {
    setTitle(propsTitle)
  }, [propsTitle])

  const handleChangeTitle = (e) => {
    const value = e.target.value
    setTitle(value)
  }
  const handleComplete = () => onComplete(title, access)
  const handleChangeAccess = (value) => setAccess(value)

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className={'save-palette-modal'}>
        <div className={'save-palette-modal-title'}>Name palette</div>
        <input
          className={'save-palette-modal-input'}
          placeholder={'Type new title here'}
          onChange={handleChangeTitle}
          value={title}
        />
        <PaletteAccessRadio access={access} onChange={handleChangeAccess} />
        <div className={'save-palette-modal-actions'}>
          <Button size={'md'} type={'secondary'} onClick={onCancel}>Cancel</Button>
          <Button size={'md'} onClick={handleComplete}>Save palette</Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default SavePaletteModal