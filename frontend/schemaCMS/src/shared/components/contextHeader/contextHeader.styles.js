import styled from 'styled-components';
import { Typography } from 'schemaUI';

import { media } from '../../../theme/media';

export const Container = styled.div`
  display: none;

  ${media.desktop`
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin: 60px 0 40px 0;
    min-height: 63px;
  `};
`;

export const Header = styled.div`
  margin-right: 20px;
`;

export const Title = styled(Typography.H2)`
  color: ${({ theme: { text } }) => text};
`;

export const Subtitle = styled(Typography.H1)`
  color: ${({ theme: { text } }) => text};
`;

export const ContextContainer = styled.div``;
