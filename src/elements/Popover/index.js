import React, { useEffect, useState, useRef } from 'react'

import './Popover.css'

/*
  props:
    children: (closeFunc) => Element
    trigger: Element
    position: 'center' | 'left' | 'right'
*/

const Popover = props => {
  const { children, trigger, position = 'center' } = props
  const [isPopoverOpen, setIsPopoverOpen] = useState()
  const popoverRef = useRef(null)

  const handleClickOutside = (e) => {
    const isClickInside = popoverRef.current.contains(e.target) || e.target === popoverRef.current

    if (!isClickInside) {
      setIsPopoverOpen(false)
    }
  }

  useEffect(() => {
    if (popoverRef?.current) {
      window.addEventListener('click', handleClickOutside)
    }

    return () => window.removeEventListener('click', handleClickOutside)
  }, [popoverRef?.current])

  const handlePopover = (e) => {
    e.stopPropagation()
    setIsPopoverOpen(!isPopoverOpen)
  }

  return (
    <div className={'popover'} data-opened={isPopoverOpen} ref={popoverRef} onClick={handlePopover}>
      {trigger}
      <div
        data-opened={isPopoverOpen}
        className={`popover-content popover-content-${position}`}
        onClick={e => e.stopPropagation()}
      >
        {children(() => setIsPopoverOpen(false))}
      </div>
    </div>
  )
}

export default Popover