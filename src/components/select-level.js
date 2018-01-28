import jstohtml from 'jstohtml';

import {$, $$} from '../lib/dom';

import Levels from '../components/levels';
import Settings from '../components/settings';
import Page from '../components/page';

class SelectLevel {
    constructor() {
        this.elem = $('.select-level__list', this.elem);
        this.elem.innerHTML = this.getList();

        $.delegate(this.elem, '.btn', 'click', function() {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

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
                        'btn btn_red btn_middle' + (i <= maxLevel ? '' : ' btn_disabled')
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
            btns = $$('.select-level__list .btn', this.elem),
            maxBtn = btns[maxLevel - 1] || btns[btns.length - 1];

        window.scrollTo(0, $.offset(maxBtn).top - 10);
    }
}

export default new SelectLevel();
