/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { TAG_NAME, TAG_TAGS } from '../../../modules/dataSourceTag/dataSourceTag.constants';

export default defineMessages({
  [TAG_NAME]: {
    id: `shared.components.dataSourceTagForm.${TAG_NAME}`,
    defaultMessage: 'Name',
  },
  [TAG_TAGS]: {
    id: `shared.components.dataSourceTagForm.${TAG_TAGS}`,
    defaultMessage: 'Tags',
  },
  saveTag: {
    id: 'shared.components.dataSourceTagForm.saveTag',
    defaultMessage: 'Save',
  },
  deleteTag: {
    id: 'shared.components.dataSourceTagForm.deleteTag',
    defaultMessage: 'Remove tag',
  },
  addTag: {
    id: 'shared.components.dataSourceTagForm.addTag',
    defaultMessage: 'Add tag',
  },
  cancel: {
    id: 'shared.components.dataSourceTagForm.cancel',
    defaultMessage: 'Cancel',
  },
  back: {
    id: 'shared.components.dataSourceTagForm.back',
    defaultMessage: 'Back',
  },
  cancelRemoval: {
    id: 'shared.components.dataSourceTagForm.cancelRemoval',
    defaultMessage: 'Cancel',
  },
  confirmRemoval: {
    id: 'shared.components.dataSourceTagForm.confirmRemoval',
    defaultMessage: 'Confirm',
  },
  removeTitle: {
    id: 'shared.components.dataSourceTagForm.removeTitle',
    defaultMessage: 'Are you sure you want to remove the tag?',
  },
  keyTagKeyNotUniqueError: {
    id: 'shared.components.dataSourceTagForm.keyTagKeyNotUniqueError',
    defaultMessage: 'A tag with this name already exists in data source.',
  },
});
