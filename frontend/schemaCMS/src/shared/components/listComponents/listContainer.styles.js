import styled from 'styled-components';
import { media } from '../../../theme/media';

const LIST_ITEM_MARGIN = 10;
export const ListContainer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  ${media.desktop`
    justify-content: flex-start;
    margin: 0 -${LIST_ITEM_MARGIN}px;
  `};
`;
