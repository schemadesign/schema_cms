import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { ListItem as ListItemBase } from '../listComponents';
import { media } from '../../../theme/media';

export const UserDetails = styled.div`
  flex: 1 1 auto;
`;

export const UserFullName = styled(Link)`
  color: ${({ theme: { text } }) => text};
  text-decoration: none;
  font-size: 24px;
  font-weight: 600;
  word-break: break-word;
`;

export const ListItem = styled(ListItemBase)`
  min-height: 120px;

  ${media.desktop`
    min-height: 114px;
  `};
`;

export const ListItemContent = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-between;
`;

export const Role = styled.div`
  color: ${({ theme: { card } }) => card.label};
  font-weight: bold;
`;

export const cardStyles = {
  flexDirection: null,
};

export const buttonIconStyles = {
  height: 30,
  width: 30,
  minHeight: 30,
  padding: 0,
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'transparent',
};
