const path = require('path');

module.exports = function override(config, env) {
  config.output.globalObject = 'this';
  const wasmExtensionRegExp = /\.wasm$/;
  const workerExtensionRegExp = /\.worker\.js$/;

  config.resolve.extensions.push('.wasm');

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  config.module.rules.push({
    test: workerExtensionRegExp,
    use: { loader: 'worker-loader' }
  });

  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'src'),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }]
  });



  return config;
};