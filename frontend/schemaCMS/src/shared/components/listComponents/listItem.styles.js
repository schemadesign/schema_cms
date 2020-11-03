import styled from 'styled-components';
import { Card } from 'schemaUI';
import { Link } from 'react-router-dom';

import { media } from '../../../theme/media';

const LIST_ITEM_MARGIN = 10;

export const ListItem = styled(Card)`
  margin-bottom: 20px;
  flex: 0 0 auto;
  width: 100%;
  min-height: 150px;

  ${media.desktop`
    width: calc(100%/3 - ${LIST_ITEM_MARGIN * 2}px);
    max-width: 320px;
    min-height: 192px;
    margin: ${LIST_ITEM_MARGIN}px;
  `};
`;

export const ListItemTitle = styled(Link)`
  word-break: break-word;
  cursor: pointer;
  line-height: 1.25;
  letter-spacing: -0.12px;
  margin: 0;
  color: inherit;
  text-decoration: none;
  display: block;
  font-size: 2em;
  font-weight: bold;
`;

export const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-height: calc(100% - 28px);
`;

export const ListItemDescription = styled.div`
  margin-bottom: 10px;
`;

export const FooterContainer = styled.div`
  display: flex;
`;
