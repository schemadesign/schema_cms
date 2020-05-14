import styled from 'styled-components';

import { media } from '../../../theme/media';

const ICON_SIZE = 30;
const TYPE_MAX_WIDTH = 100;

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  max-width: calc(100% - ${3 * ICON_SIZE}px);

  ${media.desktop`
    max-width: calc(100% - ${20 + TYPE_MAX_WIDTH + 3 * ICON_SIZE}px);
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

export const Type = styled.div`
  color: ${({ theme }) => theme.secondaryText};
  max-width: ${TYPE_MAX_WIDTH}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: none;

  ${media.desktop`
    display: block;
  `};
`;

export const customLabelStyles = {
  borderTop: 'none',
};
