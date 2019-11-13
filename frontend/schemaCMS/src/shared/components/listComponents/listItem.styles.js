import styled from 'styled-components';
import { Card } from 'schemaUI';
import { media } from '../../../theme/media';

export const ListItem = styled(Card)`
  margin-bottom: 20px;

  ${media.desktop`
    flex: 0 0 auto;
    width: calc(33% - 16.66px);
    max-width: 320px;
    min-height: 192px;
    margin: 5px;
  `};
`;
