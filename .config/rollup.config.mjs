import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: `src/index.js`,
    output: [
        {
            file: `static/index.js`,
            format: 'umd',
        },
    ],
    plugins: [
        nodeResolve(),
        postcss({
            config: true,
            extract: path.resolve(`static/index.css`),
            plugins: [
                ...(isProduction ? [
                    autoprefixer,
                    cssnano,
                ] : []),
            ],
        }),
        babel({ babelHelpers: 'bundled' }),
        isProduction ? terser() : undefined,
    ]
}
