import './index.less';

import jstohtml from 'jstohtml';

import { $, $$ } from '../../helpers/dom';

import Levels from '../../helpers/levels';
import Settings from '../settings';
import Page from '../page';

class SelectLevel {
    constructor() {
        this.elem = $('.select-level__list', this.elem);
        this.elem.innerHTML = this.getList();

        $.delegate(this.elem, '.button', 'click', function() {
            const level = parseInt(this.dataset['level'], 10);
            Settings.set('level', level);
            Page.show('game');
        });

        Page.on('show', (e, p) => {
            if (p.name === 'select-level') {
                this.update();
            }
        });
    }

    getList() {
        const
            html = [],
            maxLevel = Settings.get('maxLevel');

        Levels.data.forEach(function(levelData, i) {
            if (!levelData.name) {
                return;
            }

            html.push({
                t: 'li',
                cl: 'select-level__item',
                c: {
                    t: 'span',
                    cl: [
                        'button',
                        'button_red',
                        'button_middle',
                        i <= maxLevel ? '' : 'button_disabled'
                    ],
                    'data-level': i,
                    c: [
                        {
                            t: 'span',
                            cl: 'select-level__emoji emoji',
                            c: levelData.titleSymbol
                        },
                        levelData.name
                    ]
                }
            });
        });

        return jstohtml(html);
    }

    update() {
        this.elem.innerHTML = this.getList();

        const
            maxLevel = Settings.get('maxLevel'),
            btns = $$('.select-level__list .button', this.elem),
            maxBtn = btns[maxLevel - 1] || btns[btns.length - 1];

        window.scrollTo(0, $.offset(maxBtn).top - 10);
    }
}

export default new SelectLevel();
