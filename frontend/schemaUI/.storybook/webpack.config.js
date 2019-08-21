const path = require('path');

const pathToInlineSvg = path.resolve(__dirname, '../images/icons');

module.exports = ({ config }) => {
  const rules = config.module.rules;

  const fileLoaderRule = rules.find(rule => rule.test.test('.svg'));
  fileLoaderRule.exclude = pathToInlineSvg;
  rules.push({
    test: /\.svg$/,
    include: pathToInlineSvg,
    use: ['babel-loader', {
      loader: '@svgr/webpack',
      options: {
        icon: true,
      },
    }],
  });

  return config;
};
