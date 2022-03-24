import React, { useState } from 'react'
import { useMeasure } from 'react-use'
import { Icon } from "elements"

import './Collapse.css'

const Collapse = props => {
  const { children, title, ...rest } = props
  const [show, setShow] = useState()
  const [ref, { height }] = useMeasure()

  const toggleCollapse = () => {
    setShow(!show)
  }
  return (
    <div className={'collapse-wrapper'}>
      <div className={'collapse-header'} data-open={show} onClick={toggleCollapse}>
        <div className={'collapse-title'}>{title}</div>
        <Icon name={'Arrow'} className={'collapse-header-icon'} />
      </div>
      <div
        className={'collapse'}
        style={{ maxHeight: show ? height : '0px' }}
        {...rest}
      >
        <div ref={ref}>{children}</div>
      </div>
    </div>
  )
}

export default Collapse