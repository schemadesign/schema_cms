import { decamelize } from 'humps';

export const decamelizeThatDontBreaksFile = object => {
  if (object && !(object instanceof File)) {
    if (object instanceof Array) {
      return object.map(item => decamelizeThatDontBreaksFile(item));
    }
    if (object instanceof FormData) {
      let formData = new FormData();
      for (const [key, value] of object.entries()) {
        formData.append(decamelize(key), value);
      }
      return formData;
    }
    if (typeof object === 'object') {
      return Object.keys(object).reduce(
        (acc, next) => ({
          ...acc,
          [decamelize(next)]: decamelizeThatDontBreaksFile(object[next]),
        }),
        {}
      );
    }
  }
  return object;
};
