import { resolve } from 'path';
import { defineConfig } from 'vite';

// This file exists because our site has more than one HTML page
// (home, cart, checkout, product pages, and now product listing),
// and Vite needs to be told about every single page by name.
// Without an entry here, Vite doesn't know a page exists, and it
// won't build or serve it correctly.
export default defineConfig({
  // This tells Vite that all of our actual site files live inside
  // the "src" folder, instead of the very top level of the project.
  root: 'src/',

  build: {
    // This is where Vite puts the finished, production-ready version
    // of the site once we build it for real (not just local testing).
    outDir: '../dist',

    rollupOptions: {
      // Each line below is one page of our site. The name on the left
      // (main, cart, checkout, product, productListing) is just a
      // label Vite uses internally - what matters is the file path
      // on the right, which has to point to the exact real location
      // of that page's index.html file.
      input: {
        // The homepage
        main: resolve(__dirname, 'src/index.html'),

        // The cart page
        cart: resolve(__dirname, 'src/cart/index.html'),

        // The checkout page
        checkout: resolve(__dirname, 'src/checkout/index.html'),

        // The product detail page (shows one product at a time)
        product: resolve(__dirname, 'src/product_pages/index.html'),

        // NEW: the product listing page (shows a whole category of
        // products at once) - this is the page we just built for
        // the Individual Activity, so Vite needs to know about it too
        productListing: resolve(
          __dirname,
          'src/product_listing/index.html',
        ),
      },
    },
  },
});