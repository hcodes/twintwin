var PageField = {
    name: 'field',
    init: function(data) {
        this._el = $('.field__cages');

        this.setEvents();
        this.info.parent = this;

        return this;
    },
    setEvents: function() {
        $.on('.field__exit', 'mousedown', function() {
            App.page.show('select-level');
        });

        $.on(window, 'resize', function() {
            this.resizeCages();
        }.bind(this));

        $.delegate(this._el, '.cage__front', 'mousedown', function(e) {
            var cage = e.target.parentNode,
                ds = cage.dataset;

            if (!cage.classList.contains('cage_opened')) {
                this.info.clicks++;
                this.info.update();
                this.openCage(ds.x, ds.y);
            }
        }.bind(this));
    },
    padding: 5,
    cols: 3,
    rows: 4,
    field: [],
    addCages: function() {
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = document.createElement('div');
                cage.className = 'cage';
                cage.dataset.x = x;
                cage.dataset.y = y;
                cage.innerHTML = '<div class="cage__front"></div><div class="cage__back emoji"></div>';
                this._el.appendChild(cage);
            }
        }
    },
    resizeCages: function() {
        var size = this.getSize();
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = this.findCage(x, y);
                cage && setCSS(cage, {
                    width: size.width + 'px',
                    height: size.height + 'px',
                    left: x * (size.width + this.padding) + 'px',
                    top: y * (size.height + this.padding) + 'px',
                    lineHeight: size.height + 'px',
                    fontSize: size.fontSize + 'px'
                });
            }
        }
    },
    getLevelSymbols: function() {
        var level = this._level,
            syms = this.data.levels[level].symbols,
            size = this.cols * this.rows,
            halfSize = size / 2,
            buf = [];

        while(halfSize > buf.length) {
            buf = buf.concat(syms);
        }

        buf = buf.slice(0, halfSize);

        return buf.concat(buf).shuffle();
    },
    getSize: function() {
        var width = Math.floor(this._el.offsetWidth / this.cols) - this.padding,
            height = Math.floor(this._el.offsetHeight / this.rows) - this.padding;

        return {
            width: width,
            height: height,
            fontSize: height * 0.8
        }
    },
    findCage: function(x, y) {
        var cages = $$('.cage', this._el);
        for (var i = 0; i < cages.length; i++) {
            var cage = cages[i];
            var ds = cage.dataset;
            if (x == ds.x && y == ds.y) {
                return cage;
            }
        }

        return null;
    },
    openCage: function(x, y) {
        var cage = this.findCage(x, y),
            len = this._openedCages.length,
            xy = {x: x, y: y};

        cage.classList.add('cage_opened');
        $('.cage__back', cage).innerHTML = this.field[y][x];

        switch (len) {
            case 0:
            break;
            case 1:
                var sym1 = this.field[y][x],
                    sym2 = this.field[this._openedCages[0].y][this._openedCages[0].x];
                if (sym1 === sym2) {
                    this.removeOpenedCages();
                    this.removeCage(x, y);
                } else {
                    var openedCages = [xy].concat(this._openedCages);
                    this._openedCages = [];
                    setTimeout(function() {
                        this.closeOpenedCages(openedCages);
                    }.bind(this), 700);
                }

                xy = null;
            break;
            case 2:
                this.closeOpenedCages();
                this._openedCages = [];
            break;
        }

        xy && this._openedCages.push(xy);
    },
    closeOpenedCages: function(openedCages) {
        (openedCages || this._openedCages).forEach(function(cage) {
            this.closeCage(cage.x, cage.y);
        }, this);
    },
    removeOpenedCages: function() {
        this._openedCages.forEach(function(cage) {
            this.removeCage(cage.x, cage.y);
        }, this);

        this._openedCages = [];
    },
    removeCage: function(x, y) {
        var cage = this.findCage(x, y);
        if (cage) {
            cage.classList.add('cage_removed');
            this.info.cages--;
            this.info.update();

            setTimeout(function() {
                this._el.removeChild(cage);
            }.bind(this), 200);

            if (!this.info.cages) {
                this.finish();
            }
        }
    },
    closeCage: function(x, y) {
        var cage = this.findCage(x, y);
        if (cage) {
            cage.classList.remove('cage_opened');
            $('.cage__back', cage).innerHTML = '';
        }
    },
    initField: function() {
        var syms = this.getLevelSymbols(),
            s = 0;

        this.field = [];
        for (var y = 0; y < this.rows; y++) {
            var buf = [];
            for (var x = 0; x < this.cols; x++) {
                buf.push(syms[s]);
                s++;
            }

            this.field[y] = buf;
        }
    },
    info: {
        formatTime: function(ms) {
            var sec = Math.floor(ms / 1000),
                min = Math.floor(sec / 60),
                sec2 = sec - min * 60;

            return min + ':' + leadZero(sec2);
        },
        update: function() {
            this.currentTime = Date.now();
            $('.info__clicks-num', this._el).innerHTML = this.clicks;
            $('.info__cages-num', this._el).innerHTML = this.cages;
            $('.info__level-title', this._el).innerHTML = this.levelTitle;
            $('.info__time-num', this._el).innerHTML = this.formatTime(this.currentTime - this.startTime);
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
    },
    finish: function() {
        var maxLevel = App.settings.get('maxLevel');
        App.settings.set('maxLevel', Math.max(maxLevel, App.level + 1));

        this.info.stop();
    },
    show: function() {
        this._el.innerHTML = '';
        this._openedCages = [];
        this._level = App.settings.get('level');

        this.info.start(this._level, this.cols * this.rows);
        this.initField();
        this.addCages();
        this.resizeCages();

        /*for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                this.openCage(x, y);
            }
        }*/
    },
    hide: function() {
        this.info.stop();
    }
};
