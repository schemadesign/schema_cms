import styled from 'styled-components';
import { always, ifElse, propEq } from 'ramda';

import { media, contentSizes, isDesktop } from '../../../theme/media';

const buttonMargin = () => (isDesktop() ? 10 : 5);

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
    width: 49%;
    margin: 0 auto;
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
  width: `calc(50% - ${buttonMargin()}px)`,
};

export const backButtonStyles = {
  ...buttonStyles,
  marginRight: buttonMargin(),
};

export const nextButtonStyles = {
  ...buttonStyles,
  marginLeft: buttonMargin(),
};
