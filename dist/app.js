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

function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

function formatTime(ms) {
    var sec = Math.floor(ms / 1000),
        min = Math.floor(sec / 60),
        sec2 = sec - min * 60;

    return min + ':' + leadZero(sec2);
}

var $ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

$._fromHTML = document.createElement('div');
$.fromHTML = function(data) {
    this._fromHTML.innerHTML = jstohtml(data);
    var result = this._fromHTML.firstElementChild;
    this._fromHTML.innerHTML = '';

    return result;
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

$.extend = function(dest, source) {
    Object.keys(source).forEach(function(key) {
        if(typeof dest[key] === 'undefined') {
           dest[key] = source[key];
        }
    });
    
    return dest;
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

var hasSupportCss = (function() {
    var div = document.createElement('div'),
        vendors = 'Khtml ms O Moz Webkit'.split(' '),
        len = vendors.length;

    return function(prop) {

        if (prop in div.style) return true;

        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });

        while(len--) {
            if (vendors[len] + prop in div.style) {
                return true;
            } 
        }

        return false;
    };
})();

function Event() {};

Event.prototype = {
    /*
     * Attach a handler to an custom event.
     * @param {string} type
     * @param {Function} callback
     * @return {Event} this
    */
    on: function(type, callback) {
        if (!this._eventBuffer) {
            this._eventBuffer = [];
        }

        if(type && callback) {
            this._eventBuffer.push({
                type: type,
                callback: callback
            });
        }

        return this;
    },
    /*
     * Remove a previously-attached custom event handler.
     * @param {string} type
     * @param {Function} callback
     * @return {Event} this
    */
    off: function(type, callback) {
        var buf = this._eventBuffer || [];

        for(var i = 0; i < buf.length; i++) {
            if(callback === buf[i].callback && type === buf[i].type) {
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    },
    /*
     * Execute all handlers for the given event type.
     * @param {string} type
     * @param {*} [data]
     * @return {Event} this
    */
    trigger: function(type, data) {
        var buf = this._eventBuffer || [];

        for(var i = 0; i < buf.length; i++) {
            if(type === buf[i].type) {
                buf[i].callback.call(this, {type: type}, data);
            }
        }

        return this;
    }
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

(function () {
    'use strict';

    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        x;

    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            window.clearTimeout(id);
        };
    }
}());
/*!
 * jstohtml v1.1.0
 * Copyright 2014 Denis Seleznev
 * Released under the MIT license.
 *
 * https://github.com/hcodes/jstohtml/
*/

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define('jstohtml', [], factory);
    } else if(typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.jstohtml = factory();
    }
}(this, function() {
    'use strict';

    var noClosingTag = [
            'img', 'input', 'br', 'embed', 'source',
            'link', 'meta', 'area', 'command',
            'base', 'col', 'param', 'wbr', 'hr', 'keygen'
        ],
        ignoredKeys = ['c', 'cl', 't', 'class'],
        isArray = Array.isArray,
        toString = Object.prototype.toString,
        entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;'
        },
        escapeRE = /[&<>"'\/]/g;

    function escapeHtml(str) {
        return str.replace(escapeRE, function(s) {
            return entityMap[s];
        });
    }

    function isPlainObj(obj) {
        return toString.call(obj) === '[object Object]';
    }

    function buildItem(data) {
        if(data === null || data === undefined) {
            return '';
        }

        var buf = [];

        if(isPlainObj(data)) {
            return tag(data);
        } else if(isArray(data)) {
            for(var i = 0, len = data.length; i < len; i++) {
                buf.push(buildItem(data[i]));
            }

            return buf.join('');
        } else {
            return '' + data;
        }
    }

    function tag(data) {
        var t = data.t || 'div',
            text = '<' + t + attrs(data);

        if(noClosingTag.indexOf(t) !== -1) {
            return text + '/>';
        }

        text += '>';

        if(data.c) {
            text += buildItem(data.c);
        }

        text += '</' + t + '>';

        return text;
    }

    function attrs(data) {
        var cl = data['cl'] || data['class'],
            text = cl ? attr('class', cl) : '';

        for(var key in data) {
            if(data.hasOwnProperty(key) && ignoredKeys.indexOf(key) === -1) {
                text += attr(key, data[key]);
            }
        }

        return text;
    }

    function attr(name, value) {
        if(value === undefined || value === null || value === false) {
            return '';
        }

        return ' ' + name + '="' + escapeHtml(isArray(value) ? value.join(' ') : '' + value) + '"';
    }

    return buildItem;
}));

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
    Gamepads.init();
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
App.page.add({
    name: 'field',
    locationHash: 'game',
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
    cols: 6,
    rows: 5,
    field: [],
    addCages: function() {
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = $.fromHTML({
                    cl: 'cage',
                    'data-x': x,
                    'data-y': y,
                    c: [{
                        cl: 'cage__front'
                    }, {
                        cl: 'cage__back emoji'
                    }]
                });

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
        update: function() {
            this.currentTime = Date.now();
            $('.info__clicks-num', this._el).innerHTML = this.clicks;
            $('.info__cages-num', this._el).innerHTML = this.cages;
            $('.info__level-title', this._el).innerHTML = this.levelTitle;
            $('.info__time-num', this._el).innerHTML = formatTime(this.currentTime - this.startTime);
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
});

App.page.add({
    name: 'main',
    locationHash: '',
    init: function() {
        this._bg = $('.main-bg');
        this._bg.innerHTML = this.getBackground();

        $.on(window, 'resize', function() {
            this.resizeEmoji();
        }.bind(this));

        $.on('.main-menu__continue', 'click', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            App.page.show('select-level');
        });

        $.on('.main-menu__new-game', 'click', function(e) {
            App.settings.set('level', 1);
            App.page.show('select-level');
        }.bind(this));

        this.resizeEmoji();
        this.initLogo();

        return this;
    },
    initLogo: function() {
        var el  = $('.main-logo');
        setTimeout(function() {
            el.classList.add('main-logo_visible');
        }, 500);
    },
    getBackground: function() {
        var symbols = [];
        this.data.levels.forEach(function(level) {
            if (level.bg !== false) {
                symbols = symbols.concat(level.symbols);
            }
        });

        symbols.shuffle();

        return jstohtml(symbols.map(function(sym) {
            return {
                cl: ['main-emoji', 'emoji'],
                c: sym
            };
        }));
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
});

App.page.add({
    name: 'select-level',
    locationHash: 'select-level',
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

            html.push({
                t: 'li',
                cl: 'select-level__item',
                c: {
                    t: 'span',
                    cl: [
                        'btn btn_red btn_middle',
                        maxLevel < i ? 'btn_disabled' : ''
                    ],
                    'data-level': i,
                    c: [
                        {
                            t: 'span',
                            cl: 'select-level__emoji emoji',
                            c: App.levelSymbol(i)
                        },
                        level.name
                    ]
                }
            });
        }, this);
        
        return jstohtml(html);
    },
    show: function() {},
    hide: function() {}
});

var Gamepads = {
    init: function() {
        if (!this.supported()) {
            return;
        }

        $.on(window, 'gamepadconnected', function(e) {
            this.search();
            this.trigger('connected');
            this.showConnected(e);

            if (!this._rafId) {
                this._rafId = window.requestAnimationFrame(this.checkButtons.bind(this));
            }

        }.bind(this));

        $.on(window, 'gamepaddisconnected', function(e) {
            this.search();
            this.trigger('disconnected');
            this.showDisconnected(e);

            if (!this.get().length && this._rafId) {
                window.cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
        }.bind(this));

        $.extend(this, Event.prototype);

        this._elConnected = $.fromHTML({
            cl: 'gamepad-connected',
            c: [
                '✔ 🎮',
                {
                    cl: 'gamepad-connected__num'
                }
            ]
        });

        this._elDisconnected = $.fromHTML({
            cl: 'gamepad-disconnected',
            c: [
                '✖ 🎮',
                {
                    cl: 'gamepad-disconnected__num'
                }
            ]
        });

        body.appendChild(this._elConnected);
        body.appendChild(this._elDisconnected);
    },
    pressedBuffer: [],
    checkButtons: function() {
        this.get().forEach(function(pad, padIndex) {
            this.pressedBuffer[padIndex] = this.pressedBuffer[padIndex] || {};
            pad.buttons.forEach(function(button, buttonIndex) {
                if (typeof button === 'object') {
                    if (this.pressedBuffer[padIndex][buttonIndex] && !button.pressed) {
                        this.trigger(this.getButtonEventName(pad.index, i));
                    }

                    this.pressedBuffer[padIndex][buttonIndex] = button.pressed;
                }
            }, this);
        }, this);

        this._rafId = window.requestAnimationFrame(this.checkButtons.bind(this));
    },
    supported: function() {
        return typeof navigator.getGamepads === 'function';
    },
    get: function() {
        return this._pads;
    },
    item: function(num) {
        return this.get()[num];
    },
    count: function() {
        return this.get().length;
    },
    search: function() {
        this._pads = this.supported() ? navigator.getGamepads() : [];
    },
    // Gamepad: XBox360
    buttonName: {
        green: 0,
        red: 1,
        yellow: 3,
        blue: 2,
        left: 14,
        top: 12,
        right: 15,
        bottom: 13,
        back: 8,
        start: 9
    },
    getButtonId: function(name) {
        return this.buttonName[name];
    },
    getButtonEventName: function(gamepadIndex, button) {
        return 'gamepad-' + gamepadIndex + ':button-' + button;
    },
    onbutton: function(gamepadIndex, button, callback) {
        var self = this;

        function setEvent(b) {
            var num = typeof b === 'number' ? b : self.getButtonId(b);
            self.on(self.getButtonEventName(gamepadIndex, num), callback);
        }

        if (Array.isArray(button)) {
            button.forEach(function(b) {
                setEvent(b);
            });
        } else {
            setEvent(button);
        }
    },
    timeout: 3000,
    showDisconnected: function(e) {
        var cl = 'gamepad-disconnected_show',
            el = this._elDisconnected;

        el.classList.add(cl);

        if (this._dtimer) {
            clearTimeout(this._dtime);
            this._dtimer = null;
        }

        this._dtimer = setTimeout(function() {
            el.classList.remove(cl);
            this._dtimer = null;
        }.bind(this), this.timeout);
    },
    showConnected: function(e) {
        var cl = 'gamepad-connected_show',
            el = this._elConnected;

        el.classList.add(cl);

        if (this._timer) {
            clearTimeout(this._time);
            this._timer = null;
        }

        this._timer = setTimeout(function() {
            el.classList.remove(cl);
            this._timer = null;
        }.bind(this), this.timeout);
    },
    _pads: []
};

var TrophyNotice = function(data) {
    this._data = data;
    this._onclick = function() {
        this.close();
        App.page.show('trophies');
    }.bind(this);
};

TrophyNotice.prototype = {
    open: function() {
        this._el = $.fromHTML({
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
