import styled from 'styled-components';
import { Card } from 'schemaUI';
import { media } from '../../../theme/media';

const LIST_ITEM_MARGIN = 10;

export const ListItem = styled(Card)`
  margin-bottom: 20px;

  ${media.desktop`
    flex: 0 0 auto;
    width: calc(100%/3 - ${LIST_ITEM_MARGIN * 2}px);
    max-width: 320px;
    min-height: 192px;
    margin: ${LIST_ITEM_MARGIN}px;
  `};
`;
