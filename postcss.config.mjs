// Caminho: postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Adiciona suporte para aninhamento de CSS, recomendado pelo Tailwind.
    'tailwindcss/nesting': {},

    // O plugin principal do Tailwind CSS.
    tailwindcss: {},

    // O plugin que adiciona automaticamente os prefixos de compatibilidade
    // para navegadores (-webkit-, -moz-, etc.).
    autoprefixer: {},
  },
};

export default config;