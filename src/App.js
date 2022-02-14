import axios from "axios"
import { useEffect, useState } from "react"
import ColorThief from 'color-thief-browser'

import { Button, TextAndFileInput, PaletteList, MiniPaletteList } from "./components"
import { ArrowIcon, PlusIcon } from "./icons"
import useJoinImages from './hooks/joinImages'

import './App.css'

function App() {
  const [brandPalette, setBrandPalette] = useState([])
  const [brandUrl, setBrandUrl] = useState('https://facebook.com')
  const [file, setFile] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [joinedImage, joinImages] = useJoinImages()

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
    setBrandPalette(palette)
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

        axios.post(
          'http://localhost:1337/parse/functions/getPdfScreenshot',
          { pdf: b64pdf },
          {
            headers: {
              'X-Parse-Application-Id': 'b334e60e0d3181d1bf0f544a9f4c4caf',
              'X-Parse-Master-Key': '0b31d1d5f133ddd9333232396daba892',
              'Content-Type': 'application/json'
            }
        }).then(res => {
          const imageFiles = res?.data?.result
          const imageUrls = (imageFiles || []).map(imageFile => {
            return imageFile?.Url
          })
          joinImages(imageUrls)
        })
      }
    }
  }
  const fetchBrandPaletteByUrl = () => {
    setLoading(true)
    axios.post(
      'https://dockerhost.forge-parse-server.c66.me:40140/parse/functions/getScreenshot',
      { brandUrl },
      {
        headers: {
          'X-Parse-Application-Id': 'b334e60e0d3181d1bf0f544a9f4c4caf',
          'X-Parse-Master-Key': '0b31d1d5f133ddd9333232396daba892',
          'Content-Type': 'application/json'
        }
      }
    ).then(res => {
      const b64screenshot = res.data?.result?.screenshot
      if (b64screenshot) {
        const baseImage = new Image()
        baseImage.src = 'data:image/png;base64,' + b64screenshot
        baseImage.onload = catchColor
      }

      setLoading(false)
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

  const renderMain = () => {
    return (
      <>
        <div className={'app-hint'}>Enter the website url to get the brand palette</div>
        <TextAndFileInput
          fileInputProps={{ onChange: handleSetFile, onRemoveFile: handleRemoveFile }}
          textInputProps={{ onChange: handleInputChange, onKeyDown: handleInputKeyDown, defaultValue: brandUrl }}
          file={file}
        />
        <Button disabled={!brandUrl || loading} onClick={handleGetPaletteClick} loading={loading}>
          Get palette
        </Button>
        <PaletteList paletteList={brandPalette} handleSelect={handleSelectColor} selectedColor={selectedColor} />
      </>
    )
  }
  const renderColoringMode = () => {
    return (
      <>
        <div>
          <div className={'app-coloring-mode-back'} onClick={() => setSelectedColor(null)}>
            <ArrowIcon />
            <div>Back</div>
          </div>
          <MiniPaletteList paletteList={brandPalette} handleSelect={handleSelectColor} selectedColor={selectedColor} />
          <div className={'app-coloring-mode-type-list'}>
            <div className={'app-coloring-mode-type'}>
              <div>Fill</div>
              <div className={'app-coloring-mode-type-icon'} onClick={handlePaintWidgetBackground}>
                <PlusIcon />
              </div>
            </div>
            <div className={'app-coloring-mode-type'}>
              <div>Border</div>
              <div className={'app-coloring-mode-type-icon'} onClick={handlePaintWidgetBorder}>
                <PlusIcon />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <div className={'app'}>
      {selectedColor ? renderColoringMode() : renderMain()}
    </div>
  )
}

export default App
