
  module.export = [
    {
      ignores: ['node_modules/**', 'dist/**', 'build/**'],  // Files and folders to ignore
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-unused-vars': 'warn',  // Example of adding a custom rule
        // Add more rules as necessary
      },
      languageOptions: {
        ecmaVersion: 'latest', // Set the ECMAScript version
        sourceType: 'module',  // Use ES modules
        parserOptions: {
          project: './tsconfig.json',
        },
      },
      plugins: {
        prettier: require('eslint-plugin-prettier'),
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      },
    },
  ];