import styled from 'styled-components';
import { media } from '../../../theme/media';

export const Container = styled.div`
  color: ${({ theme }) => theme.secondaryText};
  text-align: center;
  margin-bottom: 20px;

  ${media.desktop`
    margin-top: -35px;
  `}
`;
