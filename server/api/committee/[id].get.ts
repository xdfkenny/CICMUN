import { getCommittees } from '../../utils/data'

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, 'id');

    if (!idParam) {
        throw createError({ statusCode: 400, message: 'Committee ID is required' });
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
        throw createError({ statusCode: 400, message: 'Invalid Committee ID format' });
    }

    const committee = getCommittees().find(c => c.id === id);

    if (!committee) {
        throw createError({ statusCode: 404, message: `Committee with ID ${id} not found` });
    }

    return committee;
});
