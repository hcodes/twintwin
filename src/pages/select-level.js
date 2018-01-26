import {$, $$} from './dom';
import jstohtml from 'jstohtml';
import levels from './components/levels';
import Settings from './components/settings';
import Page from './components/page';

const SelectLevelPage = {
    name: 'select-level',
    locationHash: 'select-level',
    init() {
        const el = $('.select-level__list');
        el.innerHTML = this.getList();

        $.delegate(el, '.btn', 'click', () => {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            const level = parseInt(this.dataset['level'], 10);
            Settings.set('level', level);
            Page.show('game');
        });

        return this;
    },
    getList() {
        const html = [];

        levels.data.forEach(function(levelData, i) {
            if (!i) {
                return;
            }

            html.push({
                t: 'li',
                cl: 'select-level__item',
                c: {
                    t: 'span',
                    cl: [
                        'btn btn_red btn_middle'
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
        }, this);

        return jstohtml(html);
    },
    show() {
        const
            maxLevel = Settings.get('maxLevel'),
            btns = $$('.select-level__list .btn', this.elem),
            cl = 'btn_disabled';

        for (let i = 0; i < btns.length; i++) {
            let btnCl = btns[i].classList;
            if (i < maxLevel) {
                btnCl.remove(cl);
            } else {
                btnCl.add(cl);
            }
        }

        const maxBtn = btns[maxLevel - 1] || btns[btns.length - 1];
        window.scrollTo(0, $.offset(maxBtn).top - 10);
    },
    hide() {}
};

export default SelectLevelPage;
