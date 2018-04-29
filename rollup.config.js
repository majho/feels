import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'main.js',
    output: {
        file: 'dist/main.js',
        name: 'Feels',
        format: 'umd'
    },
    plugins: [
        commonjs(),
        babel()
    ]
};