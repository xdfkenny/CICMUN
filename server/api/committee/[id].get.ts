import { getCommittees, getResources } from '../../utils/data'

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

    // Prepend the shared conference resources (charter, rules of procedure) to the committee's own resources.
    const shared = getResources().filter(r => !r.conferences || r.conferences.includes(committee.type));
    const own = committee.resources ?? [];
    const ownFilenames = new Set(own.map(r => r.filename));

    return { ...committee, resources: [...shared.filter(r => !ownFilenames.has(r.filename)).map(({ id: _id, category: _category, conferences: _conferences, ...r }) => r), ...own] };
});
