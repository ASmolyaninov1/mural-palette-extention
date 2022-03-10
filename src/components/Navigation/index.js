import React from 'react'
import { Link } from '@reach/router'

import './Navigation.css'

// item = { title: string, path: string }
const Navigation = ({ items }) => {
  return (
    <div className={'navigation-wrapper'}>
      {items.map(item => {
        return (
          <Link
            className={'navigation-item'}
            key={item.path}
            to={item.path}
            getProps={({ isCurrent }) => {
              return {
                className: isCurrent ? 'navigation-item navigation-item-active' : 'navigation-item'
              }
            }}
          >
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}

export default Navigation