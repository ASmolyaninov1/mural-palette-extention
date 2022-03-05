import React from 'react'
import { ArrowIcon, CopyIcon, CrossIcon, DotsIcon, PlusIcon, TrashIcon } from 'icons'

import './Icon.css'

const Icon = ({ name, onClick, className }) => {
  const icons = {
    'Arrow': ArrowIcon,
    'Copy': CopyIcon,
    'Cross': CrossIcon,
    'Dots': DotsIcon,
    'Plus': PlusIcon,
    'Trash': TrashIcon,
  }

  const CurrentIcon = icons[name]
  return (
    <div className={'icon ' + className} onClick={onClick}>
      <CurrentIcon />
    </div>
  )
}

export default Icon