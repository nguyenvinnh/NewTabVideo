const Storage = {
    get(key, fallback) {
        try {
            const val = localStorage.getItem(key);
            return val === null ? fallback : val;
        } catch (_) { return fallback; }
    },
    set(key, val) {
        try { localStorage.setItem(key, val); } catch (_) { }
    },
    getBool(key, fallback) {
        return this.get(key, String(fallback)) === 'true';
    },
    setBool(key, val) {
        this.set(key, String(val));
    }
};
window.Storage = Storage;