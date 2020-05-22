import * as Yup from 'yup';

export const METADATA = 'metadata';
export const METADATA_KEY = 'key';
export const METADATA_VALUE = 'value';

export const INITIAL_VALUES = { [METADATA]: [] };

export const METADATA_SCHEMA = Yup.object({
  [METADATA]: Yup.array(
    Yup.object().shape({
      [METADATA_KEY]: Yup.string()
        .trim()
        .min(1, 'Name should have at least 1 character')
        .max(25, 'Name should have maximum 25 characters')
        .required('Required'),
      [METADATA_VALUE]: Yup.string()
        .trim()
        .min(1, 'Value should have at least 1 character')
        .max(25, 'Value should have maximum 25 characters')
        .required('Required'),
    })
  ),
});
