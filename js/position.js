const Position = {
    init() {
        this.container = document.getElementById('main-container');

        const savedX = Number(Storage.get('pos_x', ''));
        const savedY = Number(Storage.get('pos_y', ''));
        if (Number.isFinite(savedX) && Number.isFinite(savedY)) {
            this.container.style.left = savedX + 'px';
            this.container.style.top = savedY + 'px';
            this.container.style.transform = 'none';
            this.clampAndSaveContainerPosition();
        } else {
            this.centerContainer();
            this.saveContainerPosition();
        }

        const locked = Storage.getBool('pos_locked', false);
        if (window.SettingsUI) {
            SettingsUI.updateLockUI(locked);
        }

        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('orientationchange', this.onResize.bind(this));
    },

    clampContainerPosition(x, y) {
        const maxX = Math.max(0, window.innerWidth - this.container.offsetWidth);
        const maxY = Math.max(0, window.innerHeight - this.container.offsetHeight);
        return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
    },

    saveContainerPosition() {
        Storage.set('pos_x', Math.round(this.container.offsetLeft));
        Storage.set('pos_y', Math.round(this.container.offsetTop));
    },

    clampAndSaveContainerPosition() {
        const pos = this.clampContainerPosition(
            this.container.offsetLeft,
            this.container.offsetTop
        );
        this.container.style.left = pos.x + 'px';
        this.container.style.top = pos.y + 'px';
        this.container.style.transform = 'none';
        this.saveContainerPosition();
    },

    centerContainer() {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const cw = this.container.offsetWidth || Math.min(460, Math.max(0, winW - 30));
        const ch = this.container.offsetHeight || 80;
        const x = Math.max(0, (winW - cw) / 2);
        const y = Math.max(0, (winH - ch) / 2);
        this.container.style.left = x + 'px';
        this.container.style.top = y + 'px';
        this.container.style.transform = 'none';
    },

    moveContainer(position) {
        const container = this.container;
        const cw = container.offsetWidth || 460;
        const ch = container.offsetHeight || 80;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const margin = CONFIG.margin || 20;
        let left, top;

        switch (position) {
            case 'center': left = (winW - cw) / 2; top = (winH - ch) / 2; break;
            case 'top': left = (winW - cw) / 2; top = margin; break;
            case 'bottom': left = (winW - cw) / 2; top = winH - ch - margin; break;
            case 'left': left = margin; top = (winW - cw) / 2; break;
            case 'right': left = winW - cw - margin; top = (winH - ch) / 2; break;
            case 'top-left': left = margin; top = margin; break;
            case 'top-right': left = winW - cw - margin; top = margin; break;
            case 'bottom-left': left = margin; top = winH - ch - margin; break;
            case 'bottom-right': left = winW - cw - margin; top = winH - ch - margin; break;
            default: return;
        }

        const clamped = this.clampContainerPosition(left, top);
        container.style.left = clamped.x + 'px';
        container.style.top = clamped.y + 'px';
        container.style.transform = 'none';
        this.saveContainerPosition();
        if (window.SettingsUI) {
            SettingsUI.closeAllMenus();
        }
    },

    onResize() {
        this.clampAndSaveContainerPosition();
    }
};

window.Position = Position;
window.moveContainer = (pos) => Position.moveContainer(pos);