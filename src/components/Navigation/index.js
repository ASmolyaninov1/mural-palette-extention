import React from 'react'

import './Navigation.css'

// item = { title: string, onClick: (e: MouseEvent) => void, id: string }
const Navigation = ({ items, selectedItemId }) => {
  return (
    <div className={'navigation-wrapper'}>
      {items.map(item => {
        return (
          <div
            className={'navigation-item'}
            key={item.id}
            data-selected={selectedItemId === item.id}
            onClick={item.onClick}
          >
            {item.title}
          </div>
        )
      })}
    </div>
  )
}

export default Navigation