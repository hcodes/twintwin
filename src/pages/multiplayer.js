var $ = require('dom').$,
    Field = require('field'),
    Page = require('page'),
    levels = require('levels');

module.exports = {
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function(data) {
        var context = $('.multiplayer'),
            levelData = levels.getRandomLevel();
            
        this._fieldOne = new Field({
            elem: $('.field_one', context),
            cols: 6,
            rows: 5,
            levelData: levelData,
            control: 'keyboard',
            infoPanel: false
        });

        this._fieldTwo = new Field({
            elem: $('.field_two', context),
            cols: 6,
            rows: 5,
            levelData: levelData,
            control: 'gamepad',
            infoPanel: false
        });

        $.on($('.multiplayer__exit', this._elem), 'mousedown', function() {
            Page.show('select-level');
        });

        this._onKeydown = this._onKeydown.bind(this);
    },
    _onKeydown: function(e) {
        if (e.key === 'Escape') {
            this._onExit();
        }
    },
    _onExit: function() {
        Page.show('select-level');
    },
    show: function() {
        this._fieldOne.show();
        this._fieldTwo.show();

        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function() {
        this._fieldOne.hide();
        this._fieldTwo.hide();

        $.off(document, 'keydown', this._onKeydown);
    }
};
