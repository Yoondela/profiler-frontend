// ✅ Correct
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({
      config: './tailwind.config.js', // optional if in root
    }),
    require('autoprefixer'),
  ],
}
