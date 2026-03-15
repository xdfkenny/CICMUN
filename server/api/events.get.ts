import { getEvents } from '../utils/data'

export default defineEventHandler(() => {
  return getEvents()
})
