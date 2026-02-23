import { getCommittees } from '../../utils/data'

export default defineEventHandler(async () => {
    return getCommittees()
});
