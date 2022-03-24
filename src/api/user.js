import axios from "axios"
import { API_URL } from "api"

export const getOrCreateMuralUser = async (user) => {
  const { muralUsername, muralWorkspace, muralCompany } = user
  if (!muralUsername || !muralWorkspace) return { error: 'Provide field "username" and "muralWorkspace"' }
  const userData = await axios.post(
    API_URL + '/parse/functions/getOrCreateMuralUser',
    { muralUsername, muralWorkspace, muralCompany }
  )
  if (!!userData?.data?.result?.error) return { error: userData.data.result.error }
  localStorage.setItem('muralUsername', muralUsername)
  return userData.data.result.result
}

export const getCurrentUser = async () => {
  const userData = await axios.post(API_URL + '/parse/functions/getCurrentUser')
  if (!!userData?.data?.result?.error) return { error: userData.data.result.error }
  return userData.data.result.result
}
