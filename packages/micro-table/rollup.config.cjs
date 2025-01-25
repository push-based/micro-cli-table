const {withNx} = require('@nx/rollup/with-nx');

module.exports = withNx(
    {
        main: './src/index.ts',
        outputPath: '../../dist/micro-table',
        tsConfig: './tsconfig.lib.json',
        compiler: 'swc',
        format: ['cjs', 'esm'],
        assets: [{input: '.', output: '.', glob: '*.md'}],
        additionalEntryPoints: [
            './src/lib/table.ts',
            './src/lib/border.format.ts',
            './src/lib/alignment.format.ts'
        ]
    },
    {
        // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
        // e.g.
        // output: { sourcemap: true },
        perf: true,
        treeshake: true
    }
);
