import React, { useEffect, useState } from 'react';
import { always, cond, equals, is, T, both, prop } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Icons } from 'schemaUI';
import PropTypes from 'prop-types';

import { Container } from './publicWarning.styles';
import { FILE_TYPE, IMAGE_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';
import messages from '../blockTemplateElement/blockTemplateElement.messages';
import { renderWhen } from '../../utils/rendering';
import { WarningMessage, WarningMessageIcon } from '../blockTemplateElement/blockTemplateElement.styles';

const { InfoIcon } = Icons;

export const PublicWarning = ({ type }) => {
  const [warningMessage, setWarningMessage] = useState(null);

  useEffect(() => {
    const message = cond([
      [equals(FILE_TYPE), always(<FormattedMessage {...messages.warningFile} />)],
      [equals(IMAGE_TYPE), always(<FormattedMessage {...messages.warningImage} />)],
      [both(is(Array), prop('length')), always(<FormattedMessage {...messages.warningMultiple} />)],
      [T, always(null)],
    ])(type);

    setWarningMessage(message);
  }, [type]);

  const renderMessage = renderWhen(is(Object), () => (
    <WarningMessage>
      <WarningMessageIcon>
        <InfoIcon />
      </WarningMessageIcon>
      {warningMessage}
    </WarningMessage>
  ));

  return <Container>{renderMessage(warningMessage)}</Container>;
};

PublicWarning.propTypes = {
  type: PropTypes.any,
};
