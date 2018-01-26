import {$} from './lib/dom';
import Page from './components/page';
import Settings from './components/settings';
import Field from './components/field';
import levels from './components/levels';
import gameOver from './components/game-over';

const Game = {
    name: 'game',
    locationHash: 'game',
    init(data) {
        this.elem = $('.game');

        const levelData = this.getLevelData();

        this._field = new Field({
            elem: $('.field', this.elem),
            rows: levelData.rows,
            cols: levelData.cols,
            levelData: levelData.data,
            control: 'any',
            infoPanel: true
        });

        this._onKeydown = this._onKeydown.bind(this);

        this._field.onFinish = function() {
            const maxLevel = Settings.get('maxLevel');
            Settings.set('maxLevel', Math.max(maxLevel, Settings.get('level') + 1));

            const panel = this.infoPanel;
            gameOver.show({
                errors: panel.errors || 1,
                time: Math.floor((Date.now() - panel.startTime) / 1000) || 1
            });
        };

        gameOver.on('click', (e, button) => {
            let level;

            switch(button) {
                case 'menu':
                    Page.show('main');
                    break;
                case 'next':
                    this.nextLevel();
                    break;
                case 'restart':
                    this.restart();
                    break;
            }
        });
    },
    getLevelData() {
        const data = levels.getLevel(Settings.get('level'));

        return {
            data,
            rows: data.rows || levels.defaultRows,
            cols: data.cols || levels.defaultCols
        };
    },
    _onKeydown(e) {
        if (e.key === 'Escape') {
            Page.back();
        }
    },
    restart() {
        this.hide();
        this.show();
    },
    nextLevel() {
        Settings.set('level', Settings.get('level') + 1);

        this.hide();
        this.show();
    },
    show() {
        const levelData = this.getLevelData();

        gameOver.hide();

        this._field.show({
            levelData: levelData.data,
            cols: levelData.cols,
            rows: levelData.rows
        });

        $.on(document, 'keydown', this._onKeydown);
    },
    hide() {
        this._field.hide();
        $.off(document, 'keydown', this._onKeydown);
    }
};
