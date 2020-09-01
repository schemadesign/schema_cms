import { META_FAILED, META_PENDING, META_PROCESSING, META_SUCCESS } from './dataSource.constants';
import { JOB_STATE_FAILURE, JOB_STATE_PENDING, JOB_STATE_PROCESSING, JOB_STATE_SUCCESS } from '../job/job.constants';

export const dataSources = [
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 17,
    name: 'name',
    activeJob: null,
    jobsState: {
      lastJobStatus: JOB_STATE_FAILURE,
    },
    tags: [{ name: 'tag 1' }, { name: 'tag 2' }],
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
    jobsState: {
      lastJobStatus: JOB_STATE_SUCCESS,
    },
    tags: [],
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
    jobsState: {
      lastJobStatus: JOB_STATE_PROCESSING,
    },
    tags: [{ name: 'tag 1' }, { name: 'tag 2' }],
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
    jobsState: {
      lastJobStatus: JOB_STATE_PENDING,
    },
    tags: [],
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
    jobsState: {
      lastJobStatus: null,
    },
    tags: [{ name: 'tag 1' }, { name: 'tag 2' }],
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
    jobsState: {
      lastJobStatus: null,
    },
    tags: [],
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
    jobsState: {
      lastJobStatus: null,
    },
    tags: [{ name: 'tag 1' }, { name: 'tag 2' }],
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
    jobsState: {
      lastJobStatus: null,
    },
    tags: [],
    metaData: {
      status: META_PENDING,
    },
  },
  {
    created: '2019-09-09T11:23:40+0000',
    createdBy: { firstName: 'firstName', lastName: 'lastName' },
    id: 20,
    name: 'name',
    activeJob: {},
    jobsState: {
      lastJobStatus: null,
    },
    tags: [{ name: 'tag 1' }, { name: 'tag 2' }],
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
    jobsState: {
      lastJobStatus: null,
    },
    tags: [],
    metaData: {
      status: META_PENDING,
    },
  },
];
