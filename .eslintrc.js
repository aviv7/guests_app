module.exports = {
	root: true,
	extends: ['@react-native-community'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': ['warn'],
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
					},
				],
				'no-undef': 'off',

				'jsx-quotes': ['warn', 'prefer-single'],
			},
		},
	],
};
