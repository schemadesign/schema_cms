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

export const DesktopActions = styled.div`
  display: none;

  ${media.desktop`
    display: block;
    margin: 70px 0 20px 0;
  `}
`;

export const desktopButtonStyles = {
  padding: '0 40px',
};
