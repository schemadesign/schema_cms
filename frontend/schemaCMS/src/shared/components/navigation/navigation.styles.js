import styled from 'styled-components';
import { always, ifElse, propEq } from 'ramda';

import { media, contentSizes } from '../../../theme/media';

const BUTTON_MARGIN = 5;

export const Container = styled.div`
  height: 155px;
`;

export const NavigationContent = styled.div`
  display: flex;
  justify-content: ${ifElse(propEq('right', true), always('flex-end'), always('space-between'))};
  flex-wrap: wrap;
  align-items: center;
  width: 100%;

  .nav-btn {
    width: calc(50% - ${BUTTON_MARGIN}px);
  }

  .nav-btn--back {
    margin-right: ${BUTTON_MARGIN}px;
  }

  .nav-btn--next {
    margin-left: ${BUTTON_MARGIN}px;
  }

  ${media.desktop`
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'flex')};

      .nav-btn {
        width: 235px;
      }

      .nav-btn--back {
        margin-left: 255px;
      }

      .nav-btn--next {
        margin-right: 255px;
      }
  `}
`;

export const Navigation = styled.div`
  position: fixed;
  padding: 40px 0 36px;
  bottom: 0;
  width: calc(100% - 40px);
  background-image: linear-gradient(
    to top,
    ${({ theme: { background } }) => `${background}, ${background} 30%`},
    rgba(0, 0, 0, 0)
  );

  ${media.desktop`
    width: ${contentSizes.desktop}px;
  `}
`;

export const buttonIconStyles = {
  height: '60px',
  width: '60px',
};

export const buttonStyles = {
  margin: null,
};
