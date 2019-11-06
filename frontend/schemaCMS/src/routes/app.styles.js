import styled from 'styled-components';

import { media, contentSizes } from '../theme/media';

export const Container = styled.div``;

export const Content = styled.div`
  padding: 18px 20px 24px 20px;

  ${media.desktop`
    width: ${contentSizes.desktop}px;
    margin: 0 auto;
    padding: 30px 0 24px 0;
  `}
`;
