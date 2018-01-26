// For debug

import jstohtml from 'jstohtml';

import {$} from '../lib/dom';

import Levels from '../components/levels';

const ShowLevelsPage = {
    name: 'show-levels',
    locationHash: 'show-levels',
    init() {
        const container = $('.page_show-levels');
        const obj = Levels.data.map(function(item, i) {
            return i ? [
                {
                    t: 'h4',
                    c: [
                        i + '. ' + item.name + ' ',
                        { t: 'sup', c: +item.symbols.length }
                    ]
                },
                {
                    c: item.symbols.join(' ')
                },
                {
                    t: 'br'
                }
            ] : null;
        });

        container.innerHTML = jstohtml(obj);
    },
    show() {},
    hide() {}
};

export default ShowLevelsPage;
