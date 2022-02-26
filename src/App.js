import React, { useState } from "react"
import { GetPaletteSection, SavedPalettesSection } from 'sections'

import './App.css'

function App() {
  const [currentSection, setCurrentSection] = useState('get-palette')
  const [sectionProps, setSectionProps] = useState({})

  const handleChangeSection = (section, props = {}) => {
    setCurrentSection(section)
    setSectionProps(props)
  }
  return (
    <div className={'app'}>
      {currentSection === 'get-palette' &&
        <GetPaletteSection handleChangeSection={handleChangeSection} sectionProps={sectionProps} />
      }
      {currentSection === 'saved' &&
        <SavedPalettesSection handleChangeSection={handleChangeSection} sectionProps={sectionProps} />
      }
    </div>
  )
}

export default App
