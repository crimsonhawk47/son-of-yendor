import rectangle from '~/utils/rectangle';
import requiredProp from '~/utils/requiredProp';

import { LOAD_LEVEL } from '~/actions/data/levels/types';

import {
    GAME_WIDTH,
    GAME_HEIGHT,
    CELL_WIDTH,
    CELL_HEIGHT,
    CELL_PADDING,
    FONT_SIZE,
} from '~/constants';

const createRenderCells = ({
    node = requiredProp('node'),
    width = GAME_WIDTH,
    height = GAME_HEIGHT,
}) => {
    Object.assign(node.style, {
        width: width * CELL_WIDTH,
        height: height * CELL_HEIGHT,
        backgroundColor: 'black',
        fontFamily: 'VideoTerminalScreen',
        position: 'absolute',
        fontSize: `${FONT_SIZE}px`,
        textAlign: 'center',
    });

    const cells = rectangle({ width, height })
        .reduce((cells = {}, { x, y }) => {
            const cell = document.createElement('div');
            Object.assign(cell.style, {
                position: 'absolute',
                width: CELL_WIDTH,
                height: CELL_HEIGHT,
                left: x * CELL_WIDTH,
                top: y * CELL_HEIGHT,
                padding: `${CELL_PADDING}px`,
            });
            node.appendChild(cell);
            return Object.assign(cells, { [`${x},${y}`]: cell });
        });
    return cells;
};

export function drawCell({
    x = requiredProp('x'),
    y = requiredProp('y'),
    cells = requiredProp('cells'),

    character = '.',
    foregroundColor = 'white',
    backgroundColor = 'black',
}) {
    const cell = cells[`${x},${y}`];
    Object.assign(cell.style, {
        color: foregroundColor,
        backgroundColor,
    });
    cell.innerHTML = character;
}

export function drawLevel({
    cells = requiredProp('cells'),
    level = requiredProp('level'),
}) { 
    Object.keys(level.tiles).forEach((tile) => {
        const [x, y] = tile.split(',');
        drawCell({
            x,
            y: Number(y) + 2,
            character: (level.tiles[tile] === 'floor') ? '.' : '#',
            cells,
        });
    });
}

const createRenderer = ({
    width,
    height,
    node = requiredProp('node'),
    store = requiredProp('store'),
}) => {
    const cells = createRenderCells({ width, height, node });
    const listenerDefinitions = [
        {
            actions: [LOAD_LEVEL],
            callback: ({ id }, state) => drawLevel({
                cells,
                level: state.data.levels[id],
            }),
        },   
    ];
    const listeners = listenerDefinitions.map(
        ({ actions, callback }) => store.listen(actions, callback),
    );

    return () => {
        node.innerHTML = '';
        listenerDefinitions.forEach(({ actions }, i) => {
            store.stopListening(actions, listeners[i]);
        });
    };
};

export default createRenderer;
