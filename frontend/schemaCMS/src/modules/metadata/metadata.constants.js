import * as Yup from 'yup';

export const METADATA = 'metadata';
export const METADATA_KEY = 'key';
export const METADATA_VALUE = 'value';

export const METADATA_SCHEMA = Yup.object({
  [METADATA]: Yup.array(
    Yup.object().shape({
      [METADATA_KEY]: Yup.string()
        .trim()
        .min(1, 'Name should have at least 1 character')
        .max(100, 'Name should have maximum 100 characters')
        .required('Required'),
      [METADATA_VALUE]: Yup.string()
        .trim()
        .min(1, 'Value should have at least 1 character')
        .max(1000, 'Value should have maximum 1000 characters')
        .required('Required'),
    })
  ),
});
