var App = {
    init: function() {
        this.page.show('main');
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
