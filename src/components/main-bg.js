import jstohtml from 'jstohtml';

import {$, $$} from '../lib/dom';
import {shuffle} from '../lib/utils';

import Levels from '../components/levels';

class MainBg {
    constructor() {
        this.elem = $('.main-bg');
        this.elem.innerHTML = this.getBackground();

        this.resize();
    }

    getBackground() {
        let symbols = [];
        Levels.data.forEach(function(level) {
            if (level.bg !== false) {
                symbols = symbols.concat(level.symbols);
            }
        });

        shuffle(symbols);

        return jstohtml(symbols.map(function(sym) {
            return {
                cl: ['main-emoji', 'emoji'],
                c: sym
            };
        }));
    }

    resize() {
        const
            width = Math.floor(document.documentElement.clientWidth / 12),
            bgStyle = this.elem.style;

        bgStyle.fontSize = width + 'px';
        bgStyle.lineHeight =  width + 'px';
    }

    setOpacity(callback) {
        const elems = $$('.main-emoji', this.elem);

        for (let i = 0; i < elems.length; i++) {
            elems[i].style.opacity = typeof callback === 'function' ? callback() : callback;
        }
    }

    destroy() {
        if (this.elem) {
            this.elem.innerHTML = '';
            delete this.elem;
        }
    }
}

export default MainBg;
