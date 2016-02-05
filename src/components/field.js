var dom = require('dom'),
    $ = dom.$,
    $$ = dom.$$,
    levels = require('levels'),
    Settings = require('settings'),
    FieldCursor = require('field-cursor'),
    InfoPanel = require('info-panel'),
    Gamepad = require('gamepad');

function Field(data) {
    this.elem = $('.field__cages', data.elem);

    this.control = data.control;
    this.cols = data.cols;
    this.rows = data.rows;
    this.padding = 5;

    this.field = [];

    this.fieldCursor = new FieldCursor({
        elem: $('.field-cursor', data.elem),
        hidden: true,
        cols: this.cols,
        rows: this.rows,
        padding: this.padding
    });

    this.infoPanel = new InfoPanel(data.elem);

    this.setEvents();
}

Field.prototype = {
    setEvents: function() {
        this.setKeyboardEvents();
        this.setMouseEvents();
        this.setGamepadEvents();

        $.on(window, 'resize', function() {
            if (!this.isHidden) {
                this.resizeCages();
            }
        }.bind(this));
    },
    isControl: function(type) {
        return this.control === '*' || this.control === type;
    },
    setMouseEvents: function() {
        $.delegate(this.elem, '.cage__front', 'mousedown', function(e) {
            if (!this.isControl('mouse')) {
                return;
            }

            this.fieldCursor.hide();

            var cage = e.target.parentNode,
                ds = cage.dataset;

            this.openCage(ds.x, ds.y);
        }.bind(this));
    },
    setKeyboardEvents: function() {
        $.on(document, 'keydown', function(e) {
            if (!this.isControl('keyboard')) {
                return;
            }

            switch (e.key) {
                case 'ArrowUp':
                    this.fieldCursor.up();
                break;
                case 'ArrowLeft':
                    this.fieldCursor.left();
                break;
                case 'ArrowRight':
                    this.fieldCursor.right();
                break;
                case 'ArrowDown':
                    this.fieldCursor.down();
                break;
                case ' ':
                case 'Enter':
                    this.openCageWithCursor();
                break;
            }
        }.bind(this));
    },
    setGamepadEvents: function() {
        Gamepad.onbutton('left', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.left();
            }
        }.bind(this));

        Gamepad.onbutton('right', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.right();
            }
        }.bind(this));

        Gamepad.onbutton('up', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.up();
            }
        }.bind(this));

        Gamepad.onbutton('down', function() {
            if (this.isControl('gamepad')) {
                this.fieldCursor.down();
            }
        }.bind(this));

        Gamepad.onbuttons(
            ['yellow', 'blue', 'green'],
            function() {
                if (this.isControl('gamepad')) {
                    this.openCageWithCursor();
                }
            }.bind(this)
        );
    },
    addCages: function() {
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = $.js2dom({
                    cl: 'cage',
                    'data-x': x,
                    'data-y': y,
                    c: [
                        {cl: 'cage__front'},
                        {cl: 'cage__back emoji'}
                    ]
                });

                this.elem.appendChild(cage);
            }
        }
    },
    resizeCages: function() {
        var size = this.getSize();
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                var cage = this.findCage(x, y);
                cage && $.css(cage, {
                    width: size.width + 'px',
                    height: size.height + 'px',
                    left: x * (size.width + this.padding) + 'px',
                    top: y * (size.height + this.padding) + 'px',
                    lineHeight: size.height + 'px',
                    fontSize: size.fontSize + 'px'
                });
            }
        }

        this.fieldCursor.size(size.width, size.height, this.padding);
    },
    getLevelSymbols: function() {
        var level = this._level,
            syms = levels[level].symbols,
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
        var width = Math.floor(this.elem.offsetWidth / this.cols) - this.padding,
            height = Math.floor(this.elem.offsetHeight / this.rows) - this.padding;

        return {
            width: width,
            height: height,
            fontSize: height * 0.8
        }
    },
    findCage: function(x, y) {
        var cages = $$('.cage', this.elem);
        for (var i = 0; i < cages.length; i++) {
            var cage = cages[i];
            var ds = cage.dataset;
            if (x == ds.x && y == ds.y) {
                return cage;
            }
        }

        return null;
    },
    openCageWithCursor: function() {
        var xy = this.fieldCursor.getXY();
        this.openCage(xy.x, xy.y);
    },
    openCage: function(x, y) {
        var cage = this.findCage(x, y),
            len = this._openedCages.length,
            xy = {x: x, y: y};

        if (!cage || cage.classList.contains('cage_opened')) {
            return;
        }

        this.infoPanel.clicks++;
        this.infoPanel.update();

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
            this.infoPanel.cages--;
            this.infoPanel.update();

            setTimeout(function() {
                this.elem.removeChild(cage);
            }.bind(this), 200);

            if (!this.infoPanel.cages) {
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
    finish: function() {
        var maxLevel = Settings.get('maxLevel');
        Settings.set('maxLevel', Math.max(maxLevel, Settings.level + 1));

        this.infoPanel.stop();
    },
    show: function() {
        this.elem.innerHTML = '';
        this._openedCages = [];
        this._level = Settings.get('level');

        this.infoPanel.start(this._level, this.cols * this.rows);
        this.initField();
        this.addCages();
        this.resizeCages();

        /*for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                this.openCage(x, y);
            }
        }*/

        this.isHidden = false;
    },
    hide: function() {
        this.isHidden = true;
        this.infoPanel.stop();
    }
};

module.exports = Field;
