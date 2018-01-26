export default {
    defaultRows: 5,
    defaultCols: 6,
    getTitle(levelData) {
        return levelData.titleSymbol + ' ' + levelData.name;
    },
    getLevel(n) {
        return this.data[n];
    },
    getRandomLevel() {
        const num = Math.floor(1 + Math.random() * (this.data.length - 1));
        return this.getLevel(num);
    },
    data: [
        {
            name: '',
            symbols: []
        },
        {
            name: 'Headwear',
            titleSymbol: '👒',
            cols: 2,
            rows: 2,
            symbols: ['👑', '👒', '🎩', '🎓']
        },
        {
            name: 'Shoes',
            titleSymbol: '👠',
            cols: 3,
            rows: 2,
            symbols: ['👟', '👞', '👡', '👠', '👢']
        },
        {
            name: 'Accessories',
            titleSymbol: '👛',
            cols: 4,
            rows: 3,
            symbols: ['👑', '💼', '👜', '👝', '👛', '👓', '🎀', '🌂', '💄']
        },
        {
            name: 'Numerals',
            titleSymbol: '3',
            cols: 4,
            rows: 3,
            symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        },
        {
            name: 'Vegetables',
            titleSymbol: '🥕',
            cols: 4,
            rows: 4,
            symbols: ['🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🌰']
        },
        {
            name: 'Trains',
            titleSymbol: '🚄',
            cols: 4,
            rows: 4,
            symbols: ['🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚃']
        },
        {
            name: 'Drinks',
            titleSymbol: '🍷',
            cols: 5,
            rows: 4,
            symbols: ['🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂']
        },
        {
            name: 'Fruits',
            titleSymbol: '🍏',
            cols: 5,
            rows: 4,
            symbols: ['🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝']
        },
        {
            name: 'Flowers and trees',
            titleSymbol: '💐',
            cols: 6,
            rows: 4,
            symbols: ['💐', '🌸', '🌷', '🍀', '🌹', '🌻', '🌺', '🍁', '🍃', '🍂', '🌿', '🌾', '🌵', '🌴', '🌲', '🌳', '🌰', '🌼', '💮']
        },
        {
            name: 'Zodiac Signs',
            titleSymbol: '♋',
            cols: 6,
            rows: 4,
            symbols: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎']
        },
        {
            name: 'Sweets',
            titleSymbol: '♋',
            cols: 6,
            rows: 4,
            symbols: ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🍫', '🍬', '🍭', '🍮', '🍯']
        },
        {
            name: 'Fashion',
            titleSymbol: '👗',
            symbols: ['🎩', '👒',  '👢', '👕', '👔', '👚', '👗', '🎽', '👖', '👘', '👙']
        },
        {
            name: 'Buildings',
            titleSymbol: '🏢',
            symbols: ['🏠', '🏡', '🏫', '🏢', '🏣', '🏥', '🏦', '🏪', '🏩', '🏨', '💒', '⛪', '🏬', '🏤', '🌇', '🌆',
                '🏯', '🏰', '⛺', '🏭', '🗼', '🗾', '🗻', '🌄', '🌅', '🌃', '🗽', '🌉', '🎠', '🎡', '⛲', '🎢'
            ]
        },
        {
            name: 'People',
            titleSymbol: '👨',
            symbols: [
                '👦', '👧', '👨', '👩', '👴', '👵', '👶', '👼', '🎅', '🤶',
                '👸', '🤴', '👰', '🤵', '🤰', '👲', '🙍', '💃', '🕺', '👪'
            ]
        },
        {
            name: 'Currency',
            titleSymbol: '€',
            bg: false,
            symbols: ['₳', '฿', '₡', '₢', '€', '£', '₤', '₣', 'ƒ', '₲', '₭', 'Ł', '₥', '₦', '₽', '₱', '$', '₮', '₩', '￦', '¥', '¤']
        },
        {
            name: 'Roman numbers',
            titleSymbol: 'Ⅸ',
            bg: false,
            symbols: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ', 'Ⅼ', 'Ⅽ', 'Ⅾ', 'Ⅿ', 'ↀ', 'ↁ', 'ↂ', 'ↇ', 'ↈ']
        },
        {
            name: 'Hand Signs',
            titleSymbol: '👌',
            bg: false,
            symbols: ['👍', '👎', '👌', '👊', '✊', '✌', '👋', '✋', '👐', '👆', '👇', '👉', '👈', '🙌', '🙏', '☝', '👏', '💪']
        },
        {
            name: 'Arrows',
            titleSymbol: '↗',
            bg: false,
            symbols: [
                '⬇', '⬅', '➡', '↗', '↖', '↘', '↙','↔','↕', '🔄', '◀', '▶', '🔼', '🔽',
                '↩', '↪', '⏪', '⏩', '⏫', '⏬', '⤵', '⤴', '🔀', '🔃', '🔺', '🔻', '⬆'
            ]
        },
        {
            name: 'Food',
            titleSymbol: '🍞',
            symbols: [
                '🍞', '🥐', '🥖', '🥞', '🧀', '🍖', '🍗', '🥓', '🍔', '🍟', '🍕', '🌭', '🌮', '🌯', '🍳',
                '🍲', '🥗', '🍿', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡'
            ]
        },
        {
            name: 'Stars',
            titleSymbol: '✯',
            bg: false,
            symbols: [
                '★', '☆', '✪', '✯', '✡', '✵', '❉', '❋', '✹', '✸', '✶', '✷', '✵', '✳', '✲', '✱',
                '✧', '✦', '⍟', '⊛', '🔯', '🌠', '🌟', '﹡', '❃', '❂', '✻', '⍣', '✭', '≛', '*', '٭'
            ]
        },
        {
            name: 'Technology',
            titleSymbol: '📀',
            symbols: ['🎥', '📷', '📹', '📼', '💿', '📀', '💽', '💾', '💻', '📱', '☎', '📞', '📟', '📠', '📡', '📺', '📻']
        },
        {
            name: 'Sport',
            titleSymbol: '🏀',
            symbols: ['🎯', '🏈', '🏀', '⚽', '⚾', '🎾', '🎱', '🏉', '🎳', '⛳', '🚵', '🚴', '🏁', '🏇', '🏆', '🎿', '🏂', '🏊', '🏄', '🎣']
        },
        {
            name: 'Games and Hobbies',
            titleSymbol: '🎨',
            symbols: ['🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🎻', '🎺', '🎷', '🎸', '👾', '🎮', '🃏', '🎴', '🀄', '🎲']
        }
    ]
};
