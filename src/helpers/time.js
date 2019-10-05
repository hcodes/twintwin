export function leadZero(num) {
    return num < 10 ? '0' + num : num;
}

export function formatTime(ms) {
    const
        sec = Math.floor(ms / 1000),
        min = Math.floor(sec / 60),
        sec2 = sec - min * 60;

    return min + ':' + leadZero(sec2);
}
