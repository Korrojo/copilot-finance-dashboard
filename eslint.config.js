import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Temporarily allow any types in chart/report components during development
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unused vars prefixed with underscore
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      // Allow lexical declarations in case blocks
      'no-case-declarations': 'warn',
      // Relax React refresh rules for utility exports
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Allow empty interfaces (for extending types)
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },
])
