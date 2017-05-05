var dom = require('dom'),
    $ = dom.$,
    Gamepad = require('gamepad'),
    GamepadNotice = require('gamepad-notice'),
    Page = require('page'),
    Back = require('back'),
    metrika = require('metrika'),
    isMobile = require('is-mobile'),
    body = document.body;

var App = {
    init: function() {
        body.classList.add('support_transform3d_' + dom.hasSupportCss('perspective'));

        body.classList.add('device_' + (isMobile ? 'mobile' : 'desktop'));

        if (isMobile) {
            this.setInputType('touch');
        } else {
            $.on(document, 'mousemove', function() {
                this.setInputType('mouse');
            }.bind(this));

            $.on(document, 'touchstart', function() {
                this.setInputType('touch');
            }.bind(this));
        }

        $.on(document, 'keydown', function() {
            this.setInputType('keyboard');
        }.bind(this));

        this.setInputType('mouse');

        this._back = new Back(body);

        Page.on('show', function(e, page) {
            if (page.name === 'main') {
                this._back.hide();
            } else {
                this._back.show();
            }
        }.bind(this));

        Page.showByLocationHash();
        window.addEventListener('hashchange', function() {
            Page.showByLocationHash();
        }.bind(this), false);
    },
    inputType: null,
    setInputType: function(type) {
        if (type !== this.inputType) {
            body.classList.remove('input_' + this.inputType);
            body.classList.add('input_' + type);
            this.inputType = type;
        }
    }
};

$.on(document, 'DOMContentLoaded', function() {
    Gamepad.init();
    GamepadNotice.init();
    Page.add([
        require('main'),
        require('game'),
        require('multiplayer'),
        require('select-level'),
        require('show-levels')
    ]);
    App.init();

    metrika.hit(35250605);
});
