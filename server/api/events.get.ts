import { getEvents } from '../utils/data'

export default defineEventHandler((event) => {
    return getEvents()
})
