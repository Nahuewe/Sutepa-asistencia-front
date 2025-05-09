module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'standard',
    'standard-jsx'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },  
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['react-refresh', 'import'],
  rules: {
    'import/order': ['warn', {
      'groups': ['builtin', 'external', 'internal'],
      'alphabetize': { order: 'asc', caseInsensitive: true }
    }],
    'import/no-duplicates': 'warn',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'camelcase': 'off'
  }
};
