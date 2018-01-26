import {$} from './lib/dom';
import levels from './levels';
import {formatTime} from './lib/date-time';

export default class InfoPanel {
    constructor(container) {
        this.container = container;
        this.elem = $.js2dom(this.build());
        this.container.appendChild(this.elem);
    }

    build() {
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
    }

    update() {
        this.currentTime = Date.now();

        this.updatePart('errors-num', this.errors);
        this.updatePart('time-num', formatTime(this.currentTime - this.startTime));
    }

    updatePart(name, value) {
        $('.info-panel__' + name, this.elem).innerHTML = value;
    }

    start(levelData) {
        this.stop();

        this.errors = 0;
        this.levelTitle = levels.getTitle(levelData);
        this.startTime = Date.now();

        this.update();
        this._timer = setInterval(this.update.bind(this), 500);
    }

    stop() {
        this._timer && clearInterval(this._timer);
        this._timer = null;
    }
}
