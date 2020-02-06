import { META_FAILED, META_PENDING, META_PROCESSING, META_SUCCESS } from './dataSource.constants';

export const dataSources = [
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: null,
    jobsInProcess: false,
    metaData: {
      status: META_SUCCESS,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: {
      scripts: [],
    },
    jobsInProcess: false,
    metaData: {
      status: META_SUCCESS,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: {},
    jobsInProcess: true,
    metaData: {
      status: META_SUCCESS,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: {},
    jobsInProcess: false,
    metaData: {
      status: META_SUCCESS,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: {},
    jobsInProcess: false,
    metaData: {
      status: META_PROCESSING,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: {},
    jobsInProcess: false,
    metaData: {
      status: META_PENDING,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: {},
    jobsInProcess: false,
    metaData: {
      status: META_FAILED,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 18,
    name: 'name',
    activeJob: {},
    jobsInProcess: false,
    metaData: {
      status: META_PENDING,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 19,
    name: 'name',
    fileName: null,
    file: null,
    activeJob: {},
    jobsInProcess: false,
    metaData: {
      status: META_PENDING,
    },
  },
];
