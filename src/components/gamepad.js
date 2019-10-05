import {$} from '../lib/dom';
import CustomEvent from '../lib/custom-event';

class Gamepad extends CustomEvent {
    constructor() {
        super();

        this._pressedBuffer = {};
        this._pads = [];

        this.buttonName = {
            '54c-5c4-Wireless Controller': { // PS4
                green: 1,
                a: 1,

                red: 2,
                b: 2,

                yellow: 3,
                y: 3,

                blue: 0,
                x: 0,

                left: 16,
                right: 17,
                up: 14,
                down: 15,

                back: 8,
                start: 9,

                lt: 6,
                lb: 4,

                rt: 7,
                rb: 5
            },
            'xbox': { // XBox360
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
            }
        };

        if (!this.supported()) {
            return;
        }

        $
            .on(window, 'gamepadconnected', () => {
                this.search();
                this.trigger('connected');

                if (!this._rafId) {
                    this._rafId = window.requestAnimationFrame(this.checkButtons.bind(this));
                }
            })
            .on(window, 'gamepaddisconnected', () => {
                this.search();
                this.trigger('disconnected');

                if (!this.get().length && this._rafId) {
                    window.cancelAnimationFrame(this._rafId);
                    this._rafId = null;
                }
            });
    }

    checkButtons() {
        const list = this.get();

        for (let i = 0; i < list.length; i++) {
            const pad = list[i];
            if (!pad) {
                continue;
            }

            const padIndex = pad.index;
            this._pressedBuffer[padIndex] = this._pressedBuffer[padIndex] || {};

            pad.buttons.forEach(function(button, buttonIndex) {
                if (typeof button === 'object') {
                    if (this._pressedBuffer[padIndex][buttonIndex] && !button.pressed) {
                        this.trigger(this.getButtonEventName(buttonIndex));
                        this.trigger(this.getButtonEventName(buttonIndex, pad.index));

                        console.log('name', this.getButtonEventName(buttonIndex));
                    }

                    this._pressedBuffer[padIndex][buttonIndex] = button.pressed;                    
                }
            }, this);
        }

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

    getButtonId(name, index) {
        const id = this._pads[index] && this._pads[index].id;
        console.log(this._pads[index], this.buttonName[id], id);
        return this.buttonName[id] && this.buttonName[id][name];
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

        console.log('bbbb', button, self.getButtonId(button, gamepadIndex));

        function setEvent(b) {
            var buttonId = typeof b === 'number' ? b : self.getButtonId(b, gamepadIndex);
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
}

export default new Gamepad();
