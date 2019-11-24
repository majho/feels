import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';

export default {
    input: 'main.js',
    output: {
        file: 'dist/main.js',
        format: 'es',
        // name: 'Feels',
        // format: 'umd',
    },
    plugins: [
        commonjs(),
        babel(),
        filesize(),
    ],
};
