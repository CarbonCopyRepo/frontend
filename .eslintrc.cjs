module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'tailwind.config.js',
    'babel.config.js',
    'postcss.config.js',
    'playwright.config.ts',
    'playwright/**/*.ts', // Exclude all TypeScript files in the playwright directory
  ],  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-refresh',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/features/*/*'],
      },
    ],
    'react/react-in-jsx-scope': 'off', // React's new JSX transform doesn't require React to be in scope
    '@typescript-eslint/no-non-null-assertion': 'off', // If you use non-null assertions and are okay with it
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      // Target only TypeScript files with TypeScript-specific linting
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // Apply specific rules to JavaScript and configuration files
      files: ['*.js', '*.jsx', '*.config.js', 'playwright/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Example: Turn off TypeScript-specific rules for JS files
      },
    },
  ],
};
