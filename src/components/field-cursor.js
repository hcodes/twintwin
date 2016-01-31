function FieldCursor(data) {
    this.elem = data.elem;

    this.width = data.width;
    this.height = data.height;

    this.padding = data.padding;
    
    this.cols = data.cols;
    this.rows = data.rows;

    this.x = data.x || 0;
    this.y = data.y || 0;

    if (data.hidden) {
        this.hide();
    } else {
        this.show();
    }
}

FieldCursor.prototype = {
    hide: function() {
        if (this.hidden !== true) {
            this.hidden = true;
            this.elem.classList.add('field-cursor_hidden');
        }
    },
    show: function() {
        if (this.hidden !== false) {
            this.hidden = false;
            this.elem.classList.remove('field-cursor_hidden');
            this.update();
        }
    },
    update: function() {
        this.size(this.width, this.height, this.padding);
    },
    size: function(width, height, padding) {
        this.width = width;
        this.height = height;
        this.padding = padding;

        console.log(width, height);
        $.size(this.elem, width, height);

        this.move(this.x, this.y);
    },
    move: function(kx, ky) {
        var x = this.x,
            y = this.y;

        if (kx) {
            x += kx;
        }

        if (ky) {
            y += ky;
        }

        if (x > this.cols - 1) {
            x = this.cols - 1;
        }
        
        if (x < 0) {
            x = 0;
        }

        if (y > this.rows - 1) {
            y = this.rows - 1;
        }

        if (y < 0) {
            y = 0;
        }

        this.x = x;
        this.y = y;

        $.move(
            this.elem,
            x * (this.width + this.padding),
            y * (this.height + this.padding)
        );
    },
    left: function() {
        this.show();
        this.move(-1, 0);
    },
    right: function() {
        this.show();
        this.move(1, 0);
    },
    up: function() {
        this.show();
        this.move(0, -1);
    },
    down: function() {
        this.show();
        this.move(0, 1);
    },
    getXY: function() {
        return {
            x: this.x,
            y: this.y
        };
    },
    destroy: function() {
        this.elem = null;
    }
};
