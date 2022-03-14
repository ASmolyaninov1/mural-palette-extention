import React from 'react'
import { CrossIcon } from "icons"
import { Button } from 'elements'

import './TextAndFileInput.css'

const TextAndFileInput = props => {
  const {
    textInputProps,
    fileInputProps: { onRemoveFile, ...fileInputProps },
    buttonProps: { text: buttonText, ...buttonProps },
    disabled,
    file,
    errorMessage
  } = props

  const fileName = file?.name || ''
  const shortedFileName = fileName.length > 15 ? fileName.slice(0, 5) + '...' + fileName.slice(-6) : fileName

  return (
    <>
      <div className={'text-input-wrapper'} data-disabled={disabled}>
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
        <Button {...buttonProps} disabled={disabled}>{buttonText}</Button>
      </div>
      {!!errorMessage && <div className={'text-input-error-message'}>{errorMessage}</div>}
      <div>
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