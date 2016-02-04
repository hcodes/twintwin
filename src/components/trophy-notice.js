var TrophyNotice = function(data) {
    this._data = data;
    this._onclick = function() {
        this.close();
        App.page.show('trophies');
    }.bind(this);
};

TrophyNotice.prototype = {
    open: function() {
        this._el = $.js2dom({
            cl: 'trophy-notice',
            c: [{
                cl: 'trophy-notice__title',
                c: this._data.title
            }, {
                cl: 'trophy-notice__type',
                c: this._data.type
            }]
        });

        body.appendChild(this._el);

        setTimeout(function() {
            this._el.classList.add('trophy-notice_open');
            $.on(this._el, 'click', this._onclick);
        }.bind(this), 50);

        return this;
    },
    close: function() {
        this._el.classList.remove('trophy-notice_open');
        $.off(this._el, 'click', this._onclick);

        setTimeout(this.remove.bind(this), 200);

        return this;
    },
    remove: function() {
        body.removeChild(this._el);
        delete this._el;
    }
};

/*var tp = new TrophyNotice({
    title: 'Hello world!',
    type: '🏆'
}).open();*/
