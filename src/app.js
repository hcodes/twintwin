var dom = require('dom'),
    $ = dom.$,
    Gamepad = require('gamepad'),
    GamepadNotice = require('gamepad-notice'),
    Page = require('page'),
    Back = require('back'),
    metrika = require('metrika'),
    body = document.body;

require('array');
require('object');
require('function');

var App = {
    init: function() {
        body.classList.add('support_transform3d_' + dom.hasSupportCss('perspective'));

        $.on(document, 'mousemove', function() {
            this.setInputType('mouse');
        }.bind(this));

        $.on(document, 'keydown', function() {
            this.setInputType('keyboard');
        }.bind(this));

        $.on(document, 'touchstart', function() {
            this.setInputType('touch');
        }.bind(this));

        this.setInputType('mouse');

        Page.showByLocationHash();

        this._back = new Back(body);
        
        Page.on('show', function(e, page) {
            if (page.name === 'main') {
                this._back.hide();
            } else {
                this._back.show();
            }
        }.bind(this));
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
        require('select-level')
    ]);
    App.init();

    metrika.hit(35250605);
});
