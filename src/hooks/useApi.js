import React, { useState } from 'react'
import { paletteApi } from "api"

const useApi = () => {
  const [loading, setLoading] = useState(false)
  const getPdfScreenshot = async (b64pdf) => {
    setLoading(true)
    const result = await paletteApi.getPdfScreenshot(b64pdf)
    setLoading(false)
    return result
  }

  const getSiteScreenshot = async (brandUrl) => {
    setLoading(true)
    const result = await paletteApi.getSiteScreenshot(brandUrl)
    setLoading(false)
    return result
  }

  const createPalette = async palette => {
    setLoading(true)
    const result = await paletteApi.createPalette(palette)
    setLoading(false)
    return result
  }

  const getPalette = async (id) => {
    setLoading(true)
    const result = await paletteApi.getPalette(id)
    setLoading(false)
    return result
  }

  const getAllPalettes = async () => {
    setLoading(true)
    const result = await paletteApi.getAllPalettes()
    setLoading(false)
    return result
  }

  const deletePalette = async (id) => {
    setLoading(true)
    const result = await paletteApi.deletePalette(id)
    setLoading(false)
    return result
  }

  const updatePalette = async (id, payload) => {
    setLoading(true)
    const result = await paletteApi.updatePalette(id, payload)
    setLoading(false)
    return result
  }

  return {
    getPdfScreenshot,
    getSiteScreenshot,
    getPalette,
    createPalette,
    getAllPalettes,
    deletePalette,
    updatePalette,
    loading
  }
}

export default useApi