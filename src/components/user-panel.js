var Settings = require('settings'),
    $ = require('dom').$,
    string = require('string');

function UserPanel(container, data) {
    this.container = container;

    this.num = data.num;
    this.settingName = 'player' + data.num;
    this.name = this.getUserName(data.name);
    
    this.init();
}

UserPanel.prototype = {
    init: function() {
        this.elem = $.js2dom({
            cl: 'user-panel',
            c: this.name
        });
        

        this.container.appendChild(this.elem);
        this.setEvents();
    },
    setEvents: function() {
        $.on(this.elem, 'click', this._onclick.bind(this));
    },
    getUserName: function(name) {
        return name || Settings.get(this.settingName, 'Player ' + this.num);
    },
    _onclick: function() {
        var result = window.prompt('Player name:');
        if (result) {
            this.name = this.getUserName(result);
            this.elem.innerHTML = string.escapeHTML(this.name);
            Settings.set(this.settingName, this.name);
        }
    }
};

module.exports = UserPanel;
