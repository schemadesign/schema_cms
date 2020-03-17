import styled, { css } from 'styled-components';
import { identity, ifElse, equals, always } from 'ramda';

import { styleWhenTrue } from '../../../../utils/rendering';
import { media } from '../../../../../theme/media';

const getAutoWidthStyles = styleWhenTrue(
  identity,
  css`
    position: relative;
    max-width: 100%;
    display: flex;
    align-items: center;
  `
);

export const Container = styled.div`
  ${({ isAuthWidth }) => getAutoWidthStyles(isAuthWidth)};
  position: relative;
`;

export const IconWrapper = styled.div`
  margin-top: ${({ isLabel }) => (isLabel ? '0' : '25px')};

  ${media.desktop`
    margin-top: 0;
  `};
`;

export const ErrorWrapper = styled.div`
  position: ${({ isLabel, isAuthWidth }) => (isLabel || isAuthWidth ? 'absolute' : 'relative')};
  top: ${({ isLabel, isAuthWidth }) => (isLabel || isAuthWidth ? '50px' : '0')};
  left: 0;
  color: ${({ theme: { textField } }) => textField.error};
  font-size: 14px;
  font-weight: normal;
`;

export const getIconStyles = ifElse(
  equals(true),
  always({
    top: 2,
  }),
  always({
    top: -40,
    right: -30,
  })
);
