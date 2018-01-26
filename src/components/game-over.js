import {$} from '../lib/dom';
import {format} from '../lib/number';

import Component from './component';

export default Component.create({
    init() {
        this.setDomEvents([
            ['.game-over__restart', 'click', () => {
                this.trigger('click', 'restart');
            }],
            ['.game-over__next', 'click', () => {
                this.trigger('click', 'next');
            }]
        ]);
    },
    updateScore(value) {
        $('.game-over__score-i').innerHTML = format(value);
    },
    show(data) {
        $.show('.game-over');
        this.calcScore(data);
    },
    hide() {
        $.hide('.game-over');
    },
    calcScore(data) {
        const value = Math.floor(1e6 / data.errors / Math.log(data.time + 3));

        for (let i = 0; i < 10; i++) {
            let score = Math.floor(value * i / 10);
            setTimeout(() => {
                this.updateScore(score);
            }, i * 100);
        }
    }
});
