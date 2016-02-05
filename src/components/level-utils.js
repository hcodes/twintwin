var levels = require('levels');

module.exports = {
    levelTitle: function(level) {
        var levelObj = levels[level];
        return this.levelSymbol(level) + ' ' + levelObj.name;
    },
    levelSymbol: function(level) {
        var levelObj = levels[level];
        return levelObj.titleSymbol;
    }
};
