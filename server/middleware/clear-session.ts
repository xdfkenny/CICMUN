export default defineEventHandler((event) => {
    // We only want to clear session data on actual page loads (HTML requests)
    // to avoid clearing state on every small API call or asset fetch during a single session.
    const accept = getRequestHeader(event, 'accept');
    if (accept?.includes('text/html')) {
        setHeader(event, 'Clear-Site-Data', '"cookies", "storage"');
    }
})
