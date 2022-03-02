import React, { useState, useEffect } from 'react'
import ColorThief from "color-thief-browser"

import { useApi, useJoinImages } from "hooks"
import { MiniPaletteList, PaletteList, SavePalettePopover, TextAndFileInput } from "components"
import { ArrowIcon, PlusIcon } from "icons"
import { fromRGBToHex } from 'helpers'

import './GetPaletteSection.css'

const GetPaletteSection = ({ sectionProps = {} }) => {
  const [brandPalette, setBrandPalette] = useState([])
  const [brandUrl, setBrandUrl] = useState('https://facebook.com')
  const [file, setFile] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [joinedImage, joinImages] = useJoinImages()
  const { loading, getPdfScreenshot, getSiteScreenshot, createPalette } = useApi()

  useEffect(() => {
    const { selectedPalette } = sectionProps

    if (selectedPalette) {
      setBrandPalette(selectedPalette)
      setSelectedColor(selectedPalette[0])
    }
  }, [])

  useEffect(() => {
    if (!!joinedImage) {
      const img = new Image()
      img.src = joinedImage
      img.onload = catchColor
    }
  }, [joinedImage])

  const handlePaintWidgetBorder = async () => {
    const selectedWidgetsList = await window.muralSdk.selectionSdk.list()
    if (selectedWidgetsList.length) {
      selectedWidgetsList.forEach(selectedWidget => {
        window.muralSdk.widgets.set.border.style(selectedWidget.id, 'solid')
        window.muralSdk.widgets.set.border.color(selectedWidget.id, selectedColor)
      })
    }
  }
  const handlePaintWidgetBackground = async () => {
    const selectedWidgetsList = await window.muralSdk.selectionSdk.list()
    if (selectedWidgetsList.length) {
      selectedWidgetsList.forEach(selectedWidget => {
        window.muralSdk.widgets.set.background.color(selectedWidget.id, selectedColor)
      })
    }
  }

  function catchColor() {
    const colorThief = new ColorThief()
    const palette = colorThief.getPalette(this, 9)
    const hexPalette = palette.map(item => fromRGBToHex(item))
    setBrandPalette(hexPalette)
  }
  const handleInputChange = (e) => {
    setBrandUrl(e.currentTarget.value)
  }
  const handleSelectColor = (color) => async () => {
    setSelectedColor(color)
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

  const handleCreatePalette = (title) => {
    createPalette({ colors: brandPalette, title })
  }

  const renderMain = () => {
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
        {!!brandPalette.length && (
          <div
            className={'get-palette-save-hint'}
          >
            Liked this palette? You can{' '}
            <SavePalettePopover handleSave={handleCreatePalette} />{' '}
            it.
          </div>
        )}
        <PaletteList paletteList={brandPalette} handleSelect={handleSelectColor} selectedColor={selectedColor} />
      </>
    )
  }
  const renderColoringMode = () => {
    return (
      <>
        <div>
          <div className={'get-palette-coloring-mode-back'} onClick={() => setSelectedColor(null)}>
            <ArrowIcon />
            <div>Back</div>
          </div>
          <MiniPaletteList paletteList={brandPalette} handleSelect={handleSelectColor} selectedColor={selectedColor} />
          <div className={'get-palette-coloring-mode-type-list'}>
            <div className={'get-palette-coloring-mode-type'}>
              <div>Fill</div>
              <div className={'get-palette-coloring-mode-type-icon'} onClick={handlePaintWidgetBackground}>
                <PlusIcon />
              </div>
            </div>
            <div className={'get-palette-coloring-mode-type'}>
              <div>Border</div>
              <div className={'get-palette-coloring-mode-type-icon'} onClick={handlePaintWidgetBorder}>
                <PlusIcon />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return selectedColor ? renderColoringMode() : renderMain()
}

export default GetPaletteSection