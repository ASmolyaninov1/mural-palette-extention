import React, { useEffect, useState } from 'react'
import { ModalWrapper, PaletteAccessRadio } from "components"
import { Button } from 'elements'

import './SavePaletteModal.css'

const SavePaletteModal = props => {
  const { open, onClose, onCancel, onComplete, defaultValues = { title: '', access: 'me' } } = props
  const [palette, setPalette] = useState({ title: '', access: 'me' })

  useEffect(() => {
    if (!!defaultValues) {
      setPalette(defaultValues)
    }
  }, [defaultValues])

  const handleChangeTitle = (e) => {
    const value = e.target.value
    setPalette({
      ...palette,
      title: value
    })
  }
  const handleComplete = () => onComplete(palette.title, palette.access)
  const handleChangeAccess = (access) => setPalette({ ...palette, access })

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className={'save-palette-modal'}>
        <div className={'save-palette-modal-title'}>Name palette</div>
        <input
          className={'save-palette-modal-input'}
          placeholder={'Type new title here'}
          onChange={handleChangeTitle}
          value={palette.title}
        />
        <PaletteAccessRadio access={palette.access} onChange={handleChangeAccess} />
        <div className={'save-palette-modal-actions'}>
          <Button size={'md'} type={'secondary'} onClick={onCancel}>Cancel</Button>
          <Button size={'md'} onClick={handleComplete}>Save palette</Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default SavePaletteModal