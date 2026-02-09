import committees from '../../../data/committees.json'

export default defineEventHandler(async () => {
    return committees;
});
