import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  // Point directly to your TypeScript file
  input: './src/random-tables.ts',
  output: {
    dir: 'dist',
    format: 'es',       // Outputs standard browser-ready ES Modules
    sourcemap: true,    // Optional: useful for debugging original TS code
  },
  plugins: [
    // Resolves third-party lit / open-wc imports from node_modules
    nodeResolve(),
    // Compiles your TypeScript files on the fly
    typescript(),
  ],
};
