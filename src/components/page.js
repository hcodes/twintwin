import CustomEvent from '../lib/custom-event';
import {$} from '../lib/dom';

import Back from './back';

class Page extends CustomEvent {
    constructor() {
        super();

        this._current = null;
        this._buffer = {};

        this._back = new Back(document.body);

        this.on('show', (e, page) => {
            if (page.name === 'main') {
                this._back.hide();
            } else {
                this._back.show();
            }
        });
    }

    back() {
        window.history.back();
        this.showByLocationHash();

        return this;
    }

    add(pages) {
        if (Array.isArray(pages)) {
            pages.forEach(function(page) {
                this._add(page);
            }, this);
        } else {
            this._add(pages);
        }

        return this;
    }

    _add(page) {
        this._buffer[page.name] = page;
    }

    get(name) {
        return this._buffer[name];
    }

    has(name) {
        return Boolean(this.get(name));
    }

    show(name, data) {
        let oldName = null;
        const body = document.body;

        if (this._current) {
            oldName = this._current.name;
            if (oldName === name) {
                return;
            }

            this._current.hide();
            this._current.elem.classList.remove('page_show');
            body.classList.remove('page_' + oldName);
        }

        const page = this.get(name);
        if (!page._isInited) {
            page.elem = $('.page_' + name);
            page.init && page.init();
            page._isInited = true;
        }

        body.classList.add('page_' + name);
        page.elem.classList.add('page_show');
        page.show(data);

        if (page.locationHash !== undefined && window.location.hash !== '#' + page.locationHash) {
            window.location.hash = page.locationHash;
        }

        this._current = page;

        this.trigger('show', page);

        return this;
    }

    hide(name) {
        this.get(name).hide();

        return this;
    }

    showByLocationHash() {
        this.show(this.getNameByLocationHash(window.location.hash));

        return this;
    }

    getNameByLocationHash(hash) {
        let name;
        hash = (hash || '').replace(/#/, '');

        Object.keys(this._buffer).some(function(key) {
            const page = this._buffer[key];

            if (page.locationHash === hash) {
                name = page.name;
                return true;
            }

            return false;
        }, this);

        return name || 'main';
    }
}

export default new Page();
