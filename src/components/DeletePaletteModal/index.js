import React from 'react'
import { Button, ModalWrapper } from "components"

import './DeletePaletteModal.css'

const DeletePaletteModal = ({ onDelete, onCancel, open, onClose }) => {
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className={'delete-palette-modal'}>
        <div className={'delete-palette-modal-title'}>
          Are you sure you want to delete this palette?
        </div>
        <div className={'delete-palette-modal-actions'}>
          <Button size={'md'} type={'secondary'} onClick={onCancel}>Cancel</Button>
          <Button size={'md'} onClick={onDelete}>Yes</Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default DeletePaletteModal