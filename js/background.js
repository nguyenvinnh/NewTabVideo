const DB_NAME = 'TabNewDB';
const STORE_NAME = 'backgrounds';

function openBgDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveBgBlob(blob) {
    try {
        const db = await openBgDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(blob, 'current_bg');
        return true;
    } catch (e) {
        console.error('IndexedDB save error:', e);
        return false;
    }
}

async function getBgBlob() {
    try {
        const db = await openBgDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        return new Promise((resolve) => {
            const req = store.get('current_bg');
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch (e) {
        return null;
    }
}

const Background = {
    currentBlobUrl: null,

    init() {
        this.video = document.getElementById('bg-video');
        this.muteBtn = document.getElementById('mute-btn');
        this.isMuted = Storage.getBool('bg_muted', true);
        this.loadSaved();
        this.updateMuteUI();
    },

    async loadSaved() {
        // Try IndexedDB first for unlimited file size persistence
        const blob = await getBgBlob();
        if (blob) {
            this.setBackgroundFromBlob(blob);
            return;
        }

        // Fallback to localStorage or default URL
        const saved = Storage.get('custom_bg', CONFIG.defaultBg);
        this.setBackground(saved);
    },

    setBackgroundFromBlob(blob) {
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
        }
        const url = URL.createObjectURL(blob);
        this.currentBlobUrl = url;

        const isVideo = blob.type.startsWith('video/') ||
            (blob.name && blob.name.match(/\.(mp4|webm|ogg|mov|mkv)$/i));

        if (isVideo) {
            document.body.style.backgroundImage = 'none';
            this.video.src = url;
            this.video.style.display = 'block';
            this.video.play().catch(() => {
                this.video.muted = true;
                this.video.play().catch(() => {});
            });
        } else {
            this.video.pause();
            this.video.style.display = 'none';
            document.body.style.backgroundImage =
                `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${url}')`;
        }
        this.updateMuteUI();
    },

    setBackground(data) {
        const isVideo = data.startsWith('data:video/') ||
            data.endsWith('.mp4') ||
            data.endsWith('.webm') ||
            data.endsWith('.ogg');
        if (isVideo) {
            document.body.style.backgroundImage = 'none';
            this.video.src = data;
            this.video.style.display = 'block';
            this.video.play().catch(() => {
                this.video.muted = true;
                this.video.play().catch(() => { });
            });
        } else {
            this.video.pause();
            this.video.style.display = 'none';
            document.body.style.backgroundImage =
                `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${data}')`;
        }
        this.updateMuteUI();
    },

    updateMuteUI() {
        if (!this.video || !this.muteBtn) return;
        this.video.muted = this.isMuted;
        if (this.muteBtn) {
            this.muteBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                ${this.isMuted ? 'Bật tiếng video' : 'Tắt tiếng video'}
            `;
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        Storage.setBool('bg_muted', this.isMuted);
        this.updateMuteUI();
        if (window.SettingsUI) {
            SettingsUI.closeAllMenus();
        }
    },

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Save to IndexedDB to allow files of any size (no limits)
        const saved = await saveBgBlob(file);
        if (saved) {
            this.setBackgroundFromBlob(file);
        } else {
            // Fallback to FileReader if IndexedDB fails
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                try {
                    Storage.set('custom_bg', base64);
                    this.setBackground(base64);
                } catch (_) {
                    alert('Không thể lưu file này.');
                }
            };
            reader.readAsDataURL(file);
        }

        if (window.SettingsUI) {
            SettingsUI.closeAllMenus();
        }
    }
};

window.Background = Background;
window.handleFileSelect = (e) => Background.handleFileSelect(e);
window.toggleMute = () => Background.toggleMute();