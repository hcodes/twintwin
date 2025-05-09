import { $ } from '../../helpers/dom';

import './index.css';

export default class Back {
    constructor(container, onclick) {
        this.elem = $.js2dom({
            cl: 'back',
            c: '&times;'
        });

        container.appendChild(this.elem);

        $.on(this.elem, 'click', onclick.bind(this));
    }

    show() {
        this.elem.classList.add('back_visible');
    }

    hide() {
        this.elem.classList.remove('back_visible');
    }
}
