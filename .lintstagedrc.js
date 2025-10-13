module.exports = {
  './src/**/*.ts?(x)': () => 'tsc --project tsconfig.json --pretty --noEmit',
  './src/**/*.css': (filenames) => `prettier --write ${filenames.join(' ')}`,
  './src/**/*.{ts,tsx}': (filenames) => [`prettier --write ${filenames.join(' ')}`, `eslint ${filenames.join(' ')} --ext .ts,.tsx --fix`],
}