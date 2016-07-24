var $ = require('dom').$;
var Page = require('page');
var Settings = require('settings');
var Field = require('field');
var levels = require('levels');

module.exports = {
    name: 'game',
    locationHash: 'game',
    init: function(data) {
        this.elem = $('.game');

        var levelData = this.getLevelData();

        this._field = new Field({
            elem: $('.field', this.elem),
            rows: levelData.rows,
            cols: levelData.cols,
            levelData: levelData.data,
            control: 'any',
            infoPanel: true
        });

        this._onKeydown = this._onKeydown.bind(this);
    },
    getLevelData: function() {
        var data = levels.getLevel(Settings.get('level'));

        return {
            data: data,
            rows: data.rows || levels.defaultRows,
            cols: data.cols || levels.defaultCols
        };
    },
    _onKeydown: function(e) {
        if (e.key === 'Escape') {
            Page.back();
        }
    },
    show: function() {
        var levelData = this.getLevelData();

        this._field.show({
            levelData: levelData.data,
            cols: levelData.cols,
            rows: levelData.rows
        });

        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function() {
        this._field.hide();
        $.off(document, 'keydown', this._onKeydown);
    }
};
