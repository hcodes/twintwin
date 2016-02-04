function InfoPanel(container) {
    this._container = container;
    this._elem = $.js2dom(this.build());
    this._container.appendChild(this._elem);
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
                        'Time: ',
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
        this.updatePart('time-num', formatTime(this.currentTime - this.startTime));
    },
    updatePart: function(name, value) {
        $('.info-panel__' + name, this._elem).innerHTML = value;
    },
    start: function(level, cages) {
        this.stop();

        this.clicks = 0;
        this.cages = cages;
        this.levelTitle = App.levelTitle(level);
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
}