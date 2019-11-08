import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Card } from 'schemaUI';

import { media } from '../../../theme/media';

export const Container = styled.div`
  ${media.desktop`
    display: flex;
    flex-wrap: wrap;
    margin-left: -20px;
  `}
`;

export const Item = styled(Card)`
  margin-bottom: 20px;

  ${media.desktop`
    flex: 0 0 auto;
    width: calc(33% - 16.66px);
    margin-left: 20px;
  `}
`;

export const Actions = styled.div`
  flex: 0 0 auto;
  margin: 0 -5px 0 5px;
`;

export const UserDetails = styled.div`
  flex: 1 1 auto;
`;

export const UserFullName = styled(Link)`
  color: ${({ theme: { text } }) => text};
  text-decoration: none;
  font-size: 24px;
  font-weight: 600;
`;

export const Email = styled.span`
  display: block;
  padding-top: 10px;
  word-break: break-all;
  font-weight: 200;
`;

export const cardStyles = {
  flexDirection: null,
};

export const buttonIconStyles = {
  height: 40,
  width: 40,
  minHeight: 40,
  marginTop: -5,
};

export const iconStyles = {
  height: 40,
  width: 40,
};
