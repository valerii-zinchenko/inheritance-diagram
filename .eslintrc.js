module.exports = {
	'parserOptions': {
		'ecmaVersion': 7
	},
	'extends': 'eslint:recommended',
	'rules': {
		'no-console': 'off',
		'curly': ['error', 'all'],
		'default-case': 'warn',
		'dot-location': ['error', 'property'],
		'dot-notation': 'error',
		'eqeqeq': ['warn', 'always'],
		'no-alert': 'error',
		'no-caller': 'error',
		'no-case-declarations': 'warn',
		'no-else-return': 'error',
		'no-eval': 'error',
		'no-labels': 'error',
		'no-lone-blocks': 'error',
		'no-loop-func': 'error',
		'no-magic-numbers': 'warn',
		'no-multi-str': 'error',
		'no-param-reassign': 'error',
		'no-proto': 'error',
		'no-redeclare': ['error', {
			'builtinGlobals': true
		}],
		'no-return-assign': ['error', 'always'],
		'no-script-url': 'error',
		'no-self-assign': ['error', {
			'props': true
		}],
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-throw-literal': 'error',
		'no-unmodified-loop-condition': 'warn',
		'no-unused-expressions': 'warn',
		'no-useless-call': 'error',
		'no-useless-concat': 'warn',
		'no-warning-comments': ['error', {
			'terms': ['todo', 'fixme'],
			'location': 'anywhere'
		}],
		'no-with': 'error',
		'radix': ['error', 'always'],
		'wrap-iife': ['error', 'inside'],
		'yoda': ['error', 'never', {
			'exceptRange': true
		}],

		// Don't know how to properly configure this
		//'strict': ['error', 'global'],

		'no-catch-shadow': 'error',
		'no-shadow-restricted-names': 'error',
		'no-shadow': ['error', {
			'builtinGlobals': true
		}],
		'no-undef-init': 'error',
		'no-unused-vars': 'warn',
		'no-use-before-define': 'error',

		'array-bracket-spacing': ['error', 'never'],
		'brace-style': ['error', '1tbs', {
			'allowSingleLine': true
		}],
		'camelcase': 'error',
		'comma-dangle': ['error', 'never'],
		'consistent-this': ['error', '_this'],
		'func-call-spacing': ['error', 'never'],
		'func-style': ['error', 'declaration'],
		'id-length': ['warn', {
			'min': 1,
			'max': 20,
			'properties': 'always'
		}],
		'indent': ['warn', 'tab', {
			'SwitchCase': 1,
			'MemberExpression': 1
		}],
		'key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true,
			'mode': 'minimum'
		}],
		'keyword-spacing': ['error', {
			'before': true,
			'after': true
		}],
		'max-depth': 'warn',
		'max-nested-callbacks': ['warn', 5],
		'max-params': ['warn', 5],
		'max-statements-per-line': ['error', {
			'max': 1
		}],
		'max-statements': ['warn', 50],
		'new-cap': ['warn', {
			'newIsCap': true,
			'properties': true
		}],
		'new-parens': 'error',
		'newline-before-return': 'error',
		'newline-per-chained-call': ['error', {
			'ignoreChainWithDepth': 2
		}],
		'no-lonely-if': 'error',
		'no-mixed-operators': 'warn',
		'no-multiple-empty-lines': ['error', {
			'max': 3,
			'maxEOF': 1
		}],
		'no-negated-condition': 'error',
		'no-nested-ternary': 'error',
		'no-new-object': 'error',
		'no-trailing-spaces': 'error',
		'no-unneeded-ternary': 'warn',
		'no-whitespace-before-property': 'error',
		'object-curly-spacing': ['error', 'never'],
		'object-property-newline': 'error',
		'one-var': ['error', 'never'],
		'operator-assignment': ['warn', 'always'],
		'operator-linebreak': ['error', 'before'],
		'padded-blocks': ['warn', 'never'],
		'quote-props': ['warn', 'as-needed'],
		'quotes': ['error', 'single'],
		'require-jsdoc': 'warn',
		'semi': ['error', 'always'],
		'space-before-blocks': ['error', 'always'],
		'space-before-function-paren': ['error', 'never'],
		'space-in-parens': ['error', 'never'],
		'space-infix-ops': 'error',
		'spaced-comment': ['error', 'always']
	}
};
