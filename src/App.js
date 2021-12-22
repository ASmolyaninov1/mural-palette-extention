import axios from "axios"
import { useState } from "react"
import './App.css'

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

  const handleInputChange = (e) => {
    setRequestError(null)
    setBrandUrl(e.currentTarget.value)
  }
  const handleSelectColor = (color) => async () => {
    const selectedWidgetsList = await window.muralSdk.selectionSdk.list()
    if (selectedWidgetsList.length) {
      await window.muralSdk.widgets.set.background.color(selectedWidgetsList[0].id, color)
    }
    setSelectedColor(color)
  }
  const handleInputKeyDown = (e) => {
    const keyCode = e.key
    if (keyCode === 'Enter') {
      fetchBrandPaletteByUrl()
    }
  }
  const fetchBrandPaletteByUrl = async () => {
    axios.post(
      'https://mural-palette-extention.tk.frge.io/api/get-palette',
      { brandUrl },
      {
        headers:{ 'Content-Type': 'application/json' }
      })
      .then(
        (res) => {
          const data = res?.data
          if (data) setBrandPalette(data)
        },
        (err) => {
          const message = err?.response?.data?.message
          setRequestError(message || null)
        }
      )
  }

  return (
    <div className={'app'}>
      <h2>Enter the website url to get the brand palette</h2>
      <input className={'app-input'} onChange={handleInputChange} onKeyDown={handleInputKeyDown} defaultValue={brandUrl} />
      <div className={'app-request-error-message'} data-visible={!!requestError}>{requestError}</div>
      <button disabled={!!requestError || !brandUrl} onClick={fetchBrandPaletteByUrl}>Get palette</button>
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
