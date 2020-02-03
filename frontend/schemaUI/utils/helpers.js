import elementAttributes from 'html-element-attributes';

const additionalAllowedAttributes = [
  'className',
  'onClick',
  'onChange',
  'onBlur',
  'onFocus',
  'defaultValue',
  'onKeyDown',
  'autoFocus',
];

export const filterAllowedAttributes = (element, props) => {
  const attributes = elementAttributes['*']
    .concat(elementAttributes[element] || [])
    .concat(additionalAllowedAttributes);

  return Object.keys(props)
    .filter(key => attributes.includes(key))
    .reduce((obj, key) => ({ [key]: props[key], ...obj }), {});
};
