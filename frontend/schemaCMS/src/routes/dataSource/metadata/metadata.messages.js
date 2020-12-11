/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { METADATA_KEY } from '../../../modules/metadata/metadata.constants';

export default defineMessages({
  pageTitle: {
    id: 'dataSource.metadata.pageTitle',
    defaultMessage: 'Metadata',
  },
  subTitle: {
    id: 'dataSource.metadata.subTitle',
    defaultMessage: 'Metadata',
  },
  metadata: {
    id: 'dataSource.metadata.metadata',
    defaultMessage: 'Metadata',
  },
  save: {
    id: 'dataSource.metadata.save',
    defaultMessage: 'Save',
  },
  [`${METADATA_KEY}Placeholder`]: {
    id: `dataSource.metadata.${METADATA_KEY}Placeholder`,
    defaultMessage: 'Name',
  },
  collapseCopy: {
    id: 'dataSource.metadata.collapseCopy',
    defaultMessage: 'Collapse Metadata',
  },
  expandCopy: {
    id: 'dataSource.metadata.expandCopy',
    defaultMessage: 'Expand Metadata',
  },
  metaDataTitle: {
    id: 'dataSource.metadata.metaDataTitle',
    defaultMessage: 'Metadata',
  },
  mappingLabelsTitle: {
    id: 'dataSource.metadata.mappingLabelsTitle',
    defaultMessage: 'Labels Mapping',
  },
});
