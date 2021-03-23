module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": [
        'plugin:json/recommended',
        "plugin:react/recommended",
        "airbnb",
        "react-app"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jest"
    ],
    "rules": {
        "react/jsx-filename-extension": "off",
        "react/forbid-foreign-prop-types": "off",
        "max-len": [2, {"code": 150, "tabWidth": 4, "ignoreUrls": true}],
        "no-underscore-dangle": "off",
        "react/no-unescaped-entities": "off",
        "no-use-before-define": "off",
        "function-call-argument-newline": ["error", "consistent"],
        "no-console": ["error", { "allow": ["warn", "error"]}]
    }
};
