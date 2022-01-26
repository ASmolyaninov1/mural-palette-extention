import React from 'react'
import { CrossIcon } from "../../icons"

import './TextAndFileInput.css'

const TextAndFileInput = ({ textInputProps, fileInputProps: { onRemoveFile, ...fileInputProps }, file}) => {
  const fileName = file?.name || ''
  const shortedFileName = fileName.length > 15 ? fileName.slice(0, 5) + '...' + fileName.slice(-6) : fileName

  return (
    <>
      <div className={'text-input-wrapper'}>
        {
          file ? (
            <div className={'text-input-file-indicator'}>
              <div>{shortedFileName}</div>
              <div className={'text-input-file-indicator-cross'} onClick={onRemoveFile}>
                <CrossIcon />
              </div>
            </div>
          ) : (
            <input className={'text-input'} {...textInputProps} />
          )
        }
      </div>
      <div className={'app-input-file-wrapper'}>
        Or{' '}
        <label className={'file-input'}>
          upload image
          <input type="file" {...fileInputProps} />
        </label>
      </div>
    </>
  )
}

export default TextAndFileInput