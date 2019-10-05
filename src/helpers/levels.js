import data from '../levels';

export default {
    data,
    defaultRows: 5,
    defaultCols: 6,
    getTitle(levelData) {
        return levelData.titleSymbol + ' ' + levelData.name;
    },
    getLevel(num) {
        return data[num];
    },
    getRandomLevel() {
        const num = Math.floor(1 + Math.random() * (this.data.length - 1));
        return this.getLevel(num);
    }
};
