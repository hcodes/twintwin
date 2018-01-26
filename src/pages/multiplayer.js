import {$} from './lib/dom';
import Field from './components/field';
import UserPanel './components/user-panel';
import Settings from './components/settings';
import levels from './components/levels';
import isMobile from './lib/is-mobile';

import SelectControls from './components/elect-controls';

const MultiplayerPage = {
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init(data) {
        this.elem = $('.multiplayer');

        this._levelData = levels.getRandomLevel();

        const rows = 5;
        const cols = 6;

        const fieldOneElem = $('.field_one', this.elem);
        this._fieldOne = new Field({
            elem: fieldOneElem,
            cols,
            rows,
            levelData: this._levelData,
            //control: isMobile ? '*' : 'keyboard',
            control: SelectControls.getPlayerControl(0),
            infoPanel: false,
            userPanel: new UserPanel(fieldOneElem, {num: 1})
        });

        const fieldTwoElem = $('.field_two', this.elem);
        this._fieldTwo = new Field({
            elem: fieldTwoElem,
            cols,
            rows,
            levelData: this._levelData,
            control: SelectControls.getPlayerControl(1),
            infoPanel: false,
            userPanel: new UserPanel(fieldTwoElem, {num: 2})
        });

        this._onKeydown = this._onKeydown.bind(this);

        SelectControls.on('change', (e, data) => {
            if (data.playerNum === 0) {
                this._fieldOne.setControl(data.control);
            }

            if (data.playerNum === 1) {
                this._fieldTwo.setControl(data.control);
            }
        });
    },
    _onKeydown(e) {
        if (e.key === 'Escape') {
            this._onExit();
        }
    },
    getLevelData() {
        const data = levels.getLevel(Settings.get('level'));

        return {
            data,
            rows: data.rows || levels.defaultRows,
            cols: data.cols || levels.defaultCols
        };
    },
    show() {
        const levelData = this.getLevelData(),
            data = {
                levelData: levelData.data,
                cols: levelData.cols,
                rows: levelData.rows
            };

        this._fieldOne.show(data);
        this._fieldTwo.show(data);

        $.on(document, 'keydown', this._onKeydown);
    },
    hide() {
        this._fieldOne.hide();
        this._fieldTwo.hide();

        $.off(document, 'keydown', this._onKeydown);
    }
};

export default MultiplayerPage;
