var PageMain = {
    name: 'main',
    init: function() {
        this._bg = $('.main-bg');
        this._bg.innerHTML = this.getBackground();

        $.on(window, 'resize', function() {
            this.resizeEmoji();
        }.bind(this));
        
        $.on('.main-menu__continue', 'mousedown', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            App.page.show('select-level');
        }.bind(this));

        $.on('.main-menu__new-game', 'mousedown', function(e) {
            App.settings.set('level', 1);
            App.page.show('select-level');
        }.bind(this));

        this.resizeEmoji();
        
        return this;
    },
    getBackground: function() {
        var symbols = [];
        this.data.levels.forEach(function(level) {
            if (level.bg !== false) {
                symbols = symbols.concat(level.symbols);
            }
        });

        symbols.shuffle();

        var html = [];
        symbols.forEach(function(sym) {
            html.push('<span class="main-emoji emoji">' + sym + '</span>');
        });

        return html.join(' ');
    },
    resizeEmoji: function() {
        var width = Math.floor(document.documentElement.clientWidth / 12),
            bgStyle = this._bg.style;

        bgStyle.fontSize = width + 'px';
        bgStyle.lineHeight =  width + 'px';
    },
    show: function() {
        var cont = $('.main-menu__continue');
        if (App.settings.get('level')) {
            cont.classList.remove('btn_disabled');
        } else {
            cont.classList.add('btn_disabled');
        }

        this._timer = setInterval(function() {
            var elems = $$('.main-emoji'),
                threshold = 0.1;

            for (var i = 0; i < elems.length; i++) {
                elems[i].style.opacity = threshold + Math.random() * 0.4;
            }
        }, 1000);
    },
    hide: function() {
        this._timer && clearInterval(this._timer);
        this._timer = null;
    }
};
