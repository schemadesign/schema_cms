import styled, { css } from 'styled-components';
import { identity } from 'ramda';

import { styleWhenTrue } from '../../utils/rendering';
import { media } from '../../../theme/media';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  padding-right: 30px;
  position: relative;
  font-size: 18px;
  cursor: pointer;

  label {
    margin-bottom: 2px;
  }

  ${({ customStyles }) => customStyles};
`;

export const SelectContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 250px;
  ${media.desktop`
    top: 22px;
    right: 22px;
    width: 324px;
  `};
`;

const getCenterIconStyles = styleWhenTrue(
  identity,
  css`
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    font-size: 0;
  `
);

export const IconContainer = styled.div`
  position: absolute;
  right: 0;
  top: 5px;

  ${({ centerIcon }) => getCenterIconStyles(centerIcon)};
`;
