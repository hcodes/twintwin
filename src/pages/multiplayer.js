var $ = require('dom').$,
    Field = require('field'),
    UserPanel = require('user-panel'),
    levels = require('levels');

module.exports = {
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function(data) {
        this.elem = $('.multiplayer');
        
        this._levelData = levels.getRandomLevel();
        
        var rows = 5,
            cols = 6;
           
        var fieldOneElem = $('.field_one', this.elem);
        this._fieldOne = new Field({
            elem: fieldOneElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            control: 'keyboard',
            infoPanel: false,
            userPanel: new UserPanel(fieldOneElem, {num: 1})
        });

        var fieldTwoElem = $('.field_two', this.elem);
        this._fieldTwo = new Field({
            elem: fieldTwoElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            control: 'gamepad',
            infoPanel: false,
            userPanel: new UserPanel(fieldTwoElem, {num: 2})
        });

        this._onKeydown = this._onKeydown.bind(this);
    },
    _onKeydown: function(e) {
        if (e.key === 'Escape') {
            this._onExit();
        }
    },
    show: function() {
        $('.level-title', this.elem).innerHTML = levels.getTitle(this._levelData);

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
