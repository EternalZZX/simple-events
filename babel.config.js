module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env', {
        'modules': 'commonjs',
        'useBuiltIns': 'entry',
        'corejs': '3.0.1',
        'targets': {
          'browsers': ['> 1%', 'last 2 versions', 'not ie <= 8']
        }
      }
    ]
  ];
  const plugins = [
    'transform-vue-jsx',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    [
      '@babel/plugin-proposal-decorators',
      {
        'legacy': true
      }
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions'
  ];
  return {
    presets,
    plugins
  };
};
