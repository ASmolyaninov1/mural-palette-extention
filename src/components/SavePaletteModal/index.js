import React, { useEffect, useState } from 'react'
import { Button, ModalWrapper, Radio } from "components"

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
  const handleComplete = () => onComplete(title)
  const handleChangeAccess = (value) => () => setAccess(value)

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
        <div className={'save-palette-modal-title'}>
          Who can use this palette?
        </div>
        <div className={'save-palette-modal-access-action'}>
          <Radio
            label={'Only me'}
            checked={access === 'me'}
            onChange={handleChangeAccess('me')}
          />
        </div>
        <div className={'save-palette-modal-access-action'}>
          <Radio
            label={'Members of workspace'}
            checked={access === 'workspace'}
            onChange={handleChangeAccess('workspace')}
          />
        </div>
        <div className={'save-palette-modal-access-action'}>
          <Radio
            label={'Members of company'}
            checked={access === 'company'}
            onChange={handleChangeAccess('company')}
          />
        </div>
        <div className={'save-palette-modal-actions'}>
          <Button size={'md'} type={'secondary'} onClick={onCancel}>Cancel</Button>
          <Button size={'md'} onClick={handleComplete}>Save palette</Button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default SavePaletteModal