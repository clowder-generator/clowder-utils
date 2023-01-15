module.exports = {
    env: {
        browser: false,
        es2021: true
    },
    extends: 'standard-with-typescript',
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        project: 'tsconfig.json'
    },
    rules: {
        "@typescript-eslint/semi": ["error", "always"],
        "@typescript-eslint/indent": [1, 4],
        "@typescript-eslint/strict-boolean-expressions": [0],
        "@typescript-eslint/member-delimiter-style": [1,
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                },
                "multilineDetection": "brackets"
            }
        ],
        "@typescript-eslint/space-before-function-paren": ["error", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
        "@typescript-eslint/no-non-null-assertion": [1],
        "@typescript-eslint/prefer-nullish-coalescing": [1]
    }
}
