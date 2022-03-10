import React from 'react'
import { Popover } from "components"

import './MenuPopover.css'

/*
  trigger: Element,
  position: 'left' | 'right' | 'center'
  menu: [{ title: string, onClick: function(closePopover) {} }]
*/

const MenuPopover = ({ trigger, position, menu }) => {
  return (
    <Popover trigger={trigger} position={position}>
      {(close) => (
        <div className={'menu-popover'}>
          {menu.map(el => (
            <div key={el.title} className={'menu-popover-item'} onClick={() => el.onClick(close)}>{el.title}</div>
          ))}
        </div>
      )}
    </Popover>
  )
}

export default MenuPopover