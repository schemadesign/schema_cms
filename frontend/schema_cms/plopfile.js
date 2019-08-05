const promptDirectory = require('inquirer-directory');

const addReduxModuleGenerator = require('./plop/reduxModule');
const addReduxContainerGenerator = require('./plop/reduxContainer');
const addReactComponentGenerator = require('./plop/reactComponent');

module.exports = function(plop) {
  plop.setPrompt('directory', promptDirectory);

  addReduxModuleGenerator(plop);
  addReduxContainerGenerator(plop);
  addReactComponentGenerator(plop);
};
