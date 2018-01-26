import customEvent from './lib/event';
import {$} from './lib/dom';
const body = document.body;

const Page =  {
    back() {
        window.history.back();
        this.showByLocationHash();
    },
    add(pages) {
        if (Array.isArray(pages)) {
            pages.forEach(function(page) {
                this._add(page);
            }, this);
        } else {
            this._add(pages);
        }
    },
    _add(page) {
        this.buffer[page.name] = page;
    },
    get(name) {
        return this.buffer[name];
    },
    has(name) {
        return Boolean(this.get(name));
    },
    show(name, data) {
        let oldName = null;

        if (this.current) {
            oldName = this.current.name;
            if (oldName === name) {
                return;
            }

            this.current.hide();
            body.classList.remove('page_' + oldName);
        }

        const page = this.get(name);
        if (!page._isInited) {
            page.elem = $('.page_' + name);
            page.init();
            page._isInited = true;
        }

        body.classList.add('page_' + name);
        page.show(data);

        if (page.locationHash !== undefined && window.location.hash !== '#' + page.locationHash) {
            window.location.hash = page.locationHash;
        }

        this.current = page;

        this.trigger('show', page);
    },
    hide(name) {
        this.get(name).hide();
    },
    showByLocationHash() {
        this.show(this. getNameByLocationHash(window.location.hash));
    },
    getNameByLocationHash(hash) {
        let name;
        hash = (hash || '').replace(/#/, '');

        Object.keys(this.buffer).some(function(key) {
            const page = this.buffer[key];

            if (page.locationHash === hash) {
                name = page.name;
                return true;
            }

            return false;
        }, this);

        return name || 'main';
    },
    current: null,
    buffer: {}
};

Object.assign(Page, customEvent.prototype);

export default Page;
