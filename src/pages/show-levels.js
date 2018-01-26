// For debug

import levels from './components/levels';
import {$} from './dom';
import jstohtml from 'jstohtml';

const ShowLevelsPage = {
    name: 'show-levels',
    locationHash: 'show-levels',
    init(data) {
        const container = $('.page_show-levels');
        const obj = levels.data.map(function(item, i) {
            return i ? [
                {
                    t: 'h4',
                    c: [
                        i + '. ' + item.name + ' ',
                        { t: 'sup', c: + item.symbols.length }
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
