import React from 'react'

import './Radio.css'

const Radio = ({ checked, onChange, label }) => {
  const handleChange = (e) => {
    const checked = e.target.checked
    onChange(checked)
  }
  return (
    <label className={'radio-wrapper'}>
      <div className={'radio'}>
        <input type="radio" className={'radio-input'} onChange={handleChange} checked={checked} />
        <div data-checked={checked} className={'radio-indicator'} />
      </div>
      <div className={'radio-label'}>{label}</div>
    </label>
  )
}

export default Radio