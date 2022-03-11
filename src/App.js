import React, { useState } from "react"
import { Router, useLocation, Location } from '@reach/router'
import { Navigation } from 'components'
import { GetPaletteSection, SavedPalettesSection, MakePaletteSection, ColoringSection } from 'sections'
import { sections } from "helpers"
import PaletteContext from 'PaletteContext'

import './App.css'

const Heading = () => {
  const location = useLocation()
  const isShowNavigation = !location.pathname.includes('coloring')
  if (!isShowNavigation) return null

  return (
    <>
      <div className={'app-hint'}>Enter the website url to get the brand palette</div>
      <Navigation items={sections} />
    </>
  )
}

function App() {
  const [cachedPalette, setCachedPalette] = useState({})

  return (
    <Location>
      <div className={'app'}>
        <Heading />
        <PaletteContext.Provider value={{ cachedPalette, setCachedPalette }}>
          <Router>
            <SavedPalettesSection path={'/saved'} />
            <MakePaletteSection path={'/make-palette/:id'} />
            <MakePaletteSection path={'/make-palette'} />
            <ColoringSection path={'/coloring/:id'} />
            <GetPaletteSection path={'/'} />
          </Router>
        </PaletteContext.Provider>
      </div>
    </Location>
  )
}

export default App
