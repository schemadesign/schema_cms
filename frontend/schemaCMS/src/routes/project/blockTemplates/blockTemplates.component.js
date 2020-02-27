import React, { memo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Container } from './blockTemplates.styles';
import messages from './blockTemplates.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';

export const BlockTemplates = memo(({ fetchBlocks, blockTemplates }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchBlocks();
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <Container>
      <FormattedMessage {...messages.title} />
      <LoadingWrapper loading={loading} error={error}>
        blocks
      </LoadingWrapper>
    </Container>
  );
});

BlockTemplates.propTypes = {
  match: PropTypes.object.isRequired,
  blockTemplates: PropTypes.object.isRequired,
  fetchBlocks: PropTypes.func.isRequired,
};
