import allocations from '~/data/allocations.json'

export default defineEventHandler(() => {
  return allocations
})
