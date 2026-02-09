import committees from '../../../data/committees.json'

export default defineEventHandler(async (event) => {
    const type = getRouterParam(event, 'type');
    if (type !== 'SAMUN' && type !== 'JMUN') {
        throw createError({ statusCode: 400, message: 'Invalid type' });
    }
    
    return committees.filter(c => c.type === type);
});
