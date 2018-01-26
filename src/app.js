import dom from './lib/dom';
const $ = dom.$;

import Gamepad from './components/gamepad';
import GamepadNotice from './components/gamepad-notice';
import Page from './pages/page';
import Back from './components/back';
import isMobile from './lib/is-mobile';

import mainPage from './pages/main';
import gamePage from './pages/game';
import multiplayerPage from './pages/multiplayer';
import selectLevelPage from './pages/select-level';
import showLevels from './pages/show-levels';

import metrika from './lib/metrika';
metrika.hit(35250605);

const body = document.body;

const App = {
    init() {
        new Gamepad();
        new GamepadNotice();

        Page.add([
            mainPage,
            gamePage,
            multiplayerPage,
            selectLevelPage,
            showLevels
        ]);

        body.classList.add('support_transform3d_' + dom.hasSupportCss('perspective'));

        body.classList.add('device_' + (isMobile ? 'mobile' : 'desktop'));

        if (isMobile) {
            this.setInputType('touch');
        } else {
            $.on(document, 'mousemove', function() {
                this.setInputType('mouse');
            }.bind(this));

            $.on(document, 'touchstart', function() {
                this.setInputType('touch');
            }.bind(this));
        }

        $.on(document, 'keydown', function() {
            this.setInputType('keyboard');
        }.bind(this));

        this.setInputType('mouse');

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
    },
    inputType: null,
    setInputType(type) {
        if (type !== this.inputType) {
            body.classList.remove('input_' + this.inputType);
            body.classList.add('input_' + type);
            this.inputType = type;
        }
    }
};

$.on(document, 'DOMContentLoaded', App.init.bind(this));
