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
            callback.call(e.target, e);
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

var leadZero = function(num) {
    return num < 10 ? '0' + num : num;
};

// for iPad 1
if(!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if(typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            NOP = function() {
            },
            fBound = function() {
                return fToBind.apply(this instanceof NOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        NOP.prototype = this.prototype;
        fBound.prototype = new NOP();

        return fBound;
    };
}

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

App.commonData.levels = [
    {
        name: '',
        symbols: []
    },
    {
        name: 'Flowers and trees',
        titleSymbol: '💐',
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
        titleSymbol: '🍏',
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
        titleSymbol: '♋',
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
        titleSymbol: '👛',
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
        titleSymbol: '👗',
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
        titleSymbol: '🏢',
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
        titleSymbol: '🚄',
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
        titleSymbol: '👌',
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
        titleSymbol: '↗',
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
        titleSymbol: '📀',
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
        titleSymbol: '🏀',
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
        titleSymbol: '🎨',
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

        this.setEvents();
        this.info.parent = this;

        return this;
    },
    setEvents: function() {
        $.on('.field__exit', 'mousedown', function() {
            App.page.show('select-level');
        });

        $.on(window, 'resize', function() {
            this.resizeCages();
        }.bind(this));

        $.delegate(this._el, '.cage__front', 'mousedown', function(e) {
            var cage = e.target.parentNode,
                ds = cage.dataset;

            if (!cage.classList.contains('cage_opened')) {
                this.info.clicks++;
                this.info.update();
                this.openCage(ds.x, ds.y);
            }
        }.bind(this));
    },
    padding: 5,
    cols: 3,
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
        var level = this._level,
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

            if (!this.info.cages) {
                this.finish();
            }
        }
    },
    closeCage: function(x, y) {
        var cage = this.findCage(x, y);
        if (cage) {
            cage.classList.remove('cage_opened');
            $('.cage__back', cage).innerHTML = '';
        }
    },
    initField: function() {
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
    },
    info: {
        formatTime: function(ms) {
            var sec = Math.floor(ms / 1000),
                min = Math.floor(sec / 60),
                sec2 = sec - min * 60;

            return min + ':' + leadZero(sec2);
        },
        update: function() {
            this.currentTime = Date.now();
            $('.info__clicks-num', this._el).innerHTML = this.clicks;
            $('.info__cages-num', this._el).innerHTML = this.cages;
            $('.info__level-title', this._el).innerHTML = this.levelTitle;
            $('.info__time-num', this._el).innerHTML = this.formatTime(this.currentTime - this.startTime);
        },
        start: function(level, cages) {
            this.stop();

            this.clicks = 0;
            this.cages = cages;
            this.levelTitle = App.levelTitle(level);
            this.startTime = Date.now();

            this.update();
            this._timer = setInterval(function() {
                this.update();
            }.bind(this), 500);
        },
        stop: function() {
            this._timer && clearInterval(this._timer);
            this._timer = null;
        }
    },
    finish: function() {
        var maxLevel = App.settings.get('maxLevel');
        App.settings.set('maxLevel', Math.max(maxLevel, App.level + 1));

        this.info.stop();
    },
    show: function() {
        this._el.innerHTML = '';
        this._openedCages = [];
        this._level = App.settings.get('level');

        this.info.start(this._level, this.cols * this.rows);
        this.initField();
        this.addCages();
        this.resizeCages();

        /*for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                this.openCage(x, y);
            }
        }*/
    },
    hide: function() {
        this.info.stop();
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

var PageSelectLevel = {
    name: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();
        
        $.on('.select-level__exit', 'click', function() {
            App.page.show('main');
        });
        
        $.delegate(el, '.btn', 'click', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            var level = parseInt(e.target.dataset['level']);
            App.settings.set('level', level);
            App.page.show('field');
        });

        return this;
    },
    getList: function() {
        var html = [],
            maxLevel = App.settings.get('maxLevel');

        this.data.levels.forEach(function(level, i) {
            if (!i) {
                return;
            }

            var btnClass = ['btn', 'btn_red', 'btn_middle'];
            if (maxLevel < i) {
                btnClass.push('btn_disabled');
            }

            html.push('<li class="select-level__item"><span data-level="' + i + '" class="' +
                btnClass.join(' ') + '"><span class="select-level__emoji emoji">' +
                App.levelSymbol(i) + '</span>' + level.name + '</span></li>');
        }, this);
        
        return html.join('');
    },
    show: function() {
    },
    hide: function() {
    }
};
