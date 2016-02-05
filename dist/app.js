(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var dom = require('dom'),
    $ = dom.$,
    Gamepad = require('gamepad'),
    GamepadNotice = require('gamepad-notice'),
    Page = require('page'),
    jstohtml = require('jstohtml'),
    body = document.body;

require('array');
require('function');

var App = {
    init: function() {
        body.classList.add('support_transform3d_' + dom.hasSupportCss('perspective'));

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

        Page.show(
            Page.getNameByLocationHash(window.location.hash)
        );
    },
    inputType: null,
    setInputType: function(type) {
        if (type !== this.inputType) {
            body.classList.remove('input_' + this.inputType);
            body.classList.add('input_' + type);
            this.inputType = type;
        }
    }
};

$.on(document, 'DOMContentLoaded', function() {
    Gamepad.init();
    GamepadNotice.init();
    Page.add([
        require('main'),
        require('game'),
        require('multiplayer'),
        require('select-level')
    ]);
    App.init();
});

},{"array":11,"dom":13,"function":15,"game":17,"gamepad":6,"gamepad-notice":5,"jstohtml":1,"main":18,"multiplayer":19,"page":20,"select-level":21}],3:[function(require,module,exports){
var $ = require('dom').$;

function FieldCursor(data) {
    this.elem = data.elem;

    this.width = data.width;
    this.height = data.height;

    this.padding = data.padding;
    
    this.cols = data.cols;
    this.rows = data.rows;

    this.x = data.x || 0;
    this.y = data.y || 0;

    if (data.hidden) {
        this.hide();
    } else {
        this.show();
    }
}

FieldCursor.prototype = {
    hide: function() {
        if (this.hidden !== true) {
            this.hidden = true;
            this.elem.classList.add('field-cursor_hidden');
        }
    },
    show: function() {
        if (this.hidden !== false) {
            this.hidden = false;
            this.elem.classList.remove('field-cursor_hidden');
            this.update();
        }
    },
    update: function() {
        this.size(this.width, this.height, this.padding);
    },
    size: function(width, height, padding) {
        this.width = width;
        this.height = height;
        this.padding = padding;

        $.size(this.elem, width, height);

        this.move(this.x, this.y);
    },
    move: function(kx, ky) {
        var x = this.x,
            y = this.y;

        if (kx) {
            x += kx;
        }

        if (ky) {
            y += ky;
        }

        if (x > this.cols - 1) {
            x = this.cols - 1;
        }
        
        if (x < 0) {
            x = 0;
        }

        if (y > this.rows - 1) {
            y = this.rows - 1;
        }

        if (y < 0) {
            y = 0;
        }

        this.x = x;
        this.y = y;

        $.move(
            this.elem,
            x * (this.width + this.padding),
            y * (this.height + this.padding)
        );
    },
    left: function() {
        this.show();
        this.move(-1, 0);
    },
    right: function() {
        this.show();
        this.move(1, 0);
    },
    up: function() {
        this.show();
        this.move(0, -1);
    },
    down: function() {
        this.show();
        this.move(0, 1);
    },
    getXY: function() {
        return {
            x: this.x,
            y: this.y
        };
    },
    destroy: function() {
        this.elem = null;
    }
};

module.exports = FieldCursor;

},{"dom":13}],4:[function(require,module,exports){
var dom = require('dom'),
    $ = dom.$,
    $$ = dom.$$,
    levels = require('levels'),
    Settings = require('settings'),
    FieldCursor = require('field-cursor'),
    InfoPanel = require('info-panel'),
    Gamepad = require('gamepad');

function Field(data) {
    this.elem = $('.field__cages', data.elem);

    this.control = data.control;
    this.cols = data.cols;
    this.rows = data.rows;
    this.padding = 5;

    this.field = [];

    this.fieldCursor = new FieldCursor({
        elem: $('.field-cursor', data.elem),
        hidden: true,
        cols: this.cols,
        rows: this.rows,
        padding: this.padding
    });

    this.infoPanel = new InfoPanel(data.elem);

    this.setEvents();
}

Field.prototype = {
    setEvents: function() {
        this.setKeyboardEvents();
        this.setMouseEvents();
        this.setGamepadEvents();

        $.on(window, 'resize', function() {
            if (!this.isHidden) {
                this.resizeCages();
            }
        }.bind(this));
    },
    isControl: function(type) {
        return this.control === '*' || this.control === type;
    },
    setMouseEvents: function() {
        $.delegate(this.elem, '.cage__front', 'mousedown', function(e) {
            if (!this.isControl('mouse')) {
                return;
            }

            this.fieldCursor.hide();

            var cage = e.target.parentNode,
                ds = cage.dataset;

            this.openCage(ds.x, ds.y);
        }.bind(this));
    },
    setKeyboardEvents: function() {
        $.on(document, 'keydown', function(e) {
            if (!this.isControl('keyboard')) {
                return;
            }

            switch (e.key) {
                case 'ArrowUp':
                    this.fieldCursor.up();
                break;
                case 'ArrowLeft':
                    this.fieldCursor.left();
                break;
                case 'ArrowRight':
                    this.fieldCursor.right();
                break;
                case 'ArrowDown':
                    this.fieldCursor.down();
                break;
                case ' ':
                case 'Enter':
                    this.openCageWithCursor();
                break;
            }
        }.bind(this));
    },
    setGamepadEvents: function() {
        Gamepad.onbutton('left', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.left();
            }
        }.bind(this));

        Gamepad.onbutton('right', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.right();
            }
        }.bind(this));

        Gamepad.onbutton('up', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.up();
            }
        }.bind(this));

        Gamepad.onbutton('down', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.down();
            }
        }.bind(this));

        Gamepad.onbuttons(
            ['yellow', 'blue', 'green'],
            function() {
                if (this.isControl('gamepad')) {
                    this.openCageWithCursor();
                }
            }.bind(this)
        );
    },
    addCages: function() {
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = $.js2dom({
                    cl: 'cage',
                    'data-x': x,
                    'data-y': y,
                    c: [
                        {cl: 'cage__front'},
                        {cl: 'cage__back emoji'}
                    ]
                });

                this.elem.appendChild(cage);
            }
        }
    },
    resizeCages: function() {
        var size = this.getSize();
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = this.findCage(x, y);
                cage && $.css(cage, {
                    width: size.width + 'px',
                    height: size.height + 'px',
                    left: x * (size.width + this.padding) + 'px',
                    top: y * (size.height + this.padding) + 'px',
                    lineHeight: size.height + 'px',
                    fontSize: size.fontSize + 'px'
                });
            }
        }

        this.fieldCursor.size(size.width, size.height, this.padding);
    },
    getLevelSymbols: function() {
        var level = this._level,
            syms = levels[level].symbols,
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
        var width = Math.floor(this.elem.offsetWidth / this.cols) - this.padding,
            height = Math.floor(this.elem.offsetHeight / this.rows) - this.padding;

        return {
            width: width,
            height: height,
            fontSize: height * 0.8
        }
    },
    findCage: function(x, y) {
        var cages = $$('.cage', this.elem);
        for (var i = 0; i < cages.length; i++) {
            var cage = cages[i];
            var ds = cage.dataset;
            if (x == ds.x && y == ds.y) {
                return cage;
            }
        }

        return null;
    },
    openCageWithCursor: function() {
        var xy = this.fieldCursor.getXY();
        this.openCage(xy.x, xy.y);
    },
    openCage: function(x, y) {
        var cage = this.findCage(x, y),
            len = this._openedCages.length,
            xy = {x: x, y: y};

        if (!cage || cage.classList.contains('cage_opened')) {
            return;
        }

        this.infoPanel.clicks++;
        this.infoPanel.update();

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
            this.infoPanel.cages--;
            this.infoPanel.update();

            setTimeout(function() {
                this.elem.removeChild(cage);
            }.bind(this), 200);

            if (!this.infoPanel.cages) {
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
    finish: function() {
        var maxLevel = Settings.get('maxLevel');
        Settings.set('maxLevel', Math.max(maxLevel, Settings.level + 1));

        this.infoPanel.stop();
    },
    show: function() {
        this.elem.innerHTML = '';
        this._openedCages = [];
        this._level = Settings.get('level');

        this.infoPanel.start(this._level, this.cols * this.rows);
        this.initField();
        this.addCages();
        this.resizeCages();

        /*for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                this.openCage(x, y);
            }
        }*/

        this.isHidden = false;
    },
    hide: function() {
        this.isHidden = true;
        this.infoPanel.stop();
    }
};

module.exports = Field;

},{"dom":13,"field-cursor":3,"gamepad":6,"info-panel":7,"levels":9,"settings":10}],5:[function(require,module,exports){
var $ = require('dom').$,
    Gamepad = require('gamepad'),
    body = document.body;

module.exports = {
    init: function() {
        this.build();
        this.setEvents();
    },
    build: function() {
        this._elemConnected = $.js2dom({
            cl: 'gamepad-notice-connected',
            c: [
                '✔ 🎮',
                {
                    cl: 'gamepad-notice-connected__num'
                }
            ]
        });

        this._elemDisconnected = $.js2dom({
            cl: 'gamepad-notice-disconnected',
            c: [
                '✖ 🎮',
                {
                    cl: 'gamepad-notice-disconnected__num'
                }
            ]
        });
    },
    setEvents: function() {
        Gamepad.on('connected', function() {
            this.showConnected(e);
        }.bind(this));

        Gamepad.on('disconnected', function() {
            this.showDisconnected(e);
        }.bind(this));

        body.appendChild(this._elemConnected);
        body.appendChild(this._elemDisconnected);
    },
    timeout: 3000,
    showDisconnected: function(e) {
        var cl = 'gamepad-disconnected_show',
            el = this._elemDisconnected;

        el.classList.add(cl);

        if (this._disTimer) {
            clearTimeout(this._disTimer);
            this._disTimer = null;
        }

        this._disTimer = setTimeout(function() {
            el.classList.remove(cl);
            this._disTimer = null;
        }.bind(this), this.timeout);
    },
    showConnected: function(e) {
        var cl = 'gamepad-connected_show',
            el = this._elemConnected;

        el.classList.add(cl);

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this._timer = setTimeout(function() {
            el.classList.remove(cl);
            this._timer = null;
        }.bind(this), this.timeout);
    }
};

},{"dom":13,"gamepad":6}],6:[function(require,module,exports){
var $ = require('dom').$,
    Event = require('event');

require('raf');

module.exports = {
    init: function() {
        $.extend(this, Event.prototype);

        if (!this.supported()) {
            return;
        }

        $.on(window, 'gamepadconnected', function(e) {
            this.search();
            this.trigger('connected');

            if (!this._rafId) {
                this._rafId = window.requestAnimationFrame(this.checkButtons.bind(this));
            }

        }.bind(this));

        $.on(window, 'gamepaddisconnected', function(e) {
            this.search();
            this.trigger('disconnected');

            if (!this.get().length && this._rafId) {
                window.cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
        }.bind(this));
    },
    pressedBuffer: {},
    checkButtons: function() {
        this.get().forEach(function(pad) {
            var padIndex = pad.index;
            this.pressedBuffer[padIndex] = this.pressedBuffer[padIndex] || {};

            pad.buttons.forEach(function(button, buttonIndex) {
                if (typeof button === 'object') {
                    if (this.pressedBuffer[padIndex][buttonIndex] && !button.pressed) {
                        this.trigger(this.getButtonEventName(buttonIndex));
                        this.trigger(this.getButtonEventName(buttonIndex, pad.index));
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
        x: 0,

        red: 1,
        b: 1,

        yellow: 3,
        a: 3,

        blue: 2,
        x: 2,

        left: 14,
        right: 15,
        up: 12,
        down: 13,

        back: 8,
        start: 9,

        lt: 6,
        lb: 4,

        rt: 7,
        rb: 5
    },
    getButtonId: function(name) {
        return this.buttonName[name];
    },
    getButtonEventName: function(button, gamepadIndex) {
        var index = typeof gamepadIndex === 'undefined' ? '*' : gamepadIndex;
        return 'gamepad:button-' + button + ':index-' + index;
    },
    /*
     * Set a event on a button.
     * @param {number|string} button - button id or name of button ('start', 'yellow')
     * @param {Function} callback
     *
     * @example
     * .onbutton('green:0', function() {}); // gamepad 0, button "green"
     * .onbutton('lb', function() {}); //  button "lb", any gamepad
     */
    onbutton: function(button, callback) {
        var self = this,
            gamepadIndex;

        if (typeof button === 'string') {
            gamepadIndex = button.split(':')[1];

            if (typeof gamepadIndex !== 'undefined') {
                gamepadIndex = +gamepadIndex;
            }
        }

        function setEvent(b) {
            var buttonId = typeof b === 'number' ? b : self.getButtonId(b);
            self.on(self.getButtonEventName(buttonId, gamepadIndex), callback);
        }

        setEvent(button);
    },
    /*
     * Set events on buttons.
     * @param {Array} buttons
     * @param {Function} callback
     *
     * @example
     * .onbuttons(['green:0', 'red:0'], function() {});
     */
    onbuttons: function(buttons, callback) {
        buttons.forEach(function(button) {
            this.onbutton(button, callback);
        }, this);
    },
    _pads: []
};

},{"dom":13,"event":14,"raf":16}],7:[function(require,module,exports){
var $ = require('dom').$,
    lutils = require('level-utils'),
    dtime = require('date-time');

function InfoPanel(container) {
    this._container = container;
    this._elem = $.js2dom(this.build());
    this._container.appendChild(this._elem);
}

InfoPanel.prototype = {
    build: function() {
        return {
            cl: 'info-panel',
            c: [
                {
                    t: 'span',
                    cl: 'info-panel__level-title'
                },
                {
                    cl: 'info-panel__time',
                    t: 'span',
                    c: [
                        'Time: ',
                        {
                            t: 'span',
                            cl: 'info-panel__time-num'
                        }
                    ]
                },
                {
                    cl: 'info-panel__cages',
                    t: 'span',
                    c: [
                        'Time: ',
                        {
                            t: 'span',
                            cl: 'info-panel__cages-num'
                        }
                    ]
                },
                {
                    cl: 'info-panel__clicks',
                    t: 'span',
                    c: [
                        'Clicks: ',
                        {
                            t: 'span',
                            cl: 'info-panel__clicks-num'
                        }
                    ]
                }
            ]
        };
    },
    update: function() {
        this.currentTime = Date.now();

        this.updatePart('clicks-num', this.clicks);
        this.updatePart('cages-num', this.cages);
        this.updatePart('level-title', this.levelTitle);
        this.updatePart('time-num', dtime.formatTime(this.currentTime - this.startTime));
    },
    updatePart: function(name, value) {
        $('.info-panel__' + name, this._elem).innerHTML = value;
    },
    start: function(level, cages) {
        this.stop();

        this.clicks = 0;
        this.cages = cages;
        this.levelTitle = lutils.levelTitle(level);
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
}

module.exports = InfoPanel;

},{"date-time":12,"dom":13,"level-utils":8}],8:[function(require,module,exports){
var levels = require('levels');

module.exports = {
    levelTitle: function(level) {
        var levelObj = levels[level];
        return this.levelSymbol(level) + ' ' + levelObj.name;
    },
    levelSymbol: function(level) {
        var levelObj = levels[level];
        return levelObj.titleSymbol;
    }
};

},{"levels":9}],9:[function(require,module,exports){
module.exports = [
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

},{}],10:[function(require,module,exports){
module.exports = {
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
};

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
module.exports = {
    leadZero: function(num) {
        return num < 10 ? '0' + num : num;
    },
    formatTime: function(ms) {
        var sec = Math.floor(ms / 1000),
            min = Math.floor(sec / 60),
            sec2 = sec - min * 60;

        return min + ':' + this.leadZero(sec2);
    }
};

},{}],13:[function(require,module,exports){
var jstohtml = require('jstohtml');

var $ = function(el, context) {
    if (typeof context === 'string') {
        context = document.querySelector(context);
    }

    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

$.js2dom = function(data) {
    this.js2dom._div.innerHTML = jstohtml(data);
    var result = this.js2dom._div.firstElementChild;
    this.js2dom._div.innerHTML = '';

    return result;
};

$.js2dom._div = document.createElement('div');

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

$.move = function(elem, left, top) {
    $.css(elem, {left: left + 'px', top: top + 'px'});
};

$.size = function(elem, width, height) {
    $.css(elem, {width: width + 'px', height: height + 'px'});
};

$.css = function(el, props) {
    var style = el.style;
    Object.keys(props).forEach(function(key) {
        style[key] = props[key];
    });
};

var $$ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelectorAll(el) : el;
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

module.exports = {
    $: $,
    $$: $$,
    hasSupportCss: hasSupportCss
};

},{"jstohtml":1}],14:[function(require,module,exports){
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

module.exports = Event;


},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
var $ = require('dom').$,
    Page = require('page'),
    Field = require('field');

module.exports = {
    name: 'game',
    locationHash: 'game',
    init: function(data) {
        this._field = new Field({
            elem: $('.field', '.game'),
            cols: 6,
            rows: 5,
            control: '*',
            infoPanel: true
        });

        $.on($('.game__exit', this._elem), 'mousedown', function() {
            Page.show('select-level');
        });
    },
    show: function() {
        this._field.show();
    },
    hide: function() {
        this._field.hide();
    }
};

},{"dom":13,"field":4,"page":20}],18:[function(require,module,exports){
var dom = require('dom'),
    $ = dom.$,
    $$ = dom.$$,
    levels = require('levels'),
    Settings = require('settings'),
    Page = require('page'),
    jstohtml = require('jstohtml');

module.exports = {
    name: 'main',
    locationHash: '',
    init: function() {
        this._bg = $('.main-bg');
        this._bg.innerHTML = this.getBackground();

        this.setEvents();

        this.resizeEmoji();
        this.initLogo();

        return this;
    },
    setEvents: function() {
        $.on(window, 'resize', function() {
            this.resizeEmoji();
        }.bind(this));

        $.on('.main-menu__continue', 'click', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            Page.show('select-level');
        });

        $.on('.main-menu__new-game', 'click', function(e) {
            Settings.set('level', 1);
            Page.show('select-level');
        }.bind(this));

        $.on('.main-menu__multiplayer', 'click', function(e) {
            Page.show('multiplayer');
        }.bind(this));
    },
    initLogo: function() {
        var el  = $('.main-logo');
        setTimeout(function() {
            el.classList.add('main-logo_visible');
        }, 500);
    },
    getBackground: function() {
        var symbols = [];
        levels.forEach(function(level) {
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
        if (Settings.get('level')) {
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

},{"dom":13,"jstohtml":1,"levels":9,"page":20,"settings":10}],19:[function(require,module,exports){
var $ = require('dom').$,
    Field = require('field'),
    Page = require('page');

module.exports = {
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function(data) {
        var context = $('.multiplayer');
        this._fieldOne = new Field({
            elem: $('.field_one', context),
            cols: 6,
            rows: 5,
            control: 'mouse',
            infoPanel: true
        });

        this._fieldTwo = new Field({
            elem: $('.field_two', context),
            cols: 6,
            rows: 5,
            control: 'keyboard',
            infoPanel: true
        });

        $.on($('.multiplayer__exit', this._elem), 'mousedown', function() {
            Page.show('select-level');
        });
    },
    show: function() {
        this._fieldOne.show();
        this._fieldTwo.show();
    },
    hide: function() {
        this._fieldOne.hide();
        this._fieldTwo.hide();
    }
};

},{"dom":13,"field":4,"page":20}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
var $ = require('dom').$,
    jstohtml = require('jstohtml'),
    levels = require('levels'),
    lutils = require('level-utils'),
    Settings = require('settings'),
    Page = require('page');

module.exports = {
    name: 'select-level',
    locationHash: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();
        
        $.on('.select-level__exit', 'click', function() {
            Page.show('main');
        });
        
        $.delegate(el, '.btn', 'click', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            var level = parseInt(e.target.dataset['level']);
            Settings.set('level', level);
            Page.show('game');
        });

        return this;
    },
    getList: function() {
        var html = [],
            maxLevel = Settings.get('maxLevel');

        levels.forEach(function(level, i) {
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
                            c: lutils.levelSymbol(i)
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
};

},{"dom":13,"jstohtml":1,"level-utils":8,"levels":9,"page":20,"settings":10}]},{},[2]);
