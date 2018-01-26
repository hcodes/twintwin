import Gamepad from './components/gamepad';
import GamepadNotice from './components/gamepad-notice';
import Page from './components/page';
import Back from './components/back';

import Pages from './pages/pages';

import {$, hasSupportCss} from './lib/dom';
import isMobile from './lib/is-mobile';
import metrika from './lib/metrika';
metrika.hit(35250605);

class App {
    constructor() {
        const body = document.body;

        new Gamepad();
        new GamepadNotice();

        body.classList.add('support_transform3d_' + hasSupportCss('perspective'));
        body.classList.add('device_' + (isMobile ? 'mobile' : 'desktop'));

        this.inputType = 'mouse';

        if (isMobile) {
            this.inputType = 'touch';
        } else {
            $.on(document, 'mousemove', () => {
                this.inputType = 'mouse';
            });

            $.on(document, 'touchstart', () => {
                this.inputType = 'touch';
            });
        }

        $.on(document, 'keydown', () => {
            this.inputType = 'keyboard';
        });

        this._back = new Back(body);

        Page.on('show', (e, page) => {
            if (page.name === 'main') {
                this._back.hide();
            } else {
                this._back.show();
            }
        });

        Page.showByLocationHash();
        window.addEventListener('hashchange', () => {
            Page.showByLocationHash();
        }, false);

        Page.add(Pages);
    }

    get inputType() {
        return this._inputType;
    }

    set inputType(type) {
        if (type !== this._inputType) {
            document.body.classList.remove('input_' + this.inputType);
            document.body.classList.add('input_' + type);
            this._inputType = type;
        }
    }
}

new App();
