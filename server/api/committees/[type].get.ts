import { getCommittees } from '../../utils/data'

export default defineEventHandler(async (event) => {
    const param = getRouterParam(event, 'type');
    if (!param) {
        throw createError({ statusCode: 400, message: 'Committee identifier is required' });
    }

    const committees = getCommittees()
    const isNumeric = /^\d+$/.test(param)

    if (isNumeric) {
        const id = parseInt(param, 10)
        const committee = committees.find(c => c.id === id)
        if (!committee) {
            throw createError({ statusCode: 404, message: `Committee with ID ${id} not found` });
        }
        return committee
    }

    const type = param.toUpperCase()
    if (type !== 'SAMUN' && type !== 'JMUN') {
        throw createError({ statusCode: 400, message: 'Invalid committee type' });
    }

    return committees.filter(c => c.type === type);
});
