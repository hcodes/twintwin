Array.prototype.shuffle = function () {
    var input = this;
    for (var i = input.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
};

var $ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

$.on = function(el, type, callback) {
    $(el).addEventListener(type, callback, false);

    return $;
};

$.delegate = function(root, el, type, callback) {
    $(root).addEventListener(type, function(e) {
        var cls = el[0] === '.' ? el.substr(1) : el;
        if (e.target.classList.contains(cls)) {
            callback.call(this, e);
        }
    }, false);

    return $;
};

$.off = function(el, type, callback) {
    $(el).removeEventListener(type, callback, false);

    return $;
};

var $$ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelectorAll(el) : el;
};

var setCSS = function(el, props) {
    var style = el.style;
    Object.keys(props).forEach(function(key) {
        style[key] = props[key];
    });
};

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

App.commonData.levels = [
    {
        name: 'Flowers and trees',
        symbols: [
            '💐',
            '🌸',
            '🌷',
            '🍀',
            '🌹',
            '🌻',
            '🌺',
            '🍁',
            '🍃',
            '🍂',
            '🌿',
            '🌾',
            '🌵',
            '🌴',
            '🌲',
            '🌳',
            '🌰',
            '🌼',
            '💮'
        ]
    },
    {
        name: 'Fruits and vegetables',
        symbols: [
            '🌰',
            '🌱',
            '🍎',
            '🍏',
            '🍊',
            '🍋',
            '🍒',
            '🍇',
            '🍉',
            '🍓',
            '🍑',
            '🍈',
            '🍌',
            '🍐',
            '🍍',
            '🍠',
            '🍆',
            '🍅',
            '🌽'
        ]
    },
    {
        name: 'Zodiac Signs',
        symbols: [
            '♈',
            '♉',
            '♊',
            '♋',
            '♌',
            '♍',
            '♎',
            '♏',
            '♐',
            '♑',
            '♒',
            '♓',
            '⛎'
        ]
    },
    {
        name: 'Accessories',
        symbols: [
            '👑',
            '💼',
            '👜',
            '👝',
            '👛',
            '👓',
            '🎀',
            '🌂',
            '💄'
        ]
    },
    {
        name: 'Fashion',
        symbols: [
            '🎩',
            '👒',
            '👟',
            '👞',
            '👡',
            '👠',
            '👢',
            '👕',
            '👔',
            '👚',
            '👗',
            '🎽',
            '👖',
            '👘',
            '👙'
        ]
    },
    {
        name: 'Buildings',
        symbols: [
            '🏠',
            '🏡',
            '🏫',
            '🏢',
            '🏣',
            '🏥',
            '🏦',
            '🏪',
            '🏩',
            '🏨',
            '💒',
            '⛪',
            '🏬',
            '🏤',
            '🌇',
            '🌆',
            '🏯',
            '🏰',
            '⛺',
            '🏭',
            '🗼',
            '🗾',
            '🗻',
            '🌄',
            '🌅',
            '🌃',
            '🗽',
            '🌉',
            '🎠',
            '🎡',
            '⛲',
            '🎢'
        ]
    },
    {
        name: 'Trains',
        symbols: [
            '🚂',
            '🚊',
            '🚉',
            '🚞',
            '🚆',
            '🚄',
            '🚅',
            '🚈',
            '🚇',
            '🚝',
            '🚋',
            '🚃'
        ]
    },
    {
        name: 'Hand Signs',
        bg: false,
        symbols: [
            '👍',
            '👎',
            '👌',
            '👊',
            '✊',
            '✌',
            '👋',
            '✋',
            '👐',
            '👆',
            '👇',
            '👉',
            '👈',
            '🙌',
            '🙏',
            '☝',
            '👏',
            '💪'
        ]
    },
    {
        name: 'Arrows',
        bg: false,
        symbols: [
            '⬇',
            '⬅',
            '➡',
            '↗',
            '↖',
            '↘',
            '↙',
            '↔',
            '↕',
            '🔄',
            '◀',
            '▶',
            '🔼',
            '🔽',
            '↩',
            '↪',
            '⏪',
            '⏩',
            '⏫',
            '⏬',
            '⤵',
            '⤴',
            '🔀',
            '🔃',
            '🔺',,
            '🔻',
            '⬆'
        ]
    },
    {
        name: 'Technology',
        symbols: [
            '🎥',
            '📷',
            '📹',
            '📼',
            '💿',
            '📀',
            '💽',
            '💾',
            '💻',
            '📱',
            '☎',
            '📞',
            '📟',
            '📠',
            '📡',
            '📺',
            '📻'
        ]
    },
    {
        name: 'Sport',
        symbols: [
            '🎯',
            '🏈',
            '🏀',
            '⚽',
            '⚾',
            '🎾',
            '🎱',
            '🏉',
            '🎳',
            '⛳',
            '🚵',
            '🚴',
            '🏁',
            '🏇',
            '🏆',
            '🎿',
            '🏂',
            '🏊',
            '🏄',
            '🎣'
        ]
    },
    {
        name: 'Games and Hobbies',
        symbols: [
            '🎨',
            '🎬',
            '🎤',
            '🎧',
            '🎼',
            '🎵',
            '🎶',
            '🎹',
            '🎻',
            '🎺',
            '🎷',
            '🎸',
            '👾',
            '🎮',
            '🃏',
            '🎴',
            '🀄',
            '🎲'
        ]
    }
];
var PageField = {
    name: 'field',
    init: function(data) {
        this._el = $('.field__cages');

        $.on('.field__exit', 'click', function() {
            App.page.show('select-level');
        });

        $.on(window, 'resize', function() {
            this.resizeCages();
        }.bind(this));

        $.delegate(this._el, '.cage__front', 'click', function(e) {
            var cage = e.target.parentNode,
                ds = cage.dataset;

            if (!cage.classList.contains('cage_opened')) {
                this.info.clicks++;
                this.info.update();
                this.openCage(ds.x, ds.y);
            }
        }.bind(this));

        return this;
    },
    padding: 5,
    cols: 6,
    rows: 4,
    field: [],
    addCages: function() {
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = document.createElement('div');
                cage.className = 'cage';
                cage.dataset.x = x;
                cage.dataset.y = y;
                cage.innerHTML = '<div class="cage__front"></div><div class="cage__back emoji"></div>';
                this._el.appendChild(cage);
            }
        }
    },
    resizeCages: function() {
        var size = this.getSize();
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = this.findCage(x, y);
                cage && setCSS(cage, {
                    width: size.width + 'px',
                    height: size.height + 'px',
                    left: x * (size.width + this.padding) + 'px',
                    top: y * (size.height + this.padding) + 'px',
                    lineHeight: size.height + 'px',
                    fontSize: size.fontSize + 'px'
                });
            }
        }
    },
    getLevelSymbols: function() {
        var level = this._showData.level,
            syms = this.data.levels[level].symbols,
            size = this.cols * this.rows,
            halfSize = size / 2,
            buf = [];

        while(halfSize > buf.length) {
            buf = buf.concat(syms);
        }

        buf = buf.slice(0, halfSize);

        return buf.concat(buf).shuffle();
    },
    getSize: function() {
        var width = Math.floor(this._el.offsetWidth / this.cols) - this.padding,
            height = Math.floor(this._el.offsetHeight / this.rows) - this.padding;

        return {
            width: width,
            height: height,
            fontSize: height * 0.8
        }
    },
    findCage: function(x, y) {
        var cages = $$('.cage', this._el);
        for (var i = 0; i < cages.length; i++) {
            var cage = cages[i];
            var ds = cage.dataset;
            if (x == ds.x && y == ds.y) {
                return cage;
            }
        }

        return null;
    },
    openCage: function(x, y) {
        var cage = this.findCage(x, y),
            len = this._openedCages.length,
            xy = {x: x, y: y};

        cage.classList.add('cage_opened');
        $('.cage__back', cage).innerHTML = this.field[y][x];

        switch (len) {
            case 0:
            break;
            case 1:
                var sym1 = this.field[y][x],
                    sym2 = this.field[this._openedCages[0].y][this._openedCages[0].x];
                if (sym1 === sym2) {
                    this.removeOpenedCages();
                    this.removeCage(x, y);
                } else {
                    var openedCages = [xy].concat(this._openedCages);
                    this._openedCages = [];
                    setTimeout(function() {
                        this.closeOpenedCages(openedCages);
                    }.bind(this), 700);
                }

                xy = null;
            break;
            case 2:
                this.closeOpenedCages();
                this._openedCages = [];
            break;
        }

        xy && this._openedCages.push(xy);
    },
    closeOpenedCages: function(openedCages) {
        (openedCages || this._openedCages).forEach(function(cage) {
            this.closeCage(cage.x, cage.y);
        }, this);
    },
    removeOpenedCages: function() {
        this._openedCages.forEach(function(cage) {
            this.removeCage(cage.x, cage.y);
        }, this);

        this._openedCages = [];
    },
    removeCage: function(x, y) {
        var cage = this.findCage(x, y);
        if (cage) {
            cage.classList.add('cage_removed');
            this.info.cages--;
            this.info.update();
            setTimeout(function() {
                this._el.removeChild(cage);
            }.bind(this), 200);
        }
    },
    closeCage: function(x, y) {
        var cage = this.findCage(x, y);
        if (cage) {
            cage.classList.remove('cage_opened');
            $('.cage__back', cage).innerHTML = '';
        }
    },
    info: {
        update: function() {
            $('.info__clicks-num', this._el).innerHTML = this.clicks;
            $('.info__cages-num', this._el).innerHTML = this.cages;
        }
    },
    reset: function() {
        this.info.clicks = 0;
        this.info.cages = this.cols * this.rows;
        this.info.update();

        this._el.innerHTML = '';
        this._openedCages = [];
    },
    show: function(showData) {
        this._showData = showData || {};
        this.reset();
        var syms = this.getLevelSymbols(),
            s = 0;

        this.field = [];
        for (var y = 0; y < this.rows; y++) {
            var buf = [];
            for (var x = 0; x < this.cols; x++) {
                buf.push(syms[s]);
                s++;
            }

            this.field[y] = buf;
        }

        this.addCages();
        this.resizeCages();

        /*for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                this.openCage(x, y);
            }
        }*/
    },
    hide: function() {
    }
};

var PageMain = {
    name: 'main',
    init: function() {
        this._bg = $('.main-bg');
        this._bg.innerHTML = this.getBackground();

        $.on(window, 'resize', function() {
            this.resizeEmoji();
        }.bind(this));
        
        $.on('.main-start', 'click', function() {
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

var PageSelectLevel = {
    name: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();
        
        $.on('.select-level__exit', 'click', function() {
            App.page.show('main');
        });
        
        $.delegate(el, '.btn', 'click', function(e) {
            var level = e.target.dataset['level'];
            App.page.show('field', {
                level: level
            });
        });

        return this;
    },
    getList: function() {
        var html = [];

        this.data.levels.forEach(function(level, i) {
            var btnClass = ['btn', 'btn_red'];
            if (i > 5) {
                btnClass.push('btn_disabled');
            }

            html.push('<li class="select-level__item"><span data-level="' + i + '" class="' +
                btnClass.join(' ') + '"><span class="select-level__emoji emoji">' +
                level.symbols[0] + '</span>' + level.name + '</span></li>');
        }, this);
        
        return html.join('');
    },
    show: function() {
    },
    hide: function() {
    }
};
