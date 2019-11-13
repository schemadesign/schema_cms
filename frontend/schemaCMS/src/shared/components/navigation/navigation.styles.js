import styled from 'styled-components';
import { always, ifElse, propEq } from 'ramda';

import { media, contentSizes, isDesktop } from '../../../theme/media';

const BUTTON_MARGIN = 5;
const BUTTON_MARGIN_DEKSTOP = 10;
const BUTTON_SIZE_DESKTOP = 235;
const OUTTER_BUTTON_MARGIN_DEKSTOP = 500 - BUTTON_MARGIN_DEKSTOP - BUTTON_SIZE_DESKTOP;

export const Container = styled.div`
  height: 155px;
`;

export const NavigationContent = styled.div`
  display: flex;
  justify-content: ${ifElse(propEq('right', true), always('flex-end'), always('space-between'))};
  flex-wrap: wrap;
  align-items: center;
  width: 100%;

  ${media.desktop`
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'flex')};
    justify-content: ${ifElse(propEq('right', true), always('flex-end'), always('flex-start'))};
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

const buttonStyles = {
  width: isDesktop() ? `${BUTTON_SIZE_DESKTOP}px` : `calc(50% - ${BUTTON_MARGIN}px)`,
};

export const backButtonStyles = {
  ...buttonStyles,
  margin: isDesktop() ? `0 ${BUTTON_MARGIN_DEKSTOP}px 0 ${OUTTER_BUTTON_MARGIN_DEKSTOP}px` : `${BUTTON_MARGIN}px)`,
};

export const nextButtonStyles = {
  ...buttonStyles,
  marginLeft: isDesktop() ? `0 ${OUTTER_BUTTON_MARGIN_DEKSTOP}px 0 ${BUTTON_MARGIN_DEKSTOP}px` : `${BUTTON_MARGIN}px)`,
};
