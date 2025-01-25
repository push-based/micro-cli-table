import {defineConfig} from 'vite';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import {nxCopyAssetsPlugin} from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
    root: './packages/micro-table',
    cacheDir: '../node_modules/.vite/micro-table',
    plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
      test: {
        watch: false,
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../coverage/micro-table/unit',
            provider: 'v8',
            reporter: ['lcov']
        },
    },
});
