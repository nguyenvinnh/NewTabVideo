const Search = {
    init() {
        this.input = document.getElementById('search-input');
        this.clearBtn = document.getElementById('clear-btn');
        this.suggestionsBox = document.getElementById('suggestions');
        this.form = document.getElementById('search-form');
        this.debounceTimer = null;
        this.suggestionRequestId = 0;
        this.suggestionScript = null;
        this.activeIndex = -1;
        this.originalQuery = '';

        this.updateClearBtnVisibility();
        this.clearBtn.addEventListener('click', this.clearSearch.bind(this));
        this.input.addEventListener('input', this.onInput.bind(this));
        this.input.addEventListener('keydown', this.onKeyDown.bind(this));
        this.input.addEventListener('focus', this.onFocus.bind(this));
        this.input.addEventListener('click', this.onFocus.bind(this));
        document.addEventListener('click', this.onDocumentClick.bind(this));
    },

    updateClearBtnVisibility() {
        this.clearBtn.style.display = this.input.value.trim() !== '' ? 'block' : 'none';
    },

    clearSearch() {
        this.input.value = '';
        this.originalQuery = '';
        this.updateClearBtnVisibility();
        this.activeIndex = -1;
        this.suggestionRequestId++;
        if (this.suggestionScript) {
            this.suggestionScript.remove();
            this.suggestionScript = null;
        }
        this.suggestionsBox.style.display = 'none';
        this.suggestionsBox.innerHTML = '';
        this.input.focus();
    },

    updateSuggestionsPosition() {
        const container = document.getElementById('main-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const suggestionsHeight = 220;
            if (spaceBelow < suggestionsHeight && rect.top > spaceBelow) {
                this.suggestionsBox.classList.add('open-above');
            } else {
                this.suggestionsBox.classList.remove('open-above');
            }
        }
    },

    onFocus() {
        const query = this.input.value.trim();
        if (query !== '') {
            const items = this.suggestionsBox.querySelectorAll('.suggestion-item');
            if (items.length > 0) {
                this.updateSuggestionsPosition();
                this.suggestionsBox.style.display = 'block';
                if (window.SettingsUI) window.SettingsUI.closeAllMenus();
            } else {
                this.onInput();
            }
        }
    },

    onInput() {
        this.updateClearBtnVisibility();
        clearTimeout(this.debounceTimer);
        this.activeIndex = -1;

        const query = this.input.value;
        this.originalQuery = query;
        this.suggestionRequestId++;

        if (this.suggestionScript) {
            this.suggestionScript.remove();
            this.suggestionScript = null;
        }

        const trimmedQuery = query.trim();
        if (trimmedQuery === '') {
            this.suggestionsBox.style.display = 'none';
            this.suggestionsBox.innerHTML = '';
            return;
        }

        this.debounceTimer = setTimeout(() => {
            this.fetchSuggestions(trimmedQuery, this.suggestionRequestId);
        }, CONFIG.suggestionDebounce || 500);
    },

    fetchSuggestions(query, requestId) {
        const callbackName = '__showSuggestions_' + requestId;
        const script = document.createElement('script');
        this.suggestionScript = script;

        window[callbackName] = (data) => {
            try {
                if (requestId !== this.suggestionRequestId) return;
                if (this.input.value.trim() !== query && this.originalQuery.trim() !== query) return;
                this.showSuggestions(data);
            } finally {
                delete window[callbackName];
                script.remove();
                if (this.suggestionScript === script) this.suggestionScript = null;
            }
        };

        script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&callback=${callbackName}`;
        script.onerror = () => {
            delete window[callbackName];
            script.remove();
            if (this.suggestionScript === script) this.suggestionScript = null;
            if (requestId === this.suggestionRequestId) {
                this.suggestionsBox.style.display = 'none';
                this.suggestionsBox.innerHTML = '';
            }
        };
        document.body.appendChild(script);
    },

    showSuggestions(data) {
        const suggestions = Array.isArray(data?.[1]) ? data[1] : [];
        this.suggestionsBox.innerHTML = '';
        this.activeIndex = -1;

        if (suggestions.length > 0) {
            suggestions.slice(0, 5).forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = item;
                div.dataset.index = index;

                div.addEventListener('click', () => {
                    this.input.value = item;
                    this.originalQuery = item;
                    this.updateClearBtnVisibility();
                    this.suggestionsBox.style.display = 'none';
                    this.activeIndex = -1;
                    this.form.submit();
                });

                div.addEventListener('mouseenter', () => {
                    this.setActiveSuggestion(index);
                });

                this.suggestionsBox.appendChild(div);
            });
            this.updateSuggestionsPosition();
            this.suggestionsBox.style.display = 'block';
            if (window.SettingsUI) window.SettingsUI.closeAllMenus();
        } else {
            this.suggestionsBox.style.display = 'none';
        }
    },

    setActiveSuggestion(index) {
        const items = this.suggestionsBox.querySelectorAll('.suggestion-item');
        items.forEach(item => item.classList.remove('active'));
        this.activeIndex = index;
        if (index >= 0 && items[index]) {
            items[index].classList.add('active');
            items[index].scrollIntoView({ block: 'nearest' });
            this.input.value = items[index].textContent;
        } else {
            this.input.value = this.originalQuery;
        }
        this.updateClearBtnVisibility();
    },

    onKeyDown(e) {
        const items = this.suggestionsBox.querySelectorAll('.suggestion-item');
        const isOpen = this.suggestionsBox.style.display === 'block' && items.length > 0;

        if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            let nextIndex = this.activeIndex + 1;
            if (nextIndex >= items.length) {
                nextIndex = -1;
            }
            this.setActiveSuggestion(nextIndex);
            return;
        }

        if (e.key === 'ArrowUp' && isOpen) {
            e.preventDefault();
            let prevIndex = this.activeIndex - 1;
            if (prevIndex < -1) {
                prevIndex = items.length - 1;
            }
            this.setActiveSuggestion(prevIndex);
            return;
        }

        if (e.key === 'Enter' && isOpen && this.activeIndex >= 0) {
            e.preventDefault();
            items[this.activeIndex].click();
            return;
        }

        if (e.key === 'Escape') {
            this.suggestionsBox.style.display = 'none';
            this.setActiveSuggestion(-1);
        }
    },

    onDocumentClick(e) {
        if (!this.form.contains(e.target)) {
            this.suggestionsBox.style.display = 'none';
        }
    }
};

window.Search = Search;