import styled from 'styled-components';
import { media } from '../../../theme/media';

export const Container = styled.div`
  color: ${({ theme }) => theme.secondaryText};
  text-align: center;
  padding-bottom: 20px;
  min-height: 43px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${media.desktop`
    margin-top: ${({ moveToTop }) => (moveToTop ? -35 : 0)}px;
    padding-bottom: 40px;
  `}
`;
export const Element = styled.div`
  width: ${({ renderElement }) => (renderElement ? 33 : 0)}%;
`;
