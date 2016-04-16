var $ = require('dom').$,
    Page = require('page'),
    Settings = require('settings'),
    Field = require('field'),
    levels = require('levels');

module.exports = {
    name: 'game',
    locationHash: 'game',
    init: function(data) {
        this._field = new Field({
            elem: $('.field', '.game'),
            cols: 6,
            rows: 5,
            levelData: levels.getLevel(Settings.get('level')),
            control: 'any',
            infoPanel: true
        });
        
        this._onKeydown = this._onKeydown.bind(this);

        $.on($('.game__exit', this._elem), 'mousedown', this._onExit.bind(this));
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
        this._field.show();
        $.on(document, 'keydown', this._onKeydown);
    },
    hide: function() {
        this._field.hide();
        $.off(document, 'keydown', this._onKeydown);
    }
};
