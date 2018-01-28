(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var jstohtml = createCommonjsModule(function (module, exports) {
    /*!
     * jstohtml v2.0.0
     * © 2017 Denis Seleznev
     * License: MIT
     *
     * https://github.com/hcodes/jstohtml/
    */

    (function (root, factory) {
        if (typeof undefined === 'function' && undefined.amd) {
            undefined('jstohtml', [], factory);
        } else {
            module.exports = factory();
        }
    })(commonjsGlobal, function () {
        var isArray = Array.isArray,
            toString = Object.prototype.toString,
            entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;'
        },
            escapeRE = /[&<>"'/]/g,
            escapeHtml = function escapeHtml(str) {
            return str.replace(escapeRE, function (s) {
                return entityMap[s];
            });
        };

        var Engine = {
            noClosingTag: ['img', 'input', 'br', 'embed', 'source', 'link', 'meta', 'area', 'command', 'base', 'col', 'param', 'wbr', 'hr', 'keygen'],

            ignoredKeys: ['b', // block
            'e', // element
            'm', // modifier
            'c', // content
            't', // tagName
            'cl', // class
            'class' // class
            ],

            /**
             * Is plain object?
             *
             * @param {*} obj
             * @returns {boolean}
             */
            isPlainObj: function isPlainObj(obj) {
                return toString.call(obj) === '[object Object]';
            },

            /**
             * Build a item.
             *
             * @param {*} data
             * @returns {string}
             */
            build: function build(data) {
                if (data === null || data === undefined) {
                    return '';
                }

                var buf = [];

                if (this.isPlainObj(data)) {
                    return this.tag(data);
                } else if (isArray(data)) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        buf.push(this.build(data[i]));
                    }

                    return buf.join('');
                } else {
                    return '' + data;
                }
            },

            /**
             * Build a tag.
             *
             * @param {*} data
             * @returns {string}
             */
            tag: function tag(data) {
                var t = data.t || 'div',
                    text = '<' + t + this.attrs(data);

                if (this.noClosingTag.indexOf(t) !== -1) {
                    return text + '/>';
                }

                text += '>';

                if (data.c) {
                    text += this.build(data.c);
                }

                text += '</' + t + '>';

                return text;
            },

            /**
             * Build attrs.
             *
             * @param {Object} data
             * @returns {string}
             */
            attrs: function attrs(data) {
                var b = data.b,
                    e = data.e,
                    m = data.m,
                    buf = [],
                    cl = [],
                    result,
                    key;

                if (b || e) {
                    b = b || this._currentBlock;
                    if (e) {
                        buf.push(this.elem(b, e));
                    } else {
                        buf.push(this.block(b));
                    }

                    if (this.isPlainObj(m)) {
                        for (key in m) {
                            if (m.hasOwnProperty(key)) {
                                buf.push(this.elem(b, e, key, m[key]));
                            }
                        }

                        buf.sort();
                        for (var i = 0, len = buf.length; i < len; i++) {
                            if (buf[i] !== buf[i - 1]) {
                                cl.push(buf[i]);
                            }
                        }
                    } else {
                        cl = buf;
                    }

                    result = this.attr('class', cl);
                    this._currentBlock = b;
                } else {
                    cl = data['cl'] || data['class'];
                    result = cl ? this.attr('class', cl) : '';
                }

                for (key in data) {
                    if (data.hasOwnProperty(key) && this.ignoredKeys.indexOf(key) === -1) {
                        result += this.attr(key, data[key]);
                    }
                }

                return result;
            },

            /**
             * Build a attr.
             *
             * @param {string} name
             * @param {*} value
             * @returns {string}
             */
            attr: function attr(name, value) {
                if (value === undefined || value === null || value === false) {
                    return '';
                }

                return ' ' + name + '="' + escapeHtml(isArray(value) ? value.join(' ') : '' + value) + '"';
            },

            /**
             * Build a block.
             *
             * @param {string} block
             * @param {string} [modName]
             * @param {*} [modVal]
             * @returns {string}
             */
            block: function block(_block, modName, modVal) {
                return _block + this.mod(modName, modVal);
            },

            /**
             * Build a elem.
             *
             * @param {string} block
             * @param {string} [elemName]
             * @param {string} [modName]
             * @param {*} [modVal]
             * @returns {string}
             */
            elem: function elem(block, elemName, modName, modVal) {

                return block + (elemName ? '__' + elemName : '') + this.mod(modName, modVal);
            },

            /**
             * Build a mod.
             *
             * @param {string} modName
             * @param {*} [modVal]
             * @returns {string}
             */
            mod: function mod(modName, modVal) {
                if (modVal === false || modVal === null || modVal === undefined) {
                    return '';
                }

                return '_' + modName + (modVal === '' || modVal === true ? '' : '_' + modVal);
            },

            /**
             * Reset inner properties.
             */
            reset: function reset() {
                this._currentBlock = '';
                return this;
            }
        };

        return function (data) {
            return Engine.reset().build(data);
        };
    });
});

var _$ = function _$(el, context) {
    if (typeof context === 'string') {
        context = document.querySelector(context);
    }

    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

function $(el, context) {
    var res = _$(el, context);
    if (!res) {
        console.error('Can\'t find DOM element "' + el + '"', context);
    }

    return res;
}

$.js2dom = function (data) {
    var div = document.createElement('div');
    div.innerHTML = jstohtml(data);

    return div.firstChild;
};

$.on = function (el, type, callback) {
    $(el).addEventListener(type, callback, false);

    return $;
};

$.delegate = function (root, el, type, callback) {
    $(root).addEventListener(type, function (e) {
        var node = e.target;
        for (; node !== root; node = node.parentNode || root) {
            var cls = el[0] === '.' ? el.substr(1) : el;
            if (node.classList.contains(cls)) {
                callback.call(node, e);
            }
        }
    }, false);

    return $;
};

$.off = function (el, type, callback) {
    $(el).removeEventListener(type, callback, false);

    return $;
};

$.move = function (elem, left, top) {
    $.css(elem, { left: left + 'px', top: top + 'px' });
};

$.size = function (elem, width, height) {
    $.css(elem, { width: width + 'px', height: height + 'px' });
};

$.css = function (el, props) {
    var style = el.style;
    Object.keys(props).forEach(function (key) {
        style[key] = props[key];
    });
};

$.show = function (el) {
    $(el).style.display = 'block';
};

$.hide = function (el) {
    $(el).style.display = 'none';
};

$.offset = function (el) {
    var box = { top: 0, left: 0 };

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (el && typeof el.getBoundingClientRect !== 'undefined') {
        box = el.getBoundingClientRect();
    }

    return {
        top: box.top + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
        left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
    };
};

function $$(el, context) {
    return typeof el === 'string' ? (context || document).querySelectorAll(el) : el;
}

var hasSupportCss = function () {
    var div = document.createElement('div'),
        vendors = 'Khtml ms O Moz Webkit'.split(' ');

    var len = vendors.length;

    return function (prop) {
        if (prop in div.style) {
            return true;
        }

        prop = prop.replace(/^[a-z]/, function (val) {
            return val.toUpperCase();
        });

        while (len--) {
            if (vendors[len] + prop in div.style) {
                return true;
            }
        }

        return false;
    };
}();

var ua = navigator.userAgent || navigator.vendor || window.opera;
var re1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
var re2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

var isMobile = re1.test(ua) || re2.test(ua.substr(0, 4));

// Yandex.Metrika
function prepareParam(value) {
    return window.encodeURIComponent((value || '').substr(0, 512));
}

var Metrika = {
    hit: function hit(id) {
        var pageUrl = prepareParam(window.location.href),
            pageRef = prepareParam(document.referrer);

        new Image().src = 'https://mc.yandex.ru/watch/' + id + '?page-url=' + pageUrl + '&page-ref=' + pageRef;
    }
};

Metrika.hit(35250605);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CustomEvent = function () {
    function CustomEvent() {
        _classCallCheck(this, CustomEvent);
    }

    _createClass(CustomEvent, [{
        key: "on",

        /*
         * Attach a handler to an custom event.
         * @param {string} type
         * @param {Function} callback
         * @return {Event} this
        */
        value: function on(type, callback) {
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
        }

        /*
         * Remove a previously-attached custom event handler.
         * @param {string} type
         * @param {Function} callback
         * @return {Event} this
        */

    }, {
        key: "off",
        value: function off(type, callback) {
            var buf = this._eventBuffer || [];

            for (var i = 0; i < buf.length; i++) {
                if (callback === buf[i].callback && type === buf[i].type) {
                    buf.splice(i, 1);
                    i--;
                }
            }

            return this;
        }

        /*
         * Execute all handlers for the given event type.
         * @param {string} type
         * @param {*} [data]
         * @return {Event} this
        */

    }, {
        key: "trigger",
        value: function trigger(type, data) {
            var buf = this._eventBuffer || [];

            for (var i = 0; i < buf.length; i++) {
                if (type === buf[i].type) {
                    buf[i].callback.call(this, { type: type }, data);
                }
            }

            return this;
        }
    }]);

    return CustomEvent;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Back = function () {
    function Back(container) {
        _classCallCheck$1(this, Back);

        this.elem = $.js2dom({
            cl: 'back',
            c: '&times;'
        });

        container.appendChild(this.elem);

        $.on(this.elem, 'click', this.onclick.bind(this));
    }

    _createClass$1(Back, [{
        key: 'show',
        value: function show() {
            this.elem.classList.add('back_visible');
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.elem.classList.remove('back_visible');
        }
    }, {
        key: 'onclick',
        value: function onclick() {
            Page$1.back();
        }
    }]);

    return Back;
}();

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Page = function (_CustomEvent) {
    _inherits(Page, _CustomEvent);

    function Page() {
        _classCallCheck$2(this, Page);

        var _this = _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this));

        _this._current = null;
        _this._buffer = {};

        _this._back = new Back(document.body);

        _this.on('show', function (e, page) {
            if (page.name === 'main') {
                _this._back.hide();
            } else {
                _this._back.show();
            }
        });
        return _this;
    }

    _createClass$2(Page, [{
        key: 'back',
        value: function back() {
            window.history.back();
            this.showByLocationHash();

            return this;
        }
    }, {
        key: 'add',
        value: function add(pages) {
            if (Array.isArray(pages)) {
                pages.forEach(function (page) {
                    this._add(page);
                }, this);
            } else {
                this._add(pages);
            }

            return this;
        }
    }, {
        key: '_add',
        value: function _add(page) {
            this._buffer[page.name] = page;
        }
    }, {
        key: 'get',
        value: function get(name) {
            return this._buffer[name];
        }
    }, {
        key: 'has',
        value: function has(name) {
            return Boolean(this.get(name));
        }
    }, {
        key: 'show',
        value: function show(name, data) {
            var oldName = null;
            var body = document.body;

            if (this._current) {
                oldName = this._current.name;
                if (oldName === name) {
                    return;
                }

                this._current.hide();
                this._current.elem.classList.remove('page_show');
                body.classList.remove('page_' + oldName);
            }

            var page = this.get(name);
            if (!page._isInited) {
                page.elem = $('.page_' + name);
                page.init && page.init();
                page._isInited = true;
            }

            body.classList.add('page_' + name);
            page.elem.classList.add('page_show');
            page.show(data);

            if (page.locationHash !== undefined && window.location.hash !== '#' + page.locationHash) {
                window.location.hash = page.locationHash;
            }

            this._current = page;

            this.trigger('show', page);

            return this;
        }
    }, {
        key: 'hide',
        value: function hide(name) {
            this.get(name).hide();

            return this;
        }
    }, {
        key: 'showByLocationHash',
        value: function showByLocationHash() {
            this.show(this.getNameByLocationHash(window.location.hash));

            return this;
        }
    }, {
        key: 'getNameByLocationHash',
        value: function getNameByLocationHash(hash) {
            var name = void 0;
            hash = (hash || '').replace(/#/, '');

            Object.keys(this._buffer).some(function (key) {
                var page = this._buffer[key];

                if (page.locationHash === hash) {
                    name = page.name;
                    return true;
                }

                return false;
            }, this);

            return name || 'main';
        }
    }]);

    return Page;
}(CustomEvent);

var Page$1 = new Page();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Gamepad = function (_CustomEvent) {
    _inherits$1(Gamepad, _CustomEvent);

    function Gamepad() {
        _classCallCheck$3(this, Gamepad);

        var _this = _possibleConstructorReturn$1(this, (Gamepad.__proto__ || Object.getPrototypeOf(Gamepad)).call(this));

        _this._pressedBuffer = {};
        _this._pads = [];

        // Gamepad: XBox360
        _this.buttonName = {
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
        };

        if (!_this.supported()) {
            return _possibleConstructorReturn$1(_this);
        }

        $.on(window, 'gamepadconnected', function () {
            _this.search();
            _this.trigger('connected');

            if (!_this._rafId) {
                _this._rafId = window.requestAnimationFrame(_this.checkButtons.bind(_this));
            }
        }).on(window, 'gamepaddisconnected', function () {
            _this.search();
            _this.trigger('disconnected');

            if (!_this.get().length && _this._rafId) {
                window.cancelAnimationFrame(_this._rafId);
                _this._rafId = null;
            }
        });
        return _this;
    }

    _createClass$3(Gamepad, [{
        key: 'checkButtons',
        value: function checkButtons() {
            var _this2 = this;

            var list = this.get();

            var _loop = function _loop(i) {
                var pad = list[i];
                if (!pad) {
                    return 'continue';
                }

                var padIndex = pad.index;
                _this2._pressedBuffer[padIndex] = _this2._pressedBuffer[padIndex] || {};

                pad.buttons.forEach(function (button, buttonIndex) {
                    if ((typeof button === 'undefined' ? 'undefined' : _typeof(button)) === 'object') {
                        console.log(this._pressedBuffer[padIndex][buttonIndex], button.pressed);
                        if (this._pressedBuffer[padIndex][buttonIndex] && !button.pressed) {
                            console.log(buttonIndex);
                            this.trigger(this.getButtonEventName(buttonIndex));
                            this.trigger(this.getButtonEventName(buttonIndex, pad.index));
                        }

                        this._pressedBuffer[padIndex][buttonIndex] = button.pressed;
                    }
                }, _this2);
            };

            for (var i = 0; i < list.length; i++) {
                var _ret = _loop(i);

                if (_ret === 'continue') continue;
            }

            this._rafId = window.requestAnimationFrame(this.checkButtons.bind(this));
        }
    }, {
        key: 'supported',
        value: function supported() {
            return typeof navigator.getGamepads === 'function';
        }
    }, {
        key: 'get',
        value: function get() {
            return this._pads;
        }
    }, {
        key: 'item',
        value: function item(num) {
            return this.get()[num];
        }
    }, {
        key: 'count',
        value: function count() {
            return this.get().length;
        }
    }, {
        key: 'search',
        value: function search() {
            this._pads = this.supported() ? navigator.getGamepads() : [];
        }
    }, {
        key: 'getButtonId',
        value: function getButtonId(name) {
            return this.buttonName[name];
        }
    }, {
        key: 'getButtonEventName',
        value: function getButtonEventName(button, gamepadIndex) {
            var index = typeof gamepadIndex === 'undefined' ? '*' : gamepadIndex;
            return 'gamepad:button-' + button + ':index-' + index;
        }

        /*
         * Set a event on a button.
         * @param {number|string} button - button id or name of button ('start', 'yellow')
         * @param {Function} callback
         *
         * @example
         * .onbutton('green:0', function() {}); // gamepad 0, button "green"
         * .onbutton('lb', function() {}); //  button "lb", any gamepad
         */

    }, {
        key: 'onbutton',
        value: function onbutton(button, callback) {
            var self = this;
            var gamepadIndex = void 0;

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

            return this;
        }

        /*
         * Set events on buttons.
         * @param {Array} buttons
         * @param {Function} callback
         *
         * @example
         * .onbuttons(['green:0', 'red:0'], function() {});
         */

    }, {
        key: 'onbuttons',
        value: function onbuttons(buttons, callback) {
            buttons.forEach(function (button) {
                this.onbutton(button, callback);
            }, this);

            return this;
        }
    }]);

    return Gamepad;
}(CustomEvent);

var Gamepad$1 = new Gamepad();

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GamepadNotice = function () {
    function GamepadNotice() {
        _classCallCheck$4(this, GamepadNotice);

        this.build();
        this.setEvents();

        this.timeout = 3000;
    }

    _createClass$4(GamepadNotice, [{
        key: 'build',
        value: function build() {
            this._elemConnected = $.js2dom({
                cl: 'gamepad-notice-connected',
                c: ['✔ 🎮', {
                    cl: 'gamepad-notice-connected__num'
                }]
            });

            this._elemDisconnected = $.js2dom({
                cl: 'gamepad-notice-disconnected',
                c: ['✖ 🎮', {
                    cl: 'gamepad-notice-disconnected__num'
                }]
            });
        }
    }, {
        key: 'setEvents',
        value: function setEvents() {
            Gamepad$1.on('connected', this.showConnected.bind(this)).on('disconnected', this.showDisconnected.bind(this));

            document.body.appendChild(this._elemConnected);
            document.body.appendChild(this._elemDisconnected);
        }
    }, {
        key: 'showDisconnected',
        value: function showDisconnected() {
            var _this = this;

            var cl = 'gamepad-notice-disconnected_show',
                el = this._elemDisconnected;

            el.classList.add(cl);

            if (this._disTimer) {
                clearTimeout(this._disTimer);
                this._disTimer = null;
            }

            this._disTimer = setTimeout(function () {
                el.classList.remove(cl);
                _this._disTimer = null;
            }, this.timeout);
        }
    }, {
        key: 'showConnected',
        value: function showConnected() {
            var _this2 = this;

            var cl = 'gamepad-notice-connected_show',
                el = this._elemConnected;

            el.classList.add(cl);

            if (this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }

            this._timer = setTimeout(function () {
                el.classList.remove(cl);
                _this2._timer = null;
            }, this.timeout);
        }
    }]);

    return GamepadNotice;
}();

new GamepadNotice();

var Settings = {
    set: function set(name, value) {
        this._buffer[name] = this._copy(value);
        this._save();
    },
    get: function get(name, defaultValue) {
        if (!this._isLoaded) {
            this._load();
            this._isLoaded = true;
        }

        var value = this._buffer[name];
        return value === undefined ? defaultValue : value;
    },

    lsName: 'twintwin',
    _buffer: {},
    _load: function _load() {
        var buffer = {};
        try {
            buffer = JSON.parse(localStorage.getItem(this.lsName)) || {};
        } catch (e) {
            console.log('Settings from localStorage: parse error.');
        }

        buffer.level = buffer.level || 1;
        buffer.maxLevel = buffer.maxLevel || 1;
        this._buffer = buffer;
    },
    _save: function _save() {
        try {
            localStorage.setItem(this.lsName, JSON.stringify(this._buffer));
        } catch (e) {
            console.log('localStorage.setItem error.');
        }
    },
    _copy: function _copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldCursor = function () {
    function FieldCursor(data) {
        _classCallCheck$5(this, FieldCursor);

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

    _createClass$5(FieldCursor, [{
        key: 'hide',
        value: function hide() {
            if (this.hidden !== true) {
                this.hidden = true;
                this.elem.classList.add('field-cursor_hidden');
            }
        }
    }, {
        key: 'show',
        value: function show() {
            if (this.hidden !== false) {
                this.hidden = false;
                this.elem.classList.remove('field-cursor_hidden');
                this.update();
            }
        }
    }, {
        key: 'update',
        value: function update() {
            this.size(this.width, this.height, this.padding);
        }
    }, {
        key: 'size',
        value: function size(width, height, padding) {
            this.width = width;
            this.height = height;
            this.padding = padding;

            $.size(this.elem, width, height);

            this.move(this.x, this.y);
        }
    }, {
        key: 'move',
        value: function move(kx, ky) {
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

            $.move(this.elem, x * (this.width + this.padding), y * (this.height + this.padding));
        }
    }, {
        key: 'left',
        value: function left() {
            this.show();
            this.move(-1, 0);
        }
    }, {
        key: 'right',
        value: function right() {
            this.show();
            this.move(1, 0);
        }
    }, {
        key: 'up',
        value: function up() {
            this.show();
            this.move(0, -1);
        }
    }, {
        key: 'down',
        value: function down() {
            this.show();
            this.move(0, 1);
        }
    }, {
        key: 'getXY',
        value: function getXY() {
            return {
                x: this.x,
                y: this.y
            };
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.x = 0;
            this.y = 0;

            !this.hidden && this.update();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.elem = null;
        }
    }]);

    return FieldCursor;
}();

function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

function formatTime(ms) {
    var sec = Math.floor(ms / 1000),
        min = Math.floor(sec / 60),
        sec2 = sec - min * 60;

    return min + ':' + leadZero(sec2);
}

var Levels = {
    defaultRows: 5,
    defaultCols: 6,
    getTitle: function getTitle(levelData) {
        return levelData.titleSymbol + ' ' + levelData.name;
    },
    getLevel: function getLevel(n) {
        return this.data[n];
    },
    getRandomLevel: function getRandomLevel() {
        var num = Math.floor(1 + Math.random() * (this.data.length - 1));
        return this.getLevel(num);
    },

    data: [{
        name: '',
        symbols: []
    }, {
        name: 'Headwear',
        titleSymbol: '👒',
        cols: 2,
        rows: 2,
        symbols: ['👑', '👒', '🎩', '🎓']
    }, {
        name: 'Shoes',
        titleSymbol: '👠',
        cols: 3,
        rows: 2,
        symbols: ['👟', '👞', '👡', '👠', '👢']
    }, {
        name: 'Accessories',
        titleSymbol: '👛',
        cols: 4,
        rows: 3,
        symbols: ['👑', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄']
    }, {
        name: 'Numerals',
        titleSymbol: '3',
        cols: 4,
        rows: 3,
        symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    }, {
        name: 'Vegetables',
        titleSymbol: '🥕',
        cols: 4,
        rows: 4,
        symbols: ['🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🌰']
    }, {
        name: 'Trains',
        titleSymbol: '🚄',
        cols: 4,
        rows: 4,
        symbols: ['🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃']
    }, {
        name: 'Drinks',
        titleSymbol: '🍷',
        cols: 5,
        rows: 4,
        symbols: ['🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂']
    }, {
        name: 'Fruits',
        titleSymbol: '🍏',
        cols: 5,
        rows: 4,
        symbols: ['🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝']
    }, {
        name: 'Flowers and trees',
        titleSymbol: '💐',
        cols: 6,
        rows: 4,
        symbols: ['💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', '🍃', '🍂', '🌿', '🌾', '🌵', '🌴', '🌲', '🌳', '🌰', '🌼', '💮']
    }, {
        name: 'Zodiac Signs',
        titleSymbol: '♋',
        cols: 6,
        rows: 4,
        symbols: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎']
    }, {
        name: 'Sweets',
        titleSymbol: '♋',
        cols: 6,
        rows: 4,
        symbols: ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🍫', '🍬', '🍭', '🍮', '🍯']
    }, {
        name: 'Fashion',
        titleSymbol: '👗',
        symbols: ['🎩', '👒', '👢', '👕', '👔', '👚', '👗', '🎽', '👖', '👘', '👙']
    }, {
        name: 'Buildings',
        titleSymbol: '🏢',
        symbols: ['🏠', '🏡', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆', '🏯', '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢']
    }, {
        name: 'People',
        titleSymbol: '👨',
        symbols: ['👦', '👧', '👨', '👩', '👴', '👵', '👶', '👼', '🎅', '🤶', '👸', '🤴', '👰', '🤵', '🤰', '👲', '🙍', '💃', '🕺', '👪']
    }, {
        name: 'Currency',
        titleSymbol: '€',
        bg: false,
        symbols: ['₳', '฿', '₡', '₢', '€', '£', '₤', '₣', 'ƒ', '₲', '₭', 'Ł', '₥', '₦', '₽', '₱', '$', '₮', '₩', '￦', '¥', '¤']
    }, {
        name: 'Roman numbers',
        titleSymbol: 'Ⅸ',
        bg: false,
        symbols: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ', 'Ⅼ', 'Ⅽ', 'Ⅾ', 'Ⅿ', 'ↀ', 'ↁ', 'ↂ', 'ↇ', 'ↈ']
    }, {
        name: 'Hand Signs',
        titleSymbol: '👌',
        bg: false,
        symbols: ['👍', '👎', '👌', '👊', '✊', '✌', '👋', '✋', '👐', '👆', '👇', '👉', '👈', '🙌', '🙏', '☝', '👏', '💪']
    }, {
        name: 'Arrows',
        titleSymbol: '↗',
        bg: false,
        symbols: ['⬇', '⬅', '➡', '↗', '↖', '↘', '↙', '↔', '↕', '🔄', '◀', '▶', '🔼', '🔽', '↩', '↪', '⏪', '⏩', '⏫', '⏬', '⤵', '⤴', '🔀', '🔃', '🔺', '🔻', '⬆']
    }, {
        name: 'Food',
        titleSymbol: '🍞',
        symbols: ['🍞', '🥐', '🥖', '🥞', '🧀', '🍖', '🍗', '🥓', '🍔', '🍟', '🍕', '🌭', '🌮', '🌯', '🍳', '🍲', '🥗', '🍿', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡']
    }, {
        name: 'Stars',
        titleSymbol: '✯',
        bg: false,
        symbols: ['★', '☆', '✪', '✯', '✡', '✵', '❉', '❋', '✹', '✸', '✶', '✷', '✵', '✳', '✲', '✱', '✧', '✦', '⍟', '⊛', '🔯', '🌠', '🌟', '﹡', '❃', '❂', '✻', '⍣', '✭', '≛', '*', '٭']
    }, {
        name: 'Technology',
        titleSymbol: '📀',
        symbols: ['🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻', '📱', '☎', '📞', '📟', '📠', '📡', '📺', '📻']
    }, {
        name: 'Sport',
        titleSymbol: '🏀',
        symbols: ['🎯', '🏈', '🏀', '⚽', '⚾', '🎾', '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣']
    }, {
        name: 'Games and Hobbies',
        titleSymbol: '🎨',
        symbols: ['🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲']
    }]
};

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InfoPanel = function () {
    function InfoPanel(container) {
        _classCallCheck$6(this, InfoPanel);

        this.container = container;
        this.elem = $.js2dom(this.build());
        this.container.appendChild(this.elem);
    }

    _createClass$6(InfoPanel, [{
        key: 'build',
        value: function build() {
            return {
                cl: 'info-panel',
                c: [{
                    cl: 'info-panel__time',
                    t: 'span',
                    c: ['Time: ', {
                        t: 'span',
                        cl: 'info-panel__time-num'
                    }]
                }, {
                    cl: 'info-panel__errors',
                    t: 'span',
                    c: ['Errors: ', {
                        t: 'span',
                        cl: 'info-panel__errors-num'
                    }]
                }]
            };
        }
    }, {
        key: 'update',
        value: function update() {
            this.currentTime = Date.now();

            this.updatePart('errors-num', this.errors);
            this.updatePart('time-num', formatTime(this.currentTime - this.startTime));
        }
    }, {
        key: 'updatePart',
        value: function updatePart(name, value) {
            $('.info-panel__' + name, this.elem).innerHTML = value;
        }
    }, {
        key: 'start',
        value: function start(levelData) {
            this.stop();

            this.errors = 0;
            this.levelTitle = Levels.getTitle(levelData);
            this.startTime = Date.now();

            this.update();
            this._timer = setInterval(this.update.bind(this), 500);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this._timer && clearInterval(this._timer);
            this._timer = null;
        }
    }]);

    return InfoPanel;
}();

function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1)),
            itemAtIndex = arr[randomIndex];

        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }

    return arr;
}

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = function () {
    function Field(data) {
        _classCallCheck$7(this, Field);

        this.elem = data.elem;
        this.cages = $('.field__cages', this.elem);

        this.padding = 5;
        this.levelData = data.levelData;

        this.rows = data.rows;
        this.cols = data.cols;

        this.field = [];
        this.cagesCount = this.cols * this.rows;

        this.fieldCursor = new FieldCursor({
            elem: $('.field-cursor', this.elem),
            hidden: true,
            cols: this.cols,
            rows: this.rows,
            padding: this.padding
        });

        this.infoPanel = new InfoPanel(this.elem);

        this.setEvents();
        this.setControl(data.control);
    }

    _createClass$7(Field, [{
        key: 'setEvents',
        value: function setEvents() {
            this.setKeyboardEvents();
            this.setMouseEvents();
            this.setGamepadEvents();

            $.on(window, 'resize', function () {
                if (!this.isHidden) {
                    this.resizeCages();
                }
            }.bind(this));
        }
    }, {
        key: 'setControl',
        value: function setControl(type) {
            this.control = type;
            this.elem.dataset.control = type;
        }
    }, {
        key: 'isControl',
        value: function isControl(type) {
            return this.control === 'any' || this.control === type;
        }
    }, {
        key: 'setMouseEvents',
        value: function setMouseEvents() {
            var _this = this;

            $.delegate(this.cages, '.cage__front', 'mousedown', function (e) {
                if (!_this.isControl('mouse')) {
                    return;
                }

                _this.fieldCursor.hide();

                var cage = e.target.parentNode,
                    ds = cage.dataset;

                _this.openCage(ds.x, ds.y);
            });
        }
    }, {
        key: 'setKeyboardEvents',
        value: function setKeyboardEvents() {
            var _this2 = this;

            $.on(document, 'keydown', function (e) {
                if (_this2.isControl('keyboard1')) {
                    switch (e.key) {
                        case 'ArrowUp':
                            _this2.fieldCursor.up();
                            break;
                        case 'ArrowLeft':
                            _this2.fieldCursor.left();
                            break;
                        case 'ArrowRight':
                            _this2.fieldCursor.right();
                            break;
                        case 'ArrowDown':
                            _this2.fieldCursor.down();
                            break;
                        case 'Enter':
                            _this2.openCageWithCursor();
                            break;
                    }
                }

                if (_this2.isControl('keyboard2')) {
                    switch (e.key) {
                        case 'W':
                            _this2.fieldCursor.up();
                            break;
                        case 'A':
                            _this2.fieldCursor.left();
                            break;
                        case 'D':
                            _this2.fieldCursor.right();
                            break;
                        case 'S':
                            _this2.fieldCursor.down();
                            break;
                        case ' ':
                    }
                }
            });
        }
    }, {
        key: 'setGamepadEvents',
        value: function setGamepadEvents() {
            var _this3 = this;

            Gamepad$1.onbutton('left', function () {
                if (_this3.isControl('gamepad')) {
                    _this3.fieldCursor.left();
                }
            }).onbutton('right', function () {
                if (_this3.isControl('gamepad')) {
                    _this3.fieldCursor.right();
                }
            }).onbutton('up', function () {
                if (_this3.isControl('gamepad')) {
                    _this3.fieldCursor.up();
                }
            }).onbutton('down', function () {
                if (_this3.isControl('gamepad')) {
                    _this3.fieldCursor.down();
                }
            }).onbuttons(['yellow', 'blue', 'green'], function () {
                if (this.isControl('gamepad')) {
                    this.openCageWithCursor();
                }
            }.bind(this));
        }
    }, {
        key: 'createCages',
        value: function createCages() {
            this.cages.innerHTML = '';

            for (var x = 0; x < this.cols; x++) {
                for (var y = 0; y < this.rows; y++) {
                    var cage = $.js2dom({
                        cl: 'cage',
                        'data-x': x,
                        'data-y': y,
                        c: [{ cl: 'cage__front' }, { cl: 'cage__back emoji' }]
                    });

                    this.cages.appendChild(cage);
                }
            }
        }
    }, {
        key: 'resizeCages',
        value: function resizeCages() {
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
        }
    }, {
        key: 'getLevelSymbols',
        value: function getLevelSymbols() {
            var syms = this.levelData.symbols,
                size = this.cols * this.rows,
                halfSize = size / 2;

            var buf = [];

            while (halfSize > buf.length) {
                buf = buf.concat(syms);
            }

            buf = buf.slice(0, halfSize);

            return shuffle(buf.concat(buf));
        }
    }, {
        key: 'getSize',
        value: function getSize() {
            var width = Math.floor(this.cages.offsetWidth / this.cols) - this.padding,
                height = Math.floor(this.cages.offsetHeight / this.rows) - this.padding;

            return {
                width: width,
                height: height,
                fontSize: Math.min(width, height) * 0.7
            };
        }
    }, {
        key: 'findCage',
        value: function findCage(x, y) {
            var cages = $$('.cage', this.cages);
            for (var i = 0; i < cages.length; i++) {
                var cage = cages[i];
                var ds = cage.dataset;

                if (String(x) === String(ds.x) && String(y) === String(ds.y)) {
                    return cage;
                }
            }

            return null;
        }
    }, {
        key: 'openCageWithCursor',
        value: function openCageWithCursor() {
            var xy = this.fieldCursor.getXY();
            this.openCage(xy.x, xy.y);
        }
    }, {
        key: 'openCage',
        value: function openCage(x, y) {
            var cage = this.findCage(x, y),
                len = this._openedCages.length,
                xy = { x: x, y: y };

            if (!cage || cage.classList.contains('cage_opened')) {
                return;
            }

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
                        this.infoPanel.errors++;

                        var openedCages = [xy].concat(this._openedCages);
                        this._openedCages = [];
                        setTimeout(function () {
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

            this.infoPanel.update();
            xy && this._openedCages.push(xy);
        }
    }, {
        key: 'closeOpenedCages',
        value: function closeOpenedCages(openedCages) {
            (openedCages || this._openedCages).forEach(function (cage) {
                this.closeCage(cage.x, cage.y);
            }, this);
        }
    }, {
        key: 'removeOpenedCages',
        value: function removeOpenedCages() {
            this._openedCages.forEach(function (cage) {
                this.removeCage(cage.x, cage.y);
            }, this);

            this._openedCages = [];
        }
    }, {
        key: 'removeCage',
        value: function removeCage(x, y) {
            var _this4 = this;

            var cage = this.findCage(x, y);
            if (cage) {
                cage.classList.add('cage_removed');
                this.cagesCount--;
                this.infoPanel.update();

                setTimeout(function () {
                    _this4.cages.removeChild(cage);
                }, 200);

                if (!this.cagesCount) {
                    this.infoPanel.stop();
                    this.onFinish();
                }
            }
        }
    }, {
        key: 'closeCage',
        value: function closeCage(x, y) {
            var cage = this.findCage(x, y);
            if (cage) {
                cage.classList.remove('cage_opened');
                $('.cage__back', cage).innerHTML = '';
            }
        }
    }, {
        key: 'initField',
        value: function initField() {
            var syms = this.getLevelSymbols();
            var s = 0;

            this.field = [];
            for (var y = 0; y < this.rows; y++) {
                var buf = [];
                for (var x = 0; x < this.cols; x++) {
                    buf.push(syms[s]);
                    s++;
                }

                this.field[y] = buf;
            }
        }
    }, {
        key: 'show',
        value: function show(data) {
            this.field = [];

            this.levelData = data.levelData;
            this.cols = data.cols;
            this.rows = data.rows;

            this.cagesCount = this.cols * this.rows;

            this.initField();
            this.createCages();
            this.resizeCages();

            this._openedCages = [];

            this.infoPanel.start(this.levelData);

            this.fieldCursor.cols = this.cols;
            this.fieldCursor.rows = this.rows;
            this.fieldCursor.reset();

            /*for (var y = 0; y < this.rows; y++) {
                for (var x = 0; x < this.cols; x++) {
                    this.openCage(x, y);
                }
            }*/

            this.isHidden = false;
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.isHidden = true;
            this.infoPanel.stop();
        }
    }]);

    return Field;
}();

function format(num, separator) {
    separator = separator || '\u202F';

    num = num.toString().split('').reverse().join('').replace(/(\d{3})/g, '$1' + separator).split('').reverse().join('');

    return num[0] == separator ? num.substr(1) : num;
}

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EmptyComponent = function (_CustomEvent) {
    _inherits$2(EmptyComponent, _CustomEvent);

    function EmptyComponent() {
        _classCallCheck$8(this, EmptyComponent);

        return _possibleConstructorReturn$2(this, (EmptyComponent.__proto__ || Object.getPrototypeOf(EmptyComponent)).call(this));
    }

    return EmptyComponent;
}(CustomEvent);

var Component = {
    create: function create(obj) {
        var emptyComponentObj = new EmptyComponent();

        Object.assign(emptyComponentObj, {
            domEvents: [],
            setDomEvents: function setDomEvents(events) {
                events.forEach(function (item) {
                    $.on.apply($, item);
                }, this);

                this.domEvents = this.domEvents.concat(events);
            },
            removeDomEvents: function removeDomEvents() {
                this.domEvents.forEach(function (item) {
                    $.off.apply($, item);
                });

                this.domEvents = [];
            }
        });

        Object.assign(emptyComponentObj, obj);

        emptyComponentObj.init && emptyComponentObj.init();

        return emptyComponentObj;
    }
};

var gameOver = Component.create({
    init: function init() {
        var _this = this;

        this.setDomEvents([['.game-over__restart', 'click', function () {
            _this.trigger('click', 'restart');
        }], ['.game-over__next', 'click', function () {
            _this.trigger('click', 'next');
        }]]);
    },
    updateScore: function updateScore(value) {
        $('.game-over__score-i').innerHTML = format(value);
    },
    show: function show(data) {
        $.show('.game-over');
        this.calcScore(data);
    },
    hide: function hide() {
        $.hide('.game-over');
    },
    calcScore: function calcScore(data) {
        var _this2 = this;

        var value = Math.floor(1e6 / data.errors / Math.log(data.time + 3));

        var _loop = function _loop(i) {
            var score = Math.floor(value * i / 10);
            setTimeout(function () {
                _this2.updateScore(score);
            }, i * 100);
        };

        for (var i = 0; i < 10; i++) {
            _loop(i);
        }
    }
});

var GamePage = {
    name: 'game',
    locationHash: 'game',
    init: function init() {
        var _this = this;

        this.el = $('.game');

        var levelData = this.getLevelData();

        this._field = new Field({
            elem: $('.field', this.el),
            rows: levelData.rows,
            cols: levelData.cols,
            levelData: levelData.data,
            control: 'any',
            infoPanel: true
        });

        this._onKeydown = this._onKeydown.bind(this);

        this._field.onFinish = function () {
            var maxLevel = Settings.get('maxLevel');
            Settings.set('maxLevel', Math.max(maxLevel, Settings.get('level') + 1));

            var panel = this.infoPanel;
            gameOver.show({
                errors: panel.errors || 1,
                time: Math.floor((Date.now() - panel.startTime) / 1000) || 1
            });
        };

        gameOver.on('click', function (e, button) {
            switch (button) {
                case 'menu':
                    Page$1.show('main');
                    break;
                case 'next':
                    _this.nextLevel();
                    break;
                case 'restart':
                    _this.restart();
                    break;
            }
        });
    },
    getLevelData: function getLevelData() {
        var data = Levels.getLevel(Settings.get('level'));

        return {
            data: data,
            rows: data.rows || Levels.defaultRows,
            cols: data.cols || Levels.defaultCols
        };
    },
    _onKeydown: function _onKeydown(e) {
        if (e.key === 'Escape') {
            Page$1.back();
        }
    },
    restart: function restart() {
        this.hide();
        this.show();
    },
    nextLevel: function nextLevel() {
        Settings.set('level', Settings.get('level') + 1);

        this.hide();
        this.show();
    },
    show: function show() {
        var levelData = this.getLevelData();

        gameOver.hide();

        this._field.show({
            levelData: levelData.data,
            cols: levelData.cols,
            rows: levelData.rows
        });

        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function hide() {
        this._field.hide();
        $.off(document, 'keydown', this._onKeydown);
    }
};

var _createClass$8 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MainBg = function () {
    function MainBg() {
        _classCallCheck$9(this, MainBg);

        this.elem = $('.main-bg');
        this.elem.innerHTML = this.getBackground();

        this.resize();
    }

    _createClass$8(MainBg, [{
        key: 'getBackground',
        value: function getBackground() {
            var symbols = [];
            Levels.data.forEach(function (level) {
                if (level.bg !== false) {
                    symbols = symbols.concat(level.symbols);
                }
            });

            shuffle(symbols);

            return jstohtml(symbols.map(function (sym) {
                return {
                    cl: ['main-emoji', 'emoji'],
                    c: sym
                };
            }));
        }
    }, {
        key: 'resize',
        value: function resize() {
            var width = Math.floor(document.documentElement.clientWidth / 12),
                bgStyle = this.elem.style;

            bgStyle.fontSize = width + 'px';
            bgStyle.lineHeight = width + 'px';
        }
    }, {
        key: 'setOpacity',
        value: function setOpacity(callback) {
            var elems = $$('.main-emoji', this.elem);

            for (var i = 0; i < elems.length; i++) {
                elems[i].style.opacity = typeof callback === 'function' ? callback() : callback;
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.elem) {
                this.elem.innerHTML = '';
                delete this.elem;
            }
        }
    }]);

    return MainBg;
}();

var elem = $('.main-logo');

setTimeout(function () {
    elem.classList.add('main-logo_visible');
}, 1000);

var MainPage = {
    name: 'main',
    locationHash: '',
    init: function init() {
        this._mainBg = new MainBg();

        this.setEvents();
    },
    setEvents: function setEvents() {
        var _this = this;

        $.on(window, 'resize', function () {
            _this._mainBg.resize();
        }).on('.main-menu__continue', 'click', function () {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            Page$1.show('select-level');
        }).on('.main-menu__new-game', 'click', function () {
            Settings.set('maxLevel', 1);
            Page$1.show('select-level');
        }).on('.main-menu__multiplayer', 'click', function () {
            Page$1.show('multiplayer');
        });
    },
    show: function show() {
        var _this2 = this;

        var cont = $('.main-menu__continue');
        if (Settings.get('level')) {
            cont.classList.remove('btn_disabled');
        } else {
            cont.classList.add('btn_disabled');
        }

        this._timer = setInterval(function () {
            _this2._mainBg.setOpacity(function () {
                return 0.1 + Math.random() * 0.4;
            });
        }, 1000);
    },
    hide: function hide() {
        this._timer && clearInterval(this._timer);
        this._timer = null;

        this._mainBg.setOpacity(0);
    }
};

var SelectControls = Component.create({
    init: function init() {
        this.values = [];

        var defaultValues = ['mouse', 'keyboard1', 'keyboard2', 'gamepad1'].map(function (val, i) {
            var control = Settings.get('control' + i);
            return this.getIndex(control) === -1 ? val : control;
        }, this);

        var events = [];

        this.elems = Array.from($$('.select-controls'));
        this.elems.forEach(function (el, i) {
            var value = defaultValues[i];

            this.values.push(value);

            this.updateElem(i);

            events.push([el, 'click', function () {
                this.selectNext(i);
            }.bind(this)]);
        }, this);

        this.setDomEvents(events);
    },
    getPlayerControl: function getPlayerControl(playerNum) {
        return this.values[playerNum];
    },
    selectNext: function selectNext(playerNum) {
        var currentIndex = this.getIndex(this.values[playerNum]);
        var index = currentIndex;
        while (this.values.indexOf(this.controls[index].value) !== -1) {
            index++;
            if (index >= this.controls.length - 1) {
                index = 0;
            }
        }

        var value = this.controls[index].value;
        this.values[playerNum] = value;
        Settings.set('control' + playerNum, value);

        this.trigger('change', {
            playerNum: playerNum,
            control: value
        });

        this.updateElem(playerNum);
    },
    updateElem: function updateElem(playerNum) {
        var controlInfo = this.controls[this.getIndex(this.values[playerNum])];
        var elem = this.elems[playerNum];

        elem.innerHTML = controlInfo.text;
        elem.title = controlInfo.title;
    },
    getIndex: function getIndex(value) {
        var index = -1;

        this.controls.some(function (item, i) {
            if (item.value === value) {
                index = i;
                return true;
            }

            return false;
        });

        return index;
    },

    controls: [{
        value: 'keyboard1',
        text: '⌨ 1',
        title: 'Keyboard: Cursors + Enter'
    }, {
        value: 'keyboard2',
        text: '⌨ 2',
        title: 'Keyboard: W, A, D, S + Space'
    }, {
        value: 'mouse',
        text: '🖱',
        title: 'Mouse'
    }, {
        value: 'touch',
        text: '🤚',
        title: 'Touch'
    }, {
        value: 'gamepad1',
        text: '🎮 1',
        title: 'Gamepad 1'
    }, {
        value: 'gamepad2',
        text: '🎮 2',
        title: 'Gamepad 2'
    }, {
        value: 'gamepad3',
        text: '🎮 3',
        title: 'Gamepad 3'
    }, {
        value: 'gamepad4',
        text: '🎮 4',
        title: 'Gamepad 4'
    }]
});

function escapeHTML(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

var _createClass$9 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$10(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserPanel = function () {
    function UserPanel(container, data) {
        _classCallCheck$10(this, UserPanel);

        this.container = container;

        this.num = data.num;
        this.settingName = 'player' + data.num;
        this.name = this.getUserName(data.name);

        this.init();
    }

    _createClass$9(UserPanel, [{
        key: 'init',
        value: function init() {
            this.elem = $.js2dom({
                cl: 'user-panel',
                c: this.name
            });

            this.container.appendChild(this.elem);
            this.setEvents();
        }
    }, {
        key: 'setEvents',
        value: function setEvents() {
            $.on(this.elem, 'click', this._onclick.bind(this));
        }
    }, {
        key: 'getUserName',
        value: function getUserName(name) {
            return name || Settings.get(this.settingName, 'Player ' + this.num);
        }
    }, {
        key: '_onclick',
        value: function _onclick() {
            var result = window.prompt('Player name:');
            if (result) {
                this.name = this.getUserName(result);
                this.elem.innerHTML = escapeHTML(this.name);
                Settings.set(this.settingName, this.name);
            }
        }
    }]);

    return UserPanel;
}();

var MultiplayerPage = {
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function init() {
        var _this = this;

        this.el = $('.multiplayer');

        this._levelData = Levels.getRandomLevel();

        var rows = 5;
        var cols = 6;

        var fieldOneElem = $('.field_one', this.el);
        this._fieldOne = new Field({
            elem: fieldOneElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            //control: isMobile ? '*' : 'keyboard',
            control: SelectControls.getPlayerControl(0),
            userPanel: new UserPanel(fieldOneElem, { num: 1 })
        });

        var fieldTwoElem = $('.field_two', this.el);
        this._fieldTwo = new Field({
            elem: fieldTwoElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            control: SelectControls.getPlayerControl(1),
            userPanel: new UserPanel(fieldTwoElem, { num: 2 })
        });

        this._onKeydown = this._onKeydown.bind(this);

        SelectControls.on('change', function (e, data) {
            if (data.playerNum === 0) {
                _this._fieldOne.setControl(data.control);
            }

            if (data.playerNum === 1) {
                _this._fieldTwo.setControl(data.control);
            }
        });
    },
    _onKeydown: function _onKeydown(e) {
        if (e.key === 'Escape') {
            this._onExit();
        }
    },
    getLevelData: function getLevelData() {
        var data = Levels.getLevel(Settings.get('level'));

        return {
            data: data,
            rows: data.rows || Levels.defaultRows,
            cols: data.cols || Levels.defaultCols
        };
    },
    show: function show() {
        var levelData = this.getLevelData(),
            data = {
            levelData: levelData.data,
            cols: levelData.cols,
            rows: levelData.rows
        };

        this._fieldOne.show(data);
        this._fieldTwo.show(data);

        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function hide() {
        this._fieldOne.hide();
        this._fieldTwo.hide();

        $.off(document, 'keydown', this._onKeydown);
    }
};

var _createClass$10 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$11(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SelectLevel = function () {
    function SelectLevel() {
        var _this = this;

        _classCallCheck$11(this, SelectLevel);

        this.elem = $('.select-level__list', this.elem);
        this.elem.innerHTML = this.getList();

        $.delegate(this.elem, '.btn', 'click', function () {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            var level = parseInt(this.dataset['level'], 10);
            Settings.set('level', level);
            Page$1.show('game');
        });

        Page$1.on('show', function (e, p) {
            if (p.name === 'select-level') {
                _this.update();
            }
        });
    }

    _createClass$10(SelectLevel, [{
        key: 'getList',
        value: function getList() {
            var html = [],
                maxLevel = Settings.get('maxLevel');

            Levels.data.forEach(function (levelData, i) {
                if (!levelData.name) {
                    return;
                }

                html.push({
                    t: 'li',
                    cl: 'select-level__item',
                    c: {
                        t: 'span',
                        cl: ['btn btn_red btn_middle' + (i <= maxLevel ? '' : ' btn_disabled')],
                        'data-level': i,
                        c: [{
                            t: 'span',
                            cl: 'select-level__emoji emoji',
                            c: levelData.titleSymbol
                        }, levelData.name]
                    }
                });
            });

            return jstohtml(html);
        }
    }, {
        key: 'update',
        value: function update() {
            this.elem.innerHTML = this.getList();

            var maxLevel = Settings.get('maxLevel'),
                btns = $$('.select-level__list .btn', this.elem),
                maxBtn = btns[maxLevel - 1] || btns[btns.length - 1];

            window.scrollTo(0, $.offset(maxBtn).top - 10);
        }
    }]);

    return SelectLevel;
}();

new SelectLevel();

var SelectLevelPage = {
    name: 'select-level',
    locationHash: 'select-level',
    show: function show() {},
    hide: function hide() {}
};

// For debug

var ShowLevelsPage = {
    name: 'show-levels',
    locationHash: 'show-levels',
    init: function init() {
        var container = $('.page_show-levels');
        var obj = Levels.data.map(function (item, i) {
            return i ? [{
                t: 'h4',
                c: [i + '. ' + item.name + ' ', { t: 'sup', c: +item.symbols.length }]
            }, {
                c: item.symbols.join(' ')
            }, {
                t: 'br'
            }] : null;
        });

        container.innerHTML = jstohtml(obj);
    },
    show: function show() {},
    hide: function hide() {}
};

Page$1.add([GamePage, MainPage, MultiplayerPage, SelectLevelPage, ShowLevelsPage]);

var inputType = void 0;
var body = document.body;

function setInputType(type) {
    if (type !== inputType) {
        document.body.classList.remove('input_' + inputType);
        document.body.classList.add('input_' + type);
        inputType = type;
    }
}

body.classList.add('support_transform3d_' + hasSupportCss('perspective'));
body.classList.add('device_' + (isMobile ? 'mobile' : 'desktop'));

setInputType('mouse');

if (isMobile) {
    setInputType('touch');
} else {
    $.on(document, 'mousemove', function () {
        setInputType('mouse');
    }).on(document, 'touchstart', function () {
        setInputType('touch');
    });
}

$.on(document, 'keydown', function () {
    setInputType('keyboard');
});

Page$1.showByLocationHash();

window.addEventListener('hashchange', function () {
    Page$1.showByLocationHash();
}, false);

}());
