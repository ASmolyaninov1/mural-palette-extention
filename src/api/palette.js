import axios from "axios"
import { API_URL } from 'api'

export const getPdfScreenshot = async (b64pdf) => {
  try {
    const result = await axios.post(
      API_URL + '/parse/functions/getPdfScreenshot',
      { pdf: b64pdf },
    )

    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const getSiteScreenshot = async (brandUrl) => {
  try {
    const result = await axios.post(
      API_URL + '/parse/functions/getSiteScreenshot',
      { brandUrl }
    )

    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const createPalette = async palette => {
  try {
    const { colors, title, access } = palette
    const result = await axios.post(
      API_URL + '/parse/functions/createPalette',
      { colors, title, access }
    )

    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const getPalette = async (id) => {
  try {
    const result = await axios.post(
      API_URL + '/parse/functions/getPalette',
      { id }
    )

    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const getAllPalettes = async () => {
  try {
    const result = await axios.post(API_URL + '/parse/functions/getAllPalettes')

    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const deletePalette = async (id) => {
  try {
    const result = await axios.post(API_URL + '/parse/functions/deletePalette', { id })
    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const updatePalette = async (id, { colors, title, access }) => {
  try {
    const result = await axios.post(
      API_URL + '/parse/functions/updatePalette',
      { id, colors, title, access }
    )
    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const updatePaletteAsDefault = async (id) => {
  try {
    const result = await axios.post(API_URL + '/parse/functions/setDefaultPalette', { id })
    return result?.data?.result
  } catch (e) {
    return e
  }
}

export const updateFavouritePalettes = async (id) => {
  try {
    const result = await axios.post(API_URL + '/parse/functions/updateUserFavouritePalettes', { id })
    return result?.data?.result
  } catch (e) {
    return e
  }
}