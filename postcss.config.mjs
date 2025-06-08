// Caminho: postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Adiciona suporte para aninhamento de CSS, recomendado pelo Tailwind.
    'tailwindcss/nesting': {},

    // O plugin principal do Tailwind CSS.
    tailwindcss: {},

    autoprefixer: {},
  },
};

export default config;