export const generateRandomString = length => {
  let result = 'X1';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const randomizeEmail = (localPart, domain) => `${localPart}+${generateRandomString(10)}@${domain}`;

export const makeFileInputVisible = inputName =>
  browser.execute(inputName => {
    inputName.style.display = 'block';
    inputName.style.height = '50px';
    inputName.style.visibility = 'visible';
  }, inputName);

const jquerySelector = (selector, func) => () => func(selector);

const convertSelectors = (selectors, func) =>
  Object.keys(selectors).reduce(
    (prevValue, value) => ({
      ...prevValue,
      [value]: jquerySelector(selectors[value], func),
    }),
    {}
  );

export const convertArraysToObject = (singleArr, multiArr) => Object.assign({}, ...singleArr, ...multiArr);

export const createSelectors = (singleArr, multiArr) =>
  convertArraysToObject(
    singleArr.map(obj => ({ ...convertSelectors(obj, $) })),
    multiArr.map(obj => ({ ...convertSelectors(obj, $$) }))
  );
