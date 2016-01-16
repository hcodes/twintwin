var App = {
    init: function() {
        this.page.show('main');
    },
    levelTitle: function(level) {
        var levelObj = App.commonData.levels[level];
        return this.levelSymbol(level) + ' ' + levelObj.name;
    },
    levelSymbol: function(level) {
        var levelObj = App.commonData.levels[level];
        return levelObj.titleSymbol;
    },
    commonData: {},
    page: {
        add: function(pages) {
            if (Array.isArray(pages)) {
                pages.forEach(function(page) {
                    this._add(page);
                }, this);
            } else { 
                this._add(page);
            }
        },
        _add: function(page) {
            this.buffer[page.name] = page;
        },
        get: function(name) {
            return this.buffer[name];
        },
        show: function(name, data) {
            var oldName = null;
            if (this.current) {
                this.current.hide();
                oldName = this.current.name;
            }

            var page = this.get(name);
            if (!page._isInited) {
                page.data = App.commonData;
                page.init();
                page._isInited = true;
            }

            this.setCSSClass(page.name);
            page.show(data);

            this.current = page;
        },
        setCSSClass: function(name) {
            document.body.className = 'app_page_' + name;
        },
        hide: function(name) {
            this.get(name).hide();
        },
        current: null,
        buffer: {}
    },
    settings: {
        set: function(name, value) {
            this._buffer[name] = value;
            this._save();
        },
        get: function(name, defValue) {
            if (!this._isLoaded) {
                this._load();
                this._isLoaded = true;
            }
            
            var value = this._buffer[name];
            return value === undefined ? defValue : value;
        },
        lsName: 'de',
        _buffer: {},
        _load: function() {
            var buffer = {};
            try {
                buffer = JSON.parse(localStorage.getItem(this.lsName)) || {};
            } catch(e) {}

            buffer.level = buffer.level || 1;
            buffer.maxLevel = buffer.maxLevel || 1;
            this._buffer = buffer;
        },
        _save: function() {
            try {
                localStorage.setItem(this.lsName, JSON.stringify(this._buffer));
            } catch(e) {} 
        }
    }
};

$.on(document, 'DOMContentLoaded', function() {
    App.page.add([
        PageMain,
        PageSelectLevel,
        PageField
    ]);

    App.init();
});
