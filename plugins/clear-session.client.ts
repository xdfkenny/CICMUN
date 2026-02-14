export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        // Clear all cookies
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const trimmed = cookie.trim();
            if (!trimmed) continue;

            const name = trimmed.split("=")[0];
            if (name) {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
        }

        // Clear local and session storage for a truly "fresh" state
        localStorage.clear();
        sessionStorage.clear();

        console.log("Session cleared and state regenerated for clean load.");
    }
})
