import {$, $$} from '../lib/dom';

import FieldCursor from './field-cursor';
import InfoPanel from './info-panel';
import Gamepad from './gamepad';

export default class Field {
    constructor(data) {
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

    setEvents() {
        this.setKeyboardEvents();
        this.setMouseEvents();
        this.setGamepadEvents();

        $.on(window, 'resize', function() {
            if (!this.isHidden) {
                this.resizeCages();
            }
        }.bind(this));
    }

    setControl(type) {
        this.control = type;
        this.elem.dataset.control = type;
    }

    isControl(type) {
        return this.control === 'any' || this.control === type;
    }

    setMouseEvents() {
        $.delegate(this.cages, '.cage__front', 'mousedown', e => {
            if (!this.isControl('mouse')) {
                return;
            }

            this.fieldCursor.hide();

            const
                cage = e.target.parentNode,
                ds = cage.dataset;

            this.openCage(ds.x, ds.y);
        });
    }

    setKeyboardEvents() {
        $.on(document, 'keydown', e => {
            if (this.isControl('keyboard1')) {
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
                    case 'Enter':
                        this.openCageWithCursor();
                        break;
                }
            }

            if (this.isControl('keyboard2')) {
                switch (e.key) {
                    case 'W':
                        this.fieldCursor.up();
                        break;
                    case 'A':
                        this.fieldCursor.left();
                        break;
                    case 'D':
                        this.fieldCursor.right();
                        break;
                    case 'S':
                        this.fieldCursor.down();
                        break;
                    case ' ':
                }
            }
        });
    }

    setGamepadEvents() {
        Gamepad
            .onbutton('left', () => {
                if (this.isControl('gamepad')) {
                    this.fieldCursor.left();
                }
            })
            .onbutton('right', () => {
                if (this.isControl('gamepad')) {
                    this.fieldCursor.right();
                }
            })
            .onbutton('up', () => {
                if (this.isControl('gamepad')) {
                    this.fieldCursor.up();
                }
            })
            .onbutton('down', () => {
                if (this.isControl('gamepad')) {
                    this.fieldCursor.down();
                }
            })
            .onbuttons(
                ['yellow', 'blue', 'green'],
                function() {
                    if (this.isControl('gamepad')) {
                        this.openCageWithCursor();
                    }
                }.bind(this)
            );
    }

    createCages() {
        this.cages.innerHTML = '';

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const cage = $.js2dom({
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
    }

    resizeCages() {
        const size = this.getSize();
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                let cage = this.findCage(x, y);
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
    }

    getLevelSymbols() {
        const
            syms = this.levelData.symbols,
            size = this.cols * this.rows,
            halfSize = size / 2;

        let buf = [];

        while (halfSize > buf.length) {
            buf = buf.concat(syms);
        }

        buf = buf.slice(0, halfSize);

        return buf.concat(buf).shuffle();
    }

    getSize() {
        const
            width = Math.floor(this.cages.offsetWidth / this.cols) - this.padding,
            height = Math.floor(this.cages.offsetHeight / this.rows) - this.padding;

        return {
            width,
            height,
            fontSize: Math.min(width, height) * 0.7
        };
    }

    findCage(x, y) {
        const cages = $$('.cage', this.cages);
        for (let i = 0; i < cages.length; i++) {
            let cage = cages[i];
            let ds = cage.dataset;

            if (String(x) === String(ds.x) && String(y) === String(ds.y)) {
                return cage;
            }
        }

        return null;
    }

    openCageWithCursor() {
        const xy = this.fieldCursor.getXY();
        this.openCage(xy.x, xy.y);
    }

    openCage(x, y) {
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

                    var openedCages = [ xy ].concat(this._openedCages);
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
    }

    closeOpenedCages(openedCages) {
        (openedCages || this._openedCages).forEach(function(cage) {
            this.closeCage(cage.x, cage.y);
        }, this);
    }

    removeOpenedCages() {
        this._openedCages.forEach(function(cage) {
            this.removeCage(cage.x, cage.y);
        }, this);

        this._openedCages = [];
    }

    removeCage(x, y) {
        const cage = this.findCage(x, y);
        if (cage) {
            cage.classList.add('cage_removed');
            this.cagesCount--;
            this.infoPanel.update();

            setTimeout(() => {
                this.cages.removeChild(cage);
            }, 200);

            if (!this.cagesCount) {
                this.infoPanel.stop();
                this.onFinish();
            }
        }
    }

    closeCage(x, y) {
        const cage = this.findCage(x, y);
        if (cage) {
            cage.classList.remove('cage_opened');
            $('.cage__back', cage).innerHTML = '';
        }
    }

    initField() {
        const syms = this.getLevelSymbols();
        let s = 0;

        this.field = [];
        for (let y = 0; y < this.rows; y++) {
            let buf = [];
            for (let x = 0; x < this.cols; x++) {
                buf.push(syms[s]);
                s++;
            }

            this.field[y] = buf;
        }
    }

    show(data) {
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
    }

    hide() {
        this.isHidden = true;
        this.infoPanel.stop();
    }
}
