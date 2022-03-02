import React, { useState } from 'react'
import axios from "axios"

const PROD_API_URL = 'https://dockerhost.forge-parse-server.c66.me:40140'
const DEV_API_URL = 'http://localhost:1337'

const API_URL = PROD_API_URL

axios.interceptors.request.use(function (config) {
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-Parse-Application-Id': 'b334e60e0d3181d1bf0f544a9f4c4caf',
      'X-Parse-Master-Key': '0b31d1d5f133ddd9333232396daba892',
      'Content-Type': 'application/json'
    }
  }
}, function (err) {
  return Promise.reject(err)
})

const useApi = () => {
  const [loading, setLoading] = useState(false)
  const getPdfScreenshot = async (b64pdf) => {
    setLoading(true)
    try {
      const result = await axios.post(
        API_URL + '/parse/functions/getPdfScreenshot',
        { pdf: b64pdf },
        {
          headers: {  }
        }
      )

      setLoading(false)
      return result?.data?.result
    } catch (e) {
      setLoading(false)
      return e
    }
  }

  const getSiteScreenshot = async (brandUrl) => {
    setLoading(true)
    try {
      const result = await axios.post(
        API_URL + '/parse/functions/getSiteScreenshot',
        { brandUrl }
      )

      setLoading(false)
      return result?.data?.result
    } catch (e) {
      setLoading(false)
      return e
    }
  }

  const createPalette = async palette => {
    try {
      const { colors, title } = palette
      const result = await axios.post(
        API_URL + '/parse/functions/createPalette',
        { colors, title }
      )

      return result?.data?.result
    } catch (e) {
      return e
    }
  }

  const getPalette = async (id) => {
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

  const getAllPalettes = async () => {
    setLoading(true)
    try {
      const result = await axios.post(API_URL + '/parse/functions/getAllPalettes')

      setLoading(false)
      return result?.data?.result
    } catch (e) {
      setLoading(false)
      return e
    }
  }

  const deletePalette = async (id) => {
    try {
      const result = await axios.post(API_URL + '/parse/functions/deletePalette', { id })
      return result?.data?.result
    } catch (e) {
      return e
    }
  }

  const updatePalette = async (id, { colors = null, title = null }) => {
    setLoading(true)
    try {
      const result = await axios.post(API_URL + '/parse/functions/updatePalette', { id, colors, title })
      setLoading(false)
      return result?.data?.result
    } catch (e) {
      setLoading(false)
      return e
    }
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