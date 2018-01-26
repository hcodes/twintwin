import {$, hasSupportCss} from './lib/dom';
import isMobile from './lib/is-mobile';
import metrika from './lib/metrika';
metrika.hit(35250605);

import Page from './components/page';
import BackButton from './components/back-button';

import Pages from './pages/pages';

class App {
    constructor() {
        const body = document.body;
        body.classList.add('support_transform3d_' + hasSupportCss('perspective'));
        body.classList.add('device_' + (isMobile ? 'mobile' : 'desktop'));

        this.inputType = 'mouse';

        if (isMobile) {
            this.inputType = 'touch';
        } else {
            $
                .on(document, 'mousemove', () => {
                    this.inputType = 'mouse';
                })
                .on(document, 'touchstart', () => {
                    this.inputType = 'touch';
                });
        }

        $.on(document, 'keydown', () => {
            this.inputType = 'keyboard';
        });

        Page.add(Pages);

        this._back = new BackButton(body);

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
