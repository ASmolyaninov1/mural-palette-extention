import React, { useState } from "react"
import { GetPaletteSection, SavedPalettesSection } from 'sections'

import './App.css'

function App() {
  const [currentSection, setCurrentSection] = useState('get-palette')

  return (
    <div className={'app'}>
      {currentSection === 'get-palette' && <GetPaletteSection handleChangeSection={setCurrentSection} />}
      {currentSection === 'saved' && <SavedPalettesSection handleChangeSection={setCurrentSection} />}
    </div>
  )
}

export default App
