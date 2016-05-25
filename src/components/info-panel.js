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
                    t: 'span',
                    cl: 'info-panel__level-title'
                },
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
                    cl: 'info-panel__cages',
                    t: 'span',
                    c: [
                        'Cages: ',
                        {
                            t: 'span',
                            cl: 'info-panel__cages-num'
                        }
                    ]
                },
                {
                    cl: 'info-panel__clicks',
                    t: 'span',
                    c: [
                        'Clicks: ',
                        {
                            t: 'span',
                            cl: 'info-panel__clicks-num'
                        }
                    ]
                }
            ]
        };
    },
    update: function() {
        this.currentTime = Date.now();

        this.updatePart('clicks-num', this.clicks);
        this.updatePart('cages-num', this.cages);
        this.updatePart('level-title', this.levelTitle);
        this.updatePart('time-num', dtime.formatTime(this.currentTime - this.startTime));
    },
    updatePart: function(name, value) {
        $('.info-panel__' + name, this.elem).innerHTML = value;
    },
    start: function(levelData, cages) {
        this.stop();

        this.clicks = 0;
        this.cages = cages;
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
