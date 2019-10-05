import './index.less';

import { $ } from '../../helpers/dom';
import Page from '../pages/page';

/*var tp = new TrophyNotice({
    title: 'Hello world!',
    type: '🏆'
}).open();*/

export default class TrophyNotice {
    constructor(data) {
        this._data = data;
        this._onclick = () => {
            this.close();
            Page.show('trophies');
        };
    }

    open() {
        this._el = $.js2dom({
            cl: 'trophy-notice',
            c: [{
                cl: 'trophy-notice__title',
                c: this._data.title
            }, {
                cl: 'trophy-notice__type',
                c: this._data.type
            }]
        });

        document.body.appendChild(this._el);

        setTimeout(() => {
            this._el.classList.add('trophy-notice_open');
            $.on(this._el, 'click', this._onclick);
        }, 50);

        return this;
    }

    close() {
        this._el.classList.remove('trophy-notice_open');
        $.off(this._el, 'click', this._onclick);

        setTimeout(this.remove.bind(this), 200);

        return this;
    }

    remove() {
        document.body.removeChild(this._el);
        delete this._el;
    }
}
