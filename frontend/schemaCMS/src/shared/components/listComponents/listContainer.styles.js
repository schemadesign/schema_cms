import styled from 'styled-components';
import { media } from '../../../theme/media';

export const ListContainer = styled.section`
  display: flex;
  flex-direction: column;

  ${media.desktop`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  `};
`;
