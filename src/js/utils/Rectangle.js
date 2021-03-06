import requiredProp from '~/utils/requiredProp';

export default function({
    x = 0,
    y = 0,
    width = requiredProp('width'),
    height = requiredProp('height')
}) {
    const left = x;
    const top = y;
    const right = x + width;
    const bottom = y + height;
    return {
        get left() {
            return x;
        },

        get top() {
            return y;
        },

        get right() {
            return right;
        },

        get bottom() {
            return bottom;
        },

        get width() {
            return this.right - this.left;
        },

        get height() {
            return this.bottom - this.top;
        },

        forEach(callback) {
            for (let ix = left; ix < right; ix++) {
                for (let iy = top; iy < bottom; iy++) {
                    callback({ x: ix, y: iy });
                }
            }
        },

        reduce(reducer, initialValue) {
            let value = initialValue;
            this.forEach(coordinates => (value = reducer(value, coordinates)));
            return value;
        },

        contains({ x, y }) {
            return (
                x >= this.left &&
                x < this.right &&
                y >= this.top &&
                y < this.bottom
            );
        }
    };
}
