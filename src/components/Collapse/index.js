import React, { useEffect, useState } from 'react'
import { useMeasure } from 'react-use'
import { Icon } from "elements"

import './Collapse.css'

const Collapse = props => {
  const { children, title, defaultShow = false, ...rest } = props
  const [show, setShow] = useState(false)
  const [isOverflowHidden, setIsOverflowHidden] = useState(true)
  const [ref, { height }] = useMeasure()

  useEffect(() => {
    setShow(defaultShow)
    setIsOverflowHidden(!defaultShow)
  }, [defaultShow])

  const toggleCollapse = () => {
    if (!show) {
      setTimeout(() => {
        setIsOverflowHidden(false)
      }, 300)
    } else {
      setIsOverflowHidden(true)
    }
    setShow(!show)
  }

  const collapseClassName = 'collapse ' + (isOverflowHidden && 'collapse-hidden')
  return (
    <div className={'collapse-wrapper'}>
      <div className={'collapse-header'} data-open={show} onClick={toggleCollapse}>
        <div className={'collapse-title'}>{title}</div>
        <Icon name={'Arrow'} className={'collapse-header-icon'} />
      </div>
      <div
        className={collapseClassName}
        data-show={show}
        style={{ maxHeight: show ? height : '0px' }}
        {...rest}
      >
        <div ref={ref}>{children}</div>
      </div>
    </div>
  )
}

export default Collapse