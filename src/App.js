import React, { useEffect } from "react"
import { Router, useLocation, Location } from '@reach/router'
import { Navigation } from 'components'
import { GetPaletteSection, SavedPalettesSection, MakePaletteSection, ColoringSection } from 'sections'
import { sections } from "helpers"

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
  return (
    <Location>
      <div className={'app'}>
        <Heading />
        <Router>
          <SavedPalettesSection path={'/saved'} />
          <MakePaletteSection path={'/make-palette'}/>
          <ColoringSection path={'/coloring'} />
          <GetPaletteSection path={'/'} />
        </Router>
      </div>
    </Location>
  )
}

export default App
