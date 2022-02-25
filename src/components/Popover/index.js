import React, { useEffect, useState, useRef } from 'react'

import './Popover.css'

const Popover = props => {
  const { children, trigger } = props
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

  const handlePopover = () => {
    setIsPopoverOpen(!isPopoverOpen)
  }

  return (
    <div className={'popover'} ref={popoverRef} onClick={handlePopover}>
      {trigger}
      <div data-opened={isPopoverOpen} className={'popover-content'} onClick={e => e.stopPropagation()}>
        {children(() => setIsPopoverOpen(false))}
      </div>
    </div>
  )
}

export default Popover