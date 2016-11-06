var $ = require('dom').$;
var Page = require('page');
var Settings = require('settings');
var Field = require('field');
var levels = require('levels');
var gameOver = require('game-over');

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

        this._field.onFinish = function() {
            var maxLevel = Settings.get('maxLevel');
            Settings.set('maxLevel', Math.max(maxLevel, Settings.get('level') + 1));

            var panel = this.infoPanel;
            gameOver.show({
                errors: panel.errors || 1,
                time: Math.floor((Date.now() - panel.startTime) / 1000) || 1
            });
        };

        gameOver.on('click', function(e, button) {
            var level;

            switch(button) {
                case 'menu':
                    Page.show('main');
                    break;
                case 'next':
                    this.nextLevel();
                    break;
                case 'restart':
                    this.restart();
                    break;
            }
        }.bind(this));
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
    restart: function() {
        this.hide();
        this.show();
    },
    nextLevel: function() {
        Settings.set('level', Settings.get('level') + 1);

        this.hide();
        this.show();
    },
    show: function() {
        var levelData = this.getLevelData();

        gameOver.hide();

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
