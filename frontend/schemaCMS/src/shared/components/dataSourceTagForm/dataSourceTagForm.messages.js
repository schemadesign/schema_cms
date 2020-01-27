/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { TAG_KEY, TAG_VALUE } from '../../../modules/dataSourceTag/dataSourceTag.constants';

export default defineMessages({
  [TAG_KEY]: {
    id: `shared.components.dataSourceTagForm.${TAG_KEY}`,
    defaultMessage: 'Key',
  },
  [TAG_VALUE]: {
    id: `shared.components.dataSourceTagForm.${TAG_VALUE}`,
    defaultMessage: 'Value',
  },
  saveTag: {
    id: 'shared.components.dataSourceTagForm.saveTag',
    defaultMessage: 'Save',
  },
  deleteTag: {
    id: 'shared.components.dataSourceTagForm.deleteTag',
    defaultMessage: 'Remove tag',
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
  nameTagNameNotUniqueError: {
    id: 'shared.components.dataSourceTagForm.nameTagNameNotUniqueError',
    defaultMessage: 'A tag with this name already exists in project.',
  },
});
