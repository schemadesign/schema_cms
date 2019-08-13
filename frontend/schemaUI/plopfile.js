const promptDirectory = require('inquirer-directory');

const addReactComponentGenerator = require('./plop/reactComponent');

module.exports = function(plop) {
  plop.setPrompt('directory', promptDirectory);

  addReactComponentGenerator(plop);
};
