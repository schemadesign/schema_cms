import styled, { css } from 'styled-components';

import { media } from '../../../theme/media';

const ICON_SIZE = 30;

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  max-width: calc(100% - ${3 * ICON_SIZE}px);

  ${media.desktop`
    max-width: calc(100% - ${50 + 4 * ICON_SIZE}px);
  `};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const InputContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  padding-left: 0;

  ${media.desktop`
    padding-left: 30px;
  `};
`;

export const RemoveIcon = styled.div`
  cursor: pointer;
`;

export const ElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const ElementsContainer = styled.div`
  padding-bottom: 20px;

  ${media.desktop`
    padding-left: 30px;
  `};
`;

export const customElementSelectStyles = css`
  width: 100%;
  padding: 10px 0;
`;

export const ElementIcon = styled.div`
  margin: 0 25px 0 5px;
  display: none;

  ${media.desktop`
    display: block;
  `};
`;

export const customLabelStyles = {
  borderTop: 'none',
};
