var customEvent = require('event');
var body = document.body;

var Page =  {
    back: function() {
        window.history.back();
        this.showByLocationHash();
    },
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
    has: function(name) {
        return Boolean(this.get(name));
    },
    show: function(name, data) {
        var oldName = null;

        if (this.current) {
            oldName = this.current.name;
            if (oldName === name) {
                return;
            }

            this.current.hide();
            body.classList.remove('page_' + oldName);
        }

        var page = this.get(name);
        if (!page._isInited) {
            page.init();
            page._isInited = true;
        }

        body.classList.add('page_' + name);
        page.show(data);

        if (page.locationHash !== undefined && window.location.hash !== '#' + page.locationHash) {
            window.location.hash = page.locationHash;
        }

        this.current = page;

        this.trigger('show', page);
    },
    hide: function(name) {
        this.get(name).hide();
    },
    showByLocationHash: function() {
        this.show(this. getNameByLocationHash(window.location.hash));
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
};

Object.assign(Page, customEvent.prototype);

module.exports = Page;
