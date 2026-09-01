const Drag = {
    init() {
        this.container = document.getElementById('main-container');
        this.isDragging = false;
        this.dragPointerId = null;
        this.startX = 0;
        this.startY = 0;

        this.container.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.container.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.container.addEventListener('pointerup', this.stopDragging.bind(this));
        this.container.addEventListener('pointercancel', this.stopDragging.bind(this));
        window.addEventListener('blur', this.stopDragging.bind(this));
    },

    onPointerDown(e) {
        if (e.target.closest('input, button, .suggestions-box')) return;
        if (Storage.getBool('pos_locked', false)) return;

        this.isDragging = true;
        this.dragPointerId = e.pointerId;
        this.startX = e.clientX - this.container.offsetLeft;
        this.startY = e.clientY - this.container.offsetTop;
        this.container.style.transform = 'none';
        this.container.setPointerCapture?.(e.pointerId);
        e.preventDefault();
    },

    onPointerMove(e) {
        if (!this.isDragging || e.pointerId !== this.dragPointerId) return;

        const pos = Position.clampContainerPosition(
            e.clientX - this.startX,
            e.clientY - this.startY
        );

        this.container.style.left = pos.x + 'px';
        this.container.style.top = pos.y + 'px';
        Position.positionSettingsArea();
    },

    stopDragging(e) {
        if (!this.isDragging) return;
        if (e && this.dragPointerId !== null && e.pointerId !== undefined && e.pointerId !== this.dragPointerId) return;

        this.isDragging = false;
        if (this.dragPointerId !== null) {
            try { this.container.releasePointerCapture?.(this.dragPointerId); } catch (_) { }
        }
        this.dragPointerId = null;
        Position.clampAndSaveContainerPosition();
        Position.positionSettingsArea();
    }
};

window.Drag = Drag;