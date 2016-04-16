module.exports = {
    getTitle: function(levelData) {
        return levelData.titleSymbol + ' ' + levelData.name;
    },
    getLevel: function(n) {
        return this.data[n];
    },
    getRandomLevel: function() {
        var n = Math.floor(1 + Math.random() * (this.data.length - 1));
        return this.getLevel(n);
    },
    data: [
        {
            name: '',
            symbols: []
        },
        {
            name: 'Flowers and trees',
            titleSymbol: '💐',
            symbols: [
                '💐',
                '🌸',
                '🌷',
                '🍀',
                '🌹',
                '🌻',
                '🌺',
                '🍁',
                '🍃',
                '🍂',
                '🌿',
                '🌾',
                '🌵',
                '🌴',
                '🌲',
                '🌳',
                '🌰',
                '🌼',
                '💮'
            ]
        },
        {
            name: 'Fruits and vegetables',
            titleSymbol: '🍏',
            symbols: [
                '🌰',
                '🌱',
                '🍎',
                '🍏',
                '🍊',
                '🍋',
                '🍒',
                '🍇',
                '🍉',
                '🍓',
                '🍑',
                '🍈',
                '🍌',
                '🍐',
                '🍍',
                '🍠',
                '🍆',
                '🍅',
                '🌽'
            ]
        },
        {
            name: 'Zodiac Signs',
            titleSymbol: '♋',
            symbols: [
                '♈',
                '♉',
                '♊',
                '♋',
                '♌',
                '♍',
                '♎',
                '♏',
                '♐',
                '♑',
                '♒',
                '♓',
                '⛎'
            ]
        },
        {
            name: 'Accessories',
            titleSymbol: '👛',
            symbols: [
                '👑',
                '💼',
                '👜',
                '👝',
                '👛',
                '👓',
                '🎀',
                '🌂',
                '💄'
            ]
        },
        {
            name: 'Fashion',
            titleSymbol: '👗',
            symbols: [
                '🎩',
                '👒',
                '👟',
                '👞',
                '👡',
                '👠',
                '👢',
                '👕',
                '👔',
                '👚',
                '👗',
                '🎽',
                '👖',
                '👘',
                '👙'
            ]
        },
        {
            name: 'Buildings',
            titleSymbol: '🏢',
            symbols: [
                '🏠',
                '🏡',
                '🏫',
                '🏢',
                '🏣',
                '🏥',
                '🏦',
                '🏪',
                '🏩',
                '🏨',
                '💒',
                '⛪',
                '🏬',
                '🏤',
                '🌇',
                '🌆',
                '🏯',
                '🏰',
                '⛺',
                '🏭',
                '🗼',
                '🗾',
                '🗻',
                '🌄',
                '🌅',
                '🌃',
                '🗽',
                '🌉',
                '🎠',
                '🎡',
                '⛲',
                '🎢'
            ]
        },
        {
            name: 'Trains',
            titleSymbol: '🚄',
            symbols: [
                '🚂',
                '🚊',
                '🚉',
                '🚞',
                '🚆',
                '🚄',
                '🚅',
                '🚈',
                '🚇',
                '🚝',
                '🚋',
                '🚃'
            ]
        },
        {
            name: 'Hand Signs',
            titleSymbol: '👌',
            bg: false,
            symbols: [
                '👍',
                '👎',
                '👌',
                '👊',
                '✊',
                '✌',
                '👋',
                '✋',
                '👐',
                '👆',
                '👇',
                '👉',
                '👈',
                '🙌',
                '🙏',
                '☝',
                '👏',
                '💪'
            ]
        },
        {
            name: 'Arrows',
            titleSymbol: '↗',
            bg: false,
            symbols: [
                '⬇',
                '⬅',
                '➡',
                '↗',
                '↖',
                '↘',
                '↙',
                '↔',
                '↕',
                '🔄',
                '◀',
                '▶',
                '🔼',
                '🔽',
                '↩',
                '↪',
                '⏪',
                '⏩',
                '⏫',
                '⏬',
                '⤵',
                '⤴',
                '🔀',
                '🔃',
                '🔺',
                '🔻',
                '⬆'
            ]
        },
        {
            name: 'Technology',
            titleSymbol: '📀',
            symbols: [
                '🎥',
                '📷',
                '📹',
                '📼',
                '💿',
                '📀',
                '💽',
                '💾',
                '💻',
                '📱',
                '☎',
                '📞',
                '📟',
                '📠',
                '📡',
                '📺',
                '📻'
            ]
        },
        {
            name: 'Sport',
            titleSymbol: '🏀',
            symbols: [
                '🎯',
                '🏈',
                '🏀',
                '⚽',
                '⚾',
                '🎾',
                '🎱',
                '🏉',
                '🎳',
                '⛳',
                '🚵',
                '🚴',
                '🏁',
                '🏇',
                '🏆',
                '🎿',
                '🏂',
                '🏊',
                '🏄',
                '🎣'
            ]
        },
        {
            name: 'Games and Hobbies',
            titleSymbol: '🎨',
            symbols: [
                '🎨',
                '🎬',
                '🎤',
                '🎧',
                '🎼',
                '🎵',
                '🎶',
                '🎹',
                '🎻',
                '🎺',
                '🎷',
                '🎸',
                '👾',
                '🎮',
                '🃏',
                '🎴',
                '🀄',
                '🎲'
            ]
        }
    ]
};
