import {$} from './lib/dom';
import Event from './lib/event';

export default class Gamepad {
    constructor() {
        this._pressedBuffer = {};
        this._pads = [];

        // Gamepad: XBox360
        this.buttonName: {
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

        Object.assign(this, Event.prototype);

        if (!this.supported()) {
            return;
        }

        $.on(window, 'gamepadconnected', e => {
            this.search();
            this.trigger('connected');

            if (!this._rafId) {
                this._rafId = window.requestAnimationFrame(this.checkButtons.bind(this));
            }
        });

        $.on(window, 'gamepaddisconnected', e => {
            this.search();
            this.trigger('disconnected');

            if (!this.get().length && this._rafId) {
                window.cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
        });
    }

    checkButtons() {
        this.get().forEach(function(pad) {
            const padIndex = pad.index;
            this._pressedBuffer[padIndex] = this._pressedBuffer[padIndex] || {};

            pad.buttons.forEach(function(button, buttonIndex) {
                if (typeof button === 'object') {
                    if (this._pressedBuffer[padIndex][buttonIndex] && !button.pressed) {
                        this.trigger(this.getButtonEventName(buttonIndex));
                        this.trigger(this.getButtonEventName(buttonIndex, pad.index));
                    }

                    this._pressedBuffer[padIndex][buttonIndex] = button.pressed;
                }
            }, this);
        }, this);

        this._rafId = window.requestAnimationFrame(this.checkButtons.bind(this));
    }

    supported() {
        return typeof navigator.getGamepads === 'function';
    }

    get() {
        return this._pads;
    }

    item(num) {
        return this.get()[num];
    }

    count() {
        return this.get().length;
    }

    search() {
        this._pads = this.supported() ? navigator.getGamepads() : [];
    }

    getButtonId(name) {
        return this.buttonName[name];
    }

    getButtonEventName(button, gamepadIndex) {
        const index = typeof gamepadIndex === 'undefined' ? '*' : gamepadIndex;
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
    onbutton(button, callback) {
        const self = this;
        let gamepadIndex;

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
    onbuttons(buttons, callback) {
        buttons.forEach(function(button) {
            this.onbutton(button, callback);
        }, this);

        return this;
    }
};
