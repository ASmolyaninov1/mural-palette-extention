import axios from "axios"
import { useState } from "react"
import './App.css'
import ColorThief from 'color-thief-browser'

const fromRGBToHex = ([ r, g, b ]) => {
  return [r, g, b].reduce((acc, el) => {
    const hex = el.toString(16)
    if (hex.length === 1) {
      return acc + 0 + hex
    }
    return acc + hex
  }, '#')
}

function App() {
  const [brandPalette, setBrandPalette] = useState([])
  const [requestError, setRequestError] = useState(null)
  const [brandUrl, setBrandUrl] = useState('https://facebook.com')
  const [selectedColor, setSelectedColor] = useState(null)
  const [loading, setLoading] = useState(false)

  function catchColor() {
    const colorThief = new ColorThief()
    const palette = colorThief.getPalette(this, 10)
    setBrandPalette(palette)
  }
  const handleInputChange = (e) => {
    console.log(e.target.selectionStart)
    setRequestError(null)
    setBrandUrl(e.currentTarget.value)
  }
  const handleSelectColor = (color) => async () => {
    const selectedWidgetsList = await window.muralSdk.selectionSdk.list()
    if (selectedWidgetsList.length) {
      selectedWidgetsList.forEach(selectedWidget => {
        window.muralSdk.widgets.set.background.color(selectedWidget.id, color)
      })
    }
    setSelectedColor(color)
  }
  const handleInputKeyDown = (e) => {
    const keyCode = e.key
    if (keyCode === 'Enter') {
      fetchBrandPaletteByUrl()
    }
  }
  const fetchBrandPaletteByUrl = () => {
    setLoading(true)
    axios.post(
      'https://dockerhost.forge-parse-server.c66.me:40123/parse/functions/getScreenshot',
      { brandUrl },
      {
        headers: {
          'X-Parse-Application-Id': '6e66d7ca36d7c271801bdada14bc9490',
          'X-Parse-Master-Key': '2d8fcc6094438a0246358cf8142e00d3',
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

  return (
    <div className={'app'}>
      <h2>Enter the website url to get the brand palette</h2>
      <input className={'app-input'} onChange={handleInputChange} onKeyDown={handleInputKeyDown} defaultValue={brandUrl} />
      <div className={'app-request-error-message'} data-visible={!!requestError}>{requestError}</div>
      <button disabled={!!requestError || !brandUrl || loading} onClick={fetchBrandPaletteByUrl}>{loading ? 'Loading...' : 'Get palette'}</button>
      <ul className={'app-palette-color-list'}>
        {brandPalette.map(color => {
          const hexColor = fromRGBToHex(color)
          return (
            <li
              className={'app-palette-color'}
              style={{ backgroundColor: hexColor }}
              data-selected={hexColor === selectedColor}
              data-color={hexColor}
              onClick={handleSelectColor(hexColor)}
            />
          )
        })}
      </ul>
    </div>
  );
}

export default App;
