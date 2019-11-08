import styled from 'styled-components';

import { media } from '../../../theme/media';

export const Container = styled.div`
  ${media.desktop`
    margin-top: 70px;
  `}
`;

export const ComingSoon = styled.div`
  color: ${({ theme: { text } }) => text};
  text-align: center;
`;
