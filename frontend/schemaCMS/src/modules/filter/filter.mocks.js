export const selectFilter = {
  id: 1,
  datasource: {
    id: 5,
    name: 'Presidents',
  },
  name: 'Filter First Name',
  filterType: 'select',
  field: 'First Name',
  fieldType: 'string',
  uniqueItems: null,
  isActive: true,
  created: '2020-05-13T10:23:54+0000',
  modified: '2020-05-27T12:16:09+0000',
};

export const checkboxFilter = {
  id: 2,
  datasource: {
    id: 5,
    name: 'Presidents',
  },
  name: 'Filter Last Name',
  filterType: 'checkbox',
  field: 'Last Name',
  fieldType: 'string',
  uniqueItems: null,
  isActive: true,
  created: '2020-05-27T12:16:23+0000',
  modified: '2020-05-27T12:16:23+0000',
};

export const rangeFilter = {
  id: 3,
  datasource: {
    id: 5,
    name: 'Presidents',
  },
  name: 'Filter Birthday',
  filterType: 'range',
  field: 'No',
  fieldType: 'number',
  uniqueItems: null,
  isActive: true,
  created: '2020-05-27T12:16:23+0000',
  modified: '2020-05-27T12:16:23+0000',
};
export const filters = [selectFilter, checkboxFilter, rangeFilter];
