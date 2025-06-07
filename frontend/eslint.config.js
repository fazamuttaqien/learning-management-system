import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-key': 'off',
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],
      'no-unsafe-optional-chaining': 'off',
      'no-undef': 'warn',
      // 'react/no-unescaped-entities': 'off',
      // 'react/jsx-uses-react': 'off',
      // 'react/react-in-jsx-scope': 'off',
      // 'react/jsx-boolean-value': 'off',
      // 'react/jsx-no-undef': 'off',
      // 'react/jsx-uses-vars': 'off',
      // 'react/jsx-no-duplicate-props': 'off',
      // 'react/jsx-fragments': 'off',
      // 'react/jsx-no-script-url': 'off',
      // 'react/jsx-no-comment-textnodes': 'off',
      // 'react/jsx-no-useless-fragment': 'off',
      // 'react/jsx-no-constructed-context-values': 'off',
      // 'react/jsx-props-no-spreading': 'off',
      // 'react/jsx-sort-default-props': 'off',
    },
  },
]
