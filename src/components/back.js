import {$} from '../lib/dom';

import Page from './page';

export default class Back {
    constructor(container) {
        this.elem = $.js2dom({
            cl: 'back',
            c: '&times;'
        });

        container.appendChild(this.elem);

        $.on(this.elem, 'click', this.onclick.bind(this));
    }

    show() {
        this.elem.classList.add('back_visible');
    }

    hide() {
        this.elem.classList.remove('back_visible');
    }

    onclick() {
        Page.back();
    }
}
