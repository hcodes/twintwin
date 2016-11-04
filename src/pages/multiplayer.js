var $ = require('dom').$,
    Field = require('field'),
    UserPanel = require('user-panel'),
    Settings = require('settings'),
    levels = require('levels'),
    isMobile = require('is-mobile');

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
            control: isMobile ? '*' : 'keyboard',
            infoPanel: false,
            userPanel: new UserPanel(fieldOneElem, {num: 1})
        });

        var fieldTwoElem = $('.field_two', this.elem);
        this._fieldTwo = new Field({
            elem: fieldTwoElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            control: isMobile ? '*' : 'gamepad',
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
    getLevelData: function() {
        var data = levels.getLevel(Settings.get('level'));

        return {
            data: data,
            rows: data.rows || levels.defaultRows,
            cols: data.cols || levels.defaultCols
        };
    },
    show: function() {
        var levelData = this.getLevelData(),
            data = {
                levelData: levelData.data,
                cols: levelData.cols,
                rows: levelData.rows
            };

        this._fieldOne.show(data);
        this._fieldTwo.show(data);

        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function() {
        this._fieldOne.hide();
        this._fieldTwo.hide();

        $.off(document, 'keydown', this._onKeydown);
    }
};
