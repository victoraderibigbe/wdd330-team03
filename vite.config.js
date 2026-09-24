import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        cart: resolve(__dirname, 'src/cart/index.html'),
        checkout: resolve(__dirname, 'src/checkout/index.html'),
        // PLAIN ENGLISH: Adds the new order-confirmed page to the live site's "packing list."
        // LOGIC: Same pattern as every other page listed here: a short label, then the file's path.
        //        The page itself is the file we just created in the checkout folder.
        // WHY WE NEED IT: Without this, the page works locally but shows an error on Render.
        // LEARNING GAP: npm run start serves every page it finds. npm run build (what Render
        //               runs) only includes the pages listed here.
        success: resolve(__dirname, 'src/checkout/success.html'),
        product: resolve(
          __dirname,
          'src/product_pages/index.html',
        ),
        product_listing: resolve(__dirname, 'src/product_listing/index.html'),
      },
    },
  },
});