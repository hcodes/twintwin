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
