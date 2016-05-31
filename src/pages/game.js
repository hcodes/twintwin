var $ = require('dom').$,
    Page = require('page'),
    Settings = require('settings'),
    Field = require('field'),
    levels = require('levels');

module.exports = {
    name: 'game',
    locationHash: 'game',
    init: function(data) {
        this.elem = $('.game');

        this._levelData = levels.getLevel(Settings.get('level'));
        
        this._field = new Field({
            elem: $('.field', this.elem),
            cols: 6,
            rows: 5,
            levelData: this._levelData,
            control: 'any',
            infoPanel: true
        });
        
        this._onKeydown = this._onKeydown.bind(this);
    },
    _onKeydown: function(e) {
        if (e.key === 'Escape') {
            Page.back();
        }
    },
    show: function() {
        this._field.show();
        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function() {
        this._field.hide();
        $.off(document, 'keydown', this._onKeydown);
    }
};
