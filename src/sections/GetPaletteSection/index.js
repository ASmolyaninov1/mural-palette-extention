import React, { useState, useEffect, useContext } from 'react'
import ColorThief from "color-thief-browser"
import { navigate } from '@reach/router'
import { useAlert } from 'react-alert'

import { useApi, useJoinImages } from "hooks"
import { PaletteList, SavePalettePopover, TextAndFileInput } from "components"
import { fromRGBToHex } from 'helpers'
import PaletteContext from "PaletteContext"

import './GetPaletteSection.css'

const GetPaletteSection = () => {
  const [paletteId, setPaletteId] = useState(null)
  const [brandPalette, setBrandPalette] = useState([])
  const [brandUrl, setBrandUrl] = useState('https://facebook.com')
  const [file, setFile] = useState(null)
  const [joinedImage, joinImages] = useJoinImages()
  const { loading, getPdfScreenshot, getSiteScreenshot, createPalette } = useApi()
  const { setCachedPalette } = useContext(PaletteContext)
  const alert = useAlert()

  useEffect(() => {
    if (!!joinedImage) {
      const img = new Image()
      img.src = joinedImage
      img.onload = catchColor
    }
  }, [joinedImage])

  function catchColor() {
    const colorThief = new ColorThief()
    const palette = colorThief.getPalette(this, 9)
    const hexPalette = palette.map(item => fromRGBToHex(item))
    setBrandPalette(hexPalette)
  }
  const handleInputChange = (e) => {
    setBrandUrl(e.currentTarget.value)
  }
  const handleSelectColor = (color) => {
    if (paletteId) {
      navigate(`/coloring/${paletteId}`, {state: { color }})
    } else {
      setCachedPalette({
        colors: brandPalette,
        title: `Palette from ${brandUrl}`
      })
      navigate('/coloring/unsaved', {state: { color }})
    }
  }

  const handleInputKeyDown = (e) => {
    const keyCode = e.key
    if (keyCode === 'Enter') {
      fetchBrandPaletteByUrl()
    }
  }
  const getPaletteByFile = () => {
    if (!file) return

    const fileExt = file.name.split('.').reverse()[0].toLowerCase()
    if (fileExt === 'png' || fileExt === 'jpeg' || fileExt === 'jpg') {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        const b64image = reader.result
        const baseImage = new Image()
        baseImage.src = b64image
        baseImage.onload = catchColor
      }
    }
    if (fileExt === 'pdf') {
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = function () {
        const b64pdf = fr.result

        getPdfScreenshot(b64pdf).then(res => {
          const imageUrls = (res?.result || []).map(imageFile => {
            return imageFile?.Url
          })
          joinImages(imageUrls)
        })
      }
    }
  }
  const fetchBrandPaletteByUrl = () => {
    getSiteScreenshot(brandUrl).then(res => {
      const b64screenshot = res.result
      const baseImage = new Image()
      baseImage.src = 'data:image/png;base64,' + b64screenshot
      baseImage.onload = catchColor
    })
  }
  const handleGetPaletteClick = () => {
    if (file) {
      getPaletteByFile()
    } else {
      fetchBrandPaletteByUrl()
    }
  }
  const handleSetFile = (e) => setFile(e?.target?.files[0] || null)
  const handleRemoveFile = () => setFile(null)

  const handleCreatePalette = (title, access) => {
    createPalette({ colors: brandPalette, title, access }).then(res => {
      if (res?.result?.objectId) {
        setPaletteId(res.result.objectId)
        alert.show('Palette created')
      }
    })
  }

  return (
    <>
      <TextAndFileInput
        fileInputProps={{ onChange: handleSetFile, onRemoveFile: handleRemoveFile }}
        textInputProps={{ onChange: handleInputChange, onKeyDown: handleInputKeyDown, defaultValue: brandUrl }}
        file={file}
        buttonProps={{
          loading: loading,
          onClick: handleGetPaletteClick,
          text: 'Get palette'
        }}
        disabled={!brandUrl || loading}
      />
      {!!brandPalette.length && !paletteId && (
        <div
          className={'get-palette-save-hint'}
        >
          Liked this palette? You can{' '}
          <SavePalettePopover handleSave={handleCreatePalette} />{' '}
          it.
        </div>
      )}
      <PaletteList paletteList={brandPalette} handleSelect={handleSelectColor} />
    </>
  )
}

export default GetPaletteSection