var body = document.body;

module.exports =  {
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
};
