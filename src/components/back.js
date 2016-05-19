var $ = require('dom').$,
    Page = require('page');

function Back(container) {
    this.elem = $.js2dom({
        cl: 'back',
        c: '&times;'
    });

    container.appendChild(this.elem);

    $.on(this.elem, 'click', this.onclick.bind(this));
}

Back.prototype = {
    show: function() {
        this.elem.classList.add('back_visible');
    },
    hide: function() {
        this.elem.classList.remove('back_visible');
    },
    onclick: function() {
        Page.back();
    }
};

module.exports = Back;
