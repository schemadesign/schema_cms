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
    display: ${({ visibile }) => (visibile ? 'block' : 'none')};
    margin: -10px 0 170px;
  `}
`;

export const desktopButtonStyles = {
  padding: 0,
  backgroundColor: 'transparent',
};
