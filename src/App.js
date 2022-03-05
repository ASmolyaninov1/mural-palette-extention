import React, { useState } from "react"
import { Navigation } from 'components'
import { GetPaletteSection, SavedPalettesSection, MakePaletteSection } from 'sections'
import { sections } from "helpers"

import './App.css'

function App() {
  const [currentSection, setCurrentSection] = useState('get-palette')
  const [sectionProps, setSectionProps] = useState({})

  const handleChangeSection = (section, props = {}) => {
    setCurrentSection(section)
    setSectionProps(props)
  }

  const navigationItems = sections.map(item => {
    return {
      ...item,
      onClick: () => handleChangeSection(item.id)
    }
  })
  return (
    <div className={'app'}>
      <div className={'app-hint'}>Enter the website url to get the brand palette</div>
      <Navigation items={navigationItems} selectedItemId={currentSection} />
      {currentSection === 'get-palette' &&
        <GetPaletteSection handleChangeSection={handleChangeSection} sectionProps={sectionProps} />
      }
      {currentSection === 'saved' &&
        <SavedPalettesSection handleChangeSection={handleChangeSection} sectionProps={sectionProps} />
      }
      {
        currentSection === 'make-palette' &&
          <MakePaletteSection handleChangeSection={handleChangeSection} sectionProps={sectionProps}/>
      }
    </div>
  )
}

export default App
