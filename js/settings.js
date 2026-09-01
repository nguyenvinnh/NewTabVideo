const SettingsUI = {
    init() {
        this.menu = document.getElementById('settings-menu');
        this.safeSearchBtn = document.getElementById('safe-search-btn');
        this.lockPosBtn = document.getElementById('lock-pos-btn');

        this.isSafeSearchOff = Storage.getBool('safe_search_off', false);
        this.updateSafeSearchUI();

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#settings-menu, #settings-btn')) {
                this.closeAllMenus();
            }
        });
    },

    toggleSettingsMenu(e) {
        if (e) e.stopPropagation();
        const opening = !this.menu.classList.contains('show');
        if (opening) {
            const container = document.getElementById('main-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const menuHeight = 280;
                if (spaceBelow < menuHeight && rect.top > spaceBelow) {
                    this.menu.classList.add('open-above');
                } else {
                    this.menu.classList.remove('open-above');
                }
            }

            this.menu.classList.add('show');
            if (window.Search && window.Search.suggestionsBox) {
                window.Search.suggestionsBox.style.display = 'none';
            }
        } else {
            this.closeAllMenus();
        }
    },

    closeAllMenus() {
        if (this.menu) {
            this.menu.classList.remove('show');
        }
    },

    // SafeSearch
    updateSafeSearchUI() {
        const input = document.getElementById('safe-search-input');
        if (!input) return;
        input.disabled = false;
        if (this.isSafeSearchOff) {
            input.value = 'off';
            this.safeSearchBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Bật lọc tìm kiếm
            `;
        } else {
            input.value = 'active';
            this.safeSearchBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Tắt lọc tìm kiếm
            `;
        }
    },

    toggleSafeSearch() {
        this.isSafeSearchOff = !this.isSafeSearchOff;
        Storage.setBool('safe_search_off', this.isSafeSearchOff);
        this.updateSafeSearchUI();
        this.closeAllMenus();
    },

    // Lock Position
    updateLockUI(isLocked) {
        const container = document.getElementById('main-container');
        if (!container || !this.lockPosBtn) return;
        if (isLocked) {
            container.classList.remove('draggable');
            this.lockPosBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                Khóa vị trí: Bật
            `;
        } else {
            container.classList.add('draggable');
            this.lockPosBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                Khóa vị trí: Tắt
            `;
        }
    },

    toggleLockPosition() {
        const locked = Storage.getBool('pos_locked', false);
        const newLock = !locked;
        Storage.setBool('pos_locked', newLock);
        this.updateLockUI(newLock);
        this.closeAllMenus();
    }
};

window.SettingsUI = SettingsUI;
window.toggleSettingsMenu = (e) => SettingsUI.toggleSettingsMenu(e);
window.closeAllMenus = () => SettingsUI.closeAllMenus();
window.toggleSafeSearch = () => SettingsUI.toggleSafeSearch();
window.toggleLockPosition = () => SettingsUI.toggleLockPosition();