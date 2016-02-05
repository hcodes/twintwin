module.exports = {
    leadZero: function(num) {
        return num < 10 ? '0' + num : num;
    },
    formatTime: function(ms) {
        var sec = Math.floor(ms / 1000),
            min = Math.floor(sec / 60),
            sec2 = sec - min * 60;

        return min + ':' + this.leadZero(sec2);
    }
};
