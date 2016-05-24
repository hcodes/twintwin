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
    Back = require('back'),
    metrika = require('metrika'),
    body = document.body;

require('array');
require('object');
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

        this._back = new Back(body);
        
        Page.on('show', function(e, page) {
            if (page.name === 'main') {
                this._back.hide();
            } else {
                this._back.show();
            }
        }.bind(this));

        Page.showByLocationHash();
        window.addEventListener('hashchange', function() {
            Page.showByLocationHash();
        }.bind(this), false);
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

    metrika.hit(35250605);
});

},{"array":13,"back":3,"dom":15,"function":17,"game":21,"gamepad":7,"gamepad-notice":6,"main":22,"metrika":10,"multiplayer":23,"object":18,"page":24,"select-level":25}],3:[function(require,module,exports){
var $ = require('dom').$,
    Page = require('page');

function Back(container) {
    this.elem = $.js2dom({
        cl: 'back',
        c: '&times;'
    });

    container.appendChild(this.elem);

    $.on(this.elem, 'click', this.onclick.bind(this));
}

Back.prototype = {
    show: function() {
        this.elem.classList.add('back_visible');
    },
    hide: function() {
        this.elem.classList.remove('back_visible');
    },
    onclick: function() {
        Page.back();
    }
};

module.exports = Back;

},{"dom":15,"page":24}],4:[function(require,module,exports){
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
    reset: function() {
        this.x = 0;
        this.y = 0;

        !this.hidden && this.update();
    },
    destroy: function() {
        this.elem = null;
    }
};

module.exports = FieldCursor;

},{"dom":15}],5:[function(require,module,exports){
var dom = require('dom'),
    $ = dom.$,
    $$ = dom.$$,
    levels = require('levels'),
    Settings = require('settings'),
    FieldCursor = require('field-cursor'),
    InfoPanel = require('info-panel'),
    Gamepad = require('gamepad');

function Field(data) {
    this.elem = data.elem;
    this.cages = $('.field__cages', this.elem);

    this.cols = data.cols;
    this.rows = data.rows;
    this.padding = 5;
    this.levelData = data.levelData;

    this.field = [];

    this.fieldCursor = new FieldCursor({
        elem: $('.field-cursor', this.elem),
        hidden: true,
        cols: this.cols,
        rows: this.rows,
        padding: this.padding
    });

    this.infoPanel = new InfoPanel(this.cages);

    this.setEvents();
    this.setControl(data.control);
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
    setControl: function(type) {
        this.control = type;
        this.elem.dataset.control = type;
    },
    isControl: function(type) {
        return this.control === 'any' || this.control === type;
    },
    setMouseEvents: function() {
        $.delegate(this.cages, '.cage__front', 'mousedown', function(e) {
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

                this.cages.appendChild(cage);
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
        var syms = this.levelData.symbols,
            size = this.cols * this.rows,
            halfSize = size / 2,
            buf = [];

        while (halfSize > buf.length) {
            buf = buf.concat(syms);
        }

        buf = buf.slice(0, halfSize);

        return buf.concat(buf).shuffle();
    },
    getSize: function() {
        var width = Math.floor(this.cages.offsetWidth / this.cols) - this.padding,
            height = Math.floor(this.cages.offsetHeight / this.rows) - this.padding;

        return {
            width: width,
            height: height,
            fontSize: height * 0.8
        };
    },
    findCage: function(x, y) {
        var cages = $$('.cage', this.cages);
        for (var i = 0; i < cages.length; i++) {
            var cage = cages[i];
            var ds = cage.dataset;

            if (String(x) === String(ds.x) && String(y) === String(ds.y)) {
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
                this.cages.removeChild(cage);
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
        Settings.set('maxLevel', Math.max(maxLevel, Settings.get('level') + 1));

        this.infoPanel.stop();
    },
    show: function() {
        this.cages.innerHTML = '';
        this._openedCages = [];

        this.infoPanel.start(this.levelData, this.cols * this.rows);
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

},{"dom":15,"field-cursor":4,"gamepad":7,"info-panel":8,"levels":9,"settings":11}],6:[function(require,module,exports){
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
            this.showConnected();
        }.bind(this));

        Gamepad.on('disconnected', function() {
            this.showDisconnected();
        }.bind(this));

        body.appendChild(this._elemConnected);
        body.appendChild(this._elemDisconnected);
    },
    timeout: 3000,
    showDisconnected: function() {
        var cl = 'gamepad-notice-disconnected_show',
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
    showConnected: function() {
        var cl = 'gamepad-notice-connected_show',
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

},{"dom":15,"gamepad":7}],7:[function(require,module,exports){
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
        a: 0,
        
        red: 1,
        b: 1,

        yellow: 3,
        v: 3,

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

},{"dom":15,"event":16,"raf":19}],8:[function(require,module,exports){
var $ = require('dom').$,
    levels = require('levels'),
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
                        'Cages: ',
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
    start: function(levelData, cages) {
        this.stop();

        this.clicks = 0;
        this.cages = cages;
        this.levelTitle = levels.getTitle(levelData);
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
};

module.exports = InfoPanel;

},{"date-time":14,"dom":15,"levels":9}],9:[function(require,module,exports){
module.exports = {
    getTitle: function(levelData) {
        return levelData.titleSymbol + ' ' + levelData.name;
    },
    getLevel: function(n) {
        return this.data[n];
    },
    getRandomLevel: function() {
        var n = Math.floor(1 + Math.random() * (this.data.length - 1));
        return this.getLevel(n);
    },
    data: [
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
                '🔺',
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
    ]
};

},{}],10:[function(require,module,exports){
// Yandex.Metrika
function prepareParam(value) {
    return window.encodeURIComponent((value || '').substr(0, 512));
};

module.exports = {
    hit: function(id) {
        var pageUrl = prepareParam(window.location.href),
            pageRef = prepareParam(document.referrer);

        new Image().src = 'https://mc.yandex.ru/watch/' + id +
            '?page-url=' + pageUrl +
            '&page-ref=' + pageRef;
    }
};

},{}],11:[function(require,module,exports){
module.exports = {
    set: function(name, value) {
        this._buffer[name] = value;
        this._save();
    },
    get: function(name, defaultValue) {
        if (!this._isLoaded) {
            this._load();
            this._isLoaded = true;
        }

        var value = this._buffer[name];
        return value === undefined ? defaultValue : value;
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

},{}],12:[function(require,module,exports){
var Settings = require('settings'),
    $ = require('dom').$,
    string = require('string');

function UserPanel(container, data) {
    this.container = container;

    this.num = data.num;
    this.settingName = 'player' + data.num;
    this.name = this.getUserName(data.name);
    
    this.init();
}

UserPanel.prototype = {
    init: function() {
        this.elem = $.js2dom({
            cl: 'user-panel',
            c: this.name
        });
        

        this.container.appendChild(this.elem);
        this.setEvents();
    },
    setEvents: function() {
        $.on(this.elem, 'click', this._onclick.bind(this));
    },
    getUserName: function(name) {
        return name || Settings.get(this.settingName, 'Player ' + this.num);
    },
    _onclick: function() {
        var result = window.prompt('Player name:');
        if (result) {
            this.name = this.getUserName(result);
            this.elem.innerHTML = string.escapeHTML(this.name);
            Settings.set(this.settingName, this.name);
        }
    }
};

module.exports = UserPanel;

},{"dom":15,"settings":11,"string":20}],13:[function(require,module,exports){
Array.prototype.shuffle = function() {
    var input = this;
    for (var i = input.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
};

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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
        if (typeof dest[key] === 'undefined') {
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

        if (prop in div.style) {
            return true;
        }

        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });

        while (len--) {
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

},{"jstohtml":1}],16:[function(require,module,exports){
function Event() {}

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

        if (type && callback) {
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

        for (var i = 0; i < buf.length; i++) {
            if (callback === buf[i].callback && type === buf[i].type) {
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

        for (var i = 0; i < buf.length; i++) {
            if (type === buf[i].type) {
                buf[i].callback.call(this, {type: type}, data);
            }
        }

        return this;
    }
};

module.exports = Event;


},{}],17:[function(require,module,exports){
// for iPad 1
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
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

},{}],18:[function(require,module,exports){
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

},{}],19:[function(require,module,exports){
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
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime(),
            timeToCall = Math.max(0, 16 - (currTime - lastTime)),
            id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        window.clearTimeout(id);
    };
}

},{}],20:[function(require,module,exports){
module.exports = {
    escapeHTML: function(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },
    truncate: function(text, len) {
        if(text) {
            return text.length > len ? text.substr(0, len) : text;
        }

        return '';
    }
};

},{}],21:[function(require,module,exports){
var $ = require('dom').$,
    Page = require('page'),
    Settings = require('settings'),
    Field = require('field'),
    levels = require('levels');

module.exports = {
    name: 'game',
    locationHash: 'game',
    init: function(data) {
        this.elem = $('.game');

        this._levelData = levels.getLevel(Settings.get('level'));
        
        this._field = new Field({
            elem: $('.field', this.elem),
            cols: 6,
            rows: 5,
            levelData: this._levelData,
            control: 'any',
            infoPanel: true
        });
        
        this._onKeydown = this._onKeydown.bind(this);
    },
    _onKeydown: function(e) {
        if (e.key === 'Escape') {
            Page.back();
        }
    },
    show: function() {
        $('.level-title', this.elem).innerHTML = levels.getTitle(this._levelData);

        this._field.show();
        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function() {
        this._field.hide();
        $.off(document, 'keydown', this._onKeydown);
    }
};

},{"dom":15,"field":5,"levels":9,"page":24,"settings":11}],22:[function(require,module,exports){
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
        levels.data.forEach(function(level) {
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
            this.setOpacity(function() {
                return 0.1 + Math.random() * 0.4;
            });
        }.bind(this), 1000);
    },
    setOpacity: function(callback) {
        var elems = $$('.main-emoji');

        for (var i = 0; i < elems.length; i++) {
            elems[i].style.opacity = typeof callback === 'function' ? callback() : callback;
        }
    },
    hide: function() {
        this._timer && clearInterval(this._timer);
        this._timer = null;

        this.setOpacity(0);
    }
};

},{"dom":15,"jstohtml":1,"levels":9,"page":24,"settings":11}],23:[function(require,module,exports){
var $ = require('dom').$,
    Field = require('field'),
    UserPanel = require('user-panel'),
    levels = require('levels');

module.exports = {
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function(data) {
        this.elem = $('.multiplayer');
        
        this._levelData = levels.getRandomLevel();
        
        var rows = 5,
            cols = 6;
           
        var fieldOneElem = $('.field_one', this.elem);
        this._fieldOne = new Field({
            elem: fieldOneElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            control: 'keyboard',
            infoPanel: false,
            userPanel: new UserPanel(fieldOneElem, {num: 1})
        });

        var fieldTwoElem = $('.field_two', this.elem);
        this._fieldTwo = new Field({
            elem: fieldTwoElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            control: 'gamepad',
            infoPanel: false,
            userPanel: new UserPanel(fieldTwoElem, {num: 2})
        });

        this._onKeydown = this._onKeydown.bind(this);
    },
    _onKeydown: function(e) {
        if (e.key === 'Escape') {
            this._onExit();
        }
    },
    show: function() {
        $('.level-title', this.elem).innerHTML = levels.getTitle(this._levelData);

        this._fieldOne.show();
        this._fieldTwo.show();

        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function() {
        this._fieldOne.hide();
        this._fieldTwo.hide();

        $.off(document, 'keydown', this._onKeydown);
    }
};

},{"dom":15,"field":5,"levels":9,"user-panel":12}],24:[function(require,module,exports){
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
        
        console.log(name);

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

},{"event":16}],25:[function(require,module,exports){
var $ = require('dom').$,
    jstohtml = require('jstohtml'),
    levels = require('levels'),
    Settings = require('settings'),
    Page = require('page');

module.exports = {
    name: 'select-level',
    locationHash: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();

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

        levels.data.forEach(function(levelData, i) {
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
                            c: levelData.titleSymbol
                        },
                        levelData.name
                    ]
                }
            });
        }, this);

        return jstohtml(html);
    },
    show: function() {},
    hide: function() {}
};

},{"dom":15,"jstohtml":1,"levels":9,"page":24,"settings":11}]},{},[2]);
