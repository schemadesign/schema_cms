import styled, { css } from 'styled-components';
import { always, equals, identity, ifElse } from 'ramda';

import { styleWhenTrue } from '../../../../utils/rendering';
import { media } from '../../../../../theme/media';

const getAutoWidthStyles = styleWhenTrue(
  identity,
  css`
    position: relative;
    max-width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
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
  position: ${({ isLabel }) => (isLabel ? 'absolute' : 'relative')};
  top: ${({ isLabel }) => (isLabel ? 'calc(100% - 30px);' : '0')};
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
