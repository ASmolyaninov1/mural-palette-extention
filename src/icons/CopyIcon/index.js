import React from 'react'
import './CopyIcon.css'

const CopyIcon = ({ onClick }) => {
  return (
    <svg className={'copy-icon'} onClick={onClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.16675 12.5H3.33341C2.89139 12.5 2.46746 12.3244 2.1549 12.0118C1.84234 11.6993 1.66675 11.2754 1.66675 10.8333V3.33334C1.66675 2.89131 1.84234 2.46739 2.1549 2.15483C2.46746 1.84227 2.89139 1.66667 3.33341 1.66667H10.8334C11.2754 1.66667 11.6994 1.84227 12.0119 2.15483C12.3245 2.46739 12.5001 2.89131 12.5001 3.33334V4.16667" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default CopyIcon