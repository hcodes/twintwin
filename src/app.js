var body = document.body;
var App = {
    init: function() {
        body.classList.add('support_transform3d_' + hasSupportCss('perspective'));

        $.on(document, 'mousemove', function() {
            this.setInputType('mouse');
        }.bind(this));

        $.on(document, 'keydown', function() {
            this.setInputType('keyboard');
        }.bind(this));

        $.on(document, 'touchstart', function() {
            this.setInputType('touch');
        }.bind(this));

        this.setInputType('mouse');

        this.page.show(
            this.page.getNameByLocationHash(window.location.hash)
        );
    },
    inputType: null,
    setInputType: function(type) {
        if (type !== this.inputType) {
            body.classList.remove('input_' + this.inputType);
            body.classList.add('input_' + type);
            this.inputType = type;
        }
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
                this._add(pages);
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
                body.classList.remove('page_' + oldName);
            }

            var page = this.get(name);
            if (!page._isInited) {
                page.data = App.commonData;
                page.init();
                page._isInited = true;
            }

            body.classList.add('page_' + name);
            page.show(data);

            if (page.locationHash !== undefined) {
                window.location.hash = page.locationHash;
            }

            this.current = page;
        },
        hide: function(name) {
            this.get(name).hide();
        },
        getNameByLocationHash: function(hash) {
            var name;
            hash = (hash || '').replace(/#/, '');

            Object.keys(this.buffer).some(function(key) {
                var page = this.buffer[key];

                if (page.locationHash === hash) {
                    name = page.name;
                    return true;
                }

                return false;
            }, this);

            return name || 'main';
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
    Gamepad.init();
    GamepadNotice.init();
    App.init();
});
