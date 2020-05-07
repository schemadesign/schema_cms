import styled, { css } from 'styled-components';
import { identity } from 'ramda';

import { styleWhenTrue } from '../../../utils/rendering';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  position: relative;
  font-size: 18px;
  cursor: pointer;

  label {
    margin-bottom: 2px;
  }

  ${({ customStyles }) => customStyles};
`;

const getCenterIconStyles = styleWhenTrue(
  identity,
  css`
    top: 50%;
    right: 5px;
    transform: translateY(-100%);
    font-size: 0;
  `
);

export const IconContainer = styled.div`
  position: absolute;
  right: 0;
  top: 5px;

  ${({ centerIcon }) => getCenterIconStyles(centerIcon)}
`;
