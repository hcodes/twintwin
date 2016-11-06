var $ = require('dom').$;
var Field = require('field');
var UserPanel = require('user-panel');
var Settings = require('settings');
var levels = require('levels');
var isMobile = require('is-mobile');

var SelectControls = require('select-controls');

module.exports = {
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function(data) {
        this.elem = $('.multiplayer');

        this._levelData = levels.getRandomLevel();

        var rows = 5;
        var cols = 6;

        var fieldOneElem = $('.field_one', this.elem);
        this._fieldOne = new Field({
            elem: fieldOneElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            //control: isMobile ? '*' : 'keyboard',
            control: SelectControls.getPlayerControl(0),
            infoPanel: false,
            userPanel: new UserPanel(fieldOneElem, {num: 1})
        });

        var fieldTwoElem = $('.field_two', this.elem);
        this._fieldTwo = new Field({
            elem: fieldTwoElem,
            cols: cols,
            rows: rows,
            levelData: this._levelData,
            control: SelectControls.getPlayerControl(1),
            infoPanel: false,
            userPanel: new UserPanel(fieldTwoElem, {num: 2})
        });

        this._onKeydown = this._onKeydown.bind(this);

        SelectControls.on('change', function(e, data) {
            if (data.playerNum === 0) {
                this._fieldOne.setControl(data.control);
            }

            if (data.playerNum === 1) {
                this._fieldTwo.setControl(data.control);
            }
        }.bind(this));
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
