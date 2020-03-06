import styled from 'styled-components';
import { media } from '../../../theme/media';

export const Container = styled.div`
  color: ${({ theme }) => theme.secondaryText};
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${media.desktop`
    margin-top: -35px;
  `}
`;
export const Element = styled.div`
  width: 33%;
`;
