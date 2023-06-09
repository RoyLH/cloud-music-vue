module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],
  customSyntax: 'postcss-html',
  overrides: [
    {
      files: ['src/**/*.{scss,css,sass}'],
      customSyntax: 'postcss-scss',
    }
  ],
  rules: {
    'no-descending-specificity': null,
    'no-invalid-position-at-import-rule': null,
    'declaration-empty-line-before': null,
    'keyframes-name-pattern': null,
    'custom-property-pattern': null,
    'number-max-precision': 8,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'selector-not-notation': null,
    'comment-empty-line-before': null,
  },
}
