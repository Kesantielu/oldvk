module.exports = {
    plugins: {
        "postcss-prefix-selector": {
            prefix: '[dir]', exclude: [/\[dir]/], transform: function (prefix, selector, prefixedSelector) {
                return (selector.indexOf(':not(dir)') !== -1) ? selector.replace(/:not\(dir\)\s*/, '') : prefixedSelector;
            }
        }
    }
}