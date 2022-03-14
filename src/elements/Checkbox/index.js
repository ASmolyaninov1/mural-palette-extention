import React from 'react'
import { CheckmarkIcon } from "icons"
import { uid } from 'helpers'

import './Checkbox.css'

const Checkbox = ({ defaultValue, onChange }) => {
  const id = uid()
  return (
    <div className={'checkbox-wrapper'}>
      <input
        id={id}
        type={'checkbox'}
        defaultChecked={defaultValue}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} className={'checkbox'}>
        <CheckmarkIcon />
      </label>
    </div>
  )
}

export default Checkbox