import './index.less';

import { $ } from '../../helpers/dom';

import Page from '../../components/page';
import Settings from '../../components/settings';

import MainBg from '../../components/main-bg';
import '../../components/main-emoji';
import '../../components/main-logo';
import '../../components/main-menu';
import '../../components/qr-code';

const MainPage = {
    name: 'main',
    locationHash: '',
    init() {
        this._mainBg = new MainBg();

        this.setEvents();
    },
    setEvents() {
        $
            .on(window, 'resize', () => {
                this._mainBg.resize();
            })
            .on('.main-menu__continue', 'click', function() {
                if (this.classList.contains('button_disabled')) {
                    return;
                }

                Page.show('select-level');
            })
            .on('.main-menu__new-game', 'click', () => {
                Settings.set('maxLevel', 1);
                Page.show('select-level');
            })
            .on('.main-menu__multiplayer', 'click', () => {
                Page.show('multiplayer');
            });
    },
    show() {
        var cont = $('.main-menu__continue');
        if (Settings.get('level')) {
            cont.classList.remove('button_disabled');
        } else {
            cont.classList.add('button_disabled');
        }

        this._timer = setInterval(() => {
            this._mainBg.setOpacity(function() {
                return 0.1 + Math.random() * 0.4;
            });
        }, 1000);
    },
    hide() {
        this._timer && clearInterval(this._timer);
        this._timer = null;

        this._mainBg.setOpacity(0);
    }
};

export default MainPage;
