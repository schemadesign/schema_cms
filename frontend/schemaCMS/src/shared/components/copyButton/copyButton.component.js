import React from 'react';
import PropTypes from 'prop-types';
import { always } from 'ramda';
import { useTheme } from 'styled-components';
import { Icons } from 'schemaUI';

import { Container, getCopyIconStyles } from './copyButton.styles';
import { renderWhenTrueOtherwise } from '../../utils/rendering';
import { Loader } from '../loader/loader.component';

const { CopyIcon } = Icons;

export const CopyButton = ({ loading = false, error = false, action, name = '' }) => {
  const theme = useTheme();
  const copyIconStyles = getCopyIconStyles({ error, theme });

  const renderIcon = loading =>
    renderWhenTrueOtherwise(always(<Loader />), always(<CopyIcon customStyles={copyIconStyles} />))(loading);

  return (
    <Container id={name} onClick={action}>
      {renderIcon(loading)}
    </Container>
  );
};

CopyButton.propTypes = {
  name: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  action: PropTypes.func.isRequired,
};
