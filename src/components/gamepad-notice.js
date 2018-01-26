import {$} from './lib/dom';
import Gamepad from './gamepad';

const body = document.body;

export default class GamepadNotice {
    constructor() {
        this.build();
        this.setEvents();

        this.timeout = 3000;
    }

    build() {
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
    }

    setEvents() {
        Gamepad
            .on('connected', this.showConnected.bind(this))
            .on('disconnected', this.showDisconnected.bind(this));

        body.appendChild(this._elemConnected);
        body.appendChild(this._elemDisconnected);
    }

    showDisconnected() {
        const
            cl = 'gamepad-notice-disconnected_show',
            el = this._elemDisconnected;

        el.classList.add(cl);

        if (this._disTimer) {
            clearTimeout(this._disTimer);
            this._disTimer = null;
        }

        this._disTimer = setTimeout(() => {
            el.classList.remove(cl);
            this._disTimer = null;
        }, this.timeout);
    }

    showConnected() {
        const
            cl = 'gamepad-notice-connected_show',
            el = this._elemConnected;

        el.classList.add(cl);

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this._timer = setTimeout(() => {
            el.classList.remove(cl);
            this._timer = null;
        }, this.timeout);
    }
}
