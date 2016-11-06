var dom = require('dom');
var $ = dom.$;
var $$ = dom.$$;
var levels = require('levels');
var FieldCursor = require('field-cursor');
var InfoPanel = require('info-panel');
var Gamepad = require('gamepad');

function Field(data) {
    this.elem = data.elem;
    this.cages = $('.field__cages', this.elem);

    this.padding = 5;
    this.levelData = data.levelData;

    this.rows = data.rows;
    this.cols = data.cols;

    this.field = [];
    this.cagesCount = this.cols * this.rows;

    this.fieldCursor = new FieldCursor({
        elem: $('.field-cursor', this.elem),
        hidden: true,
        cols: this.cols,
        rows: this.rows,
        padding: this.padding
    });

    this.infoPanel = new InfoPanel(this.elem);

    this.setEvents();
    this.setControl(data.control);
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
    setControl: function(type) {
        this.control = type;
        this.elem.dataset.control = type;
    },
    isControl: function(type) {
        return this.control === 'any' || this.control === type;
    },
    setMouseEvents: function() {
        $.delegate(this.cages, '.cage__front', 'mousedown', function(e) {
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
    createCages: function() {
        this.cages.innerHTML = '';

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

                this.cages.appendChild(cage);
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
        var syms = this.levelData.symbols,
            size = this.cols * this.rows,
            halfSize = size / 2,
            buf = [];

        while (halfSize > buf.length) {
            buf = buf.concat(syms);
        }

        buf = buf.slice(0, halfSize);

        return buf.concat(buf).shuffle();
    },
    getSize: function() {
        var width = Math.floor(this.cages.offsetWidth / this.cols) - this.padding,
            height = Math.floor(this.cages.offsetHeight / this.rows) - this.padding;

        return {
            width: width,
            height: height,
            fontSize: Math.min(width, height) * 0.7
        };
    },
    findCage: function(x, y) {
        var cages = $$('.cage', this.cages);
        for (var i = 0; i < cages.length; i++) {
            var cage = cages[i];
            var ds = cage.dataset;

            if (String(x) === String(ds.x) && String(y) === String(ds.y)) {
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
                    this.infoPanel.errors++;

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

        this.infoPanel.update();
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
            this.cagesCount--;
            this.infoPanel.update();

            setTimeout(function() {
                this.cages.removeChild(cage);
            }.bind(this), 200);

            if (!this.cagesCount) {
                this.infoPanel.stop();
                this.onFinish();
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
    show: function(data) {
        this.field = [];

        this.levelData = data.levelData;
        this.cols = data.cols;
        this.rows = data.rows;

        this.cagesCount = this.cols * this.rows;


        this.initField();
        this.createCages();
        this.resizeCages();

        this._openedCages = [];

        this.infoPanel.start(this.levelData);

        this.fieldCursor.cols = this.cols;
        this.fieldCursor.rows = this.rows;
        this.fieldCursor.reset();

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
