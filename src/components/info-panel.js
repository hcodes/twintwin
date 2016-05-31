var $ = require('dom').$,
    levels = require('levels'),
    dtime = require('date-time');

function InfoPanel(container) {
    this.container = container;
    this.elem = $.js2dom(this.build());
    this.container.appendChild(this.elem);
}

InfoPanel.prototype = {
    build: function() {
        return {
            cl: 'info-panel',
            c: [
                {
                    cl: 'info-panel__time',
                    t: 'span',
                    c: [
                        'Time: ',
                        {
                            t: 'span',
                            cl: 'info-panel__time-num'
                        }
                    ]
                },
                {
                    cl: 'info-panel__errors',
                    t: 'span',
                    c: [
                        'Errors: ',
                        {
                            t: 'span',
                            cl: 'info-panel__errors-num'
                        }
                    ]
                }
            ]
        };
    },
    update: function() {
        this.currentTime = Date.now();

        this.updatePart('errors-num', this.errors);
        this.updatePart('time-num', dtime.formatTime(this.currentTime - this.startTime));
    },
    updatePart: function(name, value) {
        $('.info-panel__' + name, this.elem).innerHTML = value;
    },
    start: function(levelData) {
        this.stop();

        this.errors = 0;
        this.levelTitle = levels.getTitle(levelData);
        this.startTime = Date.now();

        this.update();
        this._timer = setInterval(function() {
            this.update();
        }.bind(this), 500);
    },
    stop: function() {
        this._timer && clearInterval(this._timer);
        this._timer = null;
    }
};

module.exports = InfoPanel;
