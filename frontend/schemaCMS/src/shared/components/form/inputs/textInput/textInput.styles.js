import styled, { css } from 'styled-components';
import { identity } from 'ramda';

import { styleWhenTrue } from '../../../../utils/rendering';

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
`;

export const IconWrapper = styled.div`
  padding-top: ${({ isLabel }) => (isLabel ? '7px' : 0)};
  margin-top: ${({ isLabel }) => (isLabel ? 0 : '-2px')};
`;

export const ErrorWrapper = styled.div`
  position: ${({ isLabel }) => (isLabel ? 'absolute' : 'positive')};
  top: ${({ isLabel }) => (isLabel ? '50px' : '30px')};
  left: 0;
  color: ${({ theme: { textField } }) => textField.error};
  font-size: 14px;
  font-weight: normal;
`;
