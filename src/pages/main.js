import jstohtml from 'jstohtml';

import {$, $$} from '../lib/dom';

import Levels from '../components/levels';
import Settings from '../components/settings';
import Page from '../components/page';

const MainPage = {
    name: 'main',
    locationHash: '',
    init() {
        this._bg = $('.main-bg');
        this._bg.innerHTML = this.getBackground();

        this.setEvents();

        this.resizeEmoji();
        this.initLogo();

        return this;
    },
    setEvents() {
        $
            .on(window, 'resize', this.resizeEmoji.bind(this))
            .on('.main-menu__continue', 'click', function() {
                if (this.classList.contains('btn_disabled')) {
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
    initLogo() {
        const el = $('.main-logo');
        setTimeout(function() {
            el.classList.add('main-logo_visible');
        }, 500);
    },
    getBackground() {
        let symbols = [];
        Levels.data.forEach(function(level) {
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
    resizeEmoji() {
        const
            width = Math.floor(document.documentElement.clientWidth / 12),
            bgStyle = this._bg.style;

        bgStyle.fontSize = width + 'px';
        bgStyle.lineHeight =  width + 'px';
    },
    show() {
        var cont = $('.main-menu__continue');
        if (Settings.get('level')) {
            cont.classList.remove('btn_disabled');
        } else {
            cont.classList.add('btn_disabled');
        }

        this._timer = setInterval(() => {
            this.setOpacity(function() {
                return 0.1 + Math.random() * 0.4;
            });
        }, 1000);
    },
    setOpacity(callback) {
        const elems = $$('.main-emoji');

        for (let i = 0; i < elems.length; i++) {
            elems[i].style.opacity = typeof callback === 'function' ? callback() : callback;
        }
    },
    hide() {
        this._timer && clearInterval(this._timer);
        this._timer = null;

        this.setOpacity(0);
    }
};

export default MainPage;
