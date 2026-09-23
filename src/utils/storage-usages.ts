export const storageUsed = (() => {
    try {
        let total = 0;
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith("workspace_")) {
                total += (localStorage.getItem(key) ?? "").length * 2; // UTF-16
            }
        }
        return `${Math.round(total / 1024)} KB / 5 MB`;
    } catch {
        return "— / 5 MB";
    }
})();
