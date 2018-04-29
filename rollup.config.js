import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'main.js',
    output: {
        file: 'dist/main.js',
        name: 'Feels',
        format: 'umd'
    },
    plugins: [
        babel(),
        resolve()
    ]
};