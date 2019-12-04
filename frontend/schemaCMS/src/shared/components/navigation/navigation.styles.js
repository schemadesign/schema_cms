import styled, { css } from 'styled-components';
import { always, identity, ifElse, propEq } from 'ramda';
import { Button } from 'schemaUI';

import { media, contentSizes } from '../../../theme/media';
import { styleWhenTrue } from '../../utils/rendering';

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

  ${media.desktop`
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'flex')};
  `};
`;

const fixedNavigationStyles = styleWhenTrue(
  identity,
  css`
    position: fixed;
    width: calc(100% - 40px);
    background-image: linear-gradient(
      to top,
      ${({ theme: { background } }) => `${background}, ${background} 30%`},
      rgba(0, 0, 0, 0)
    );
  `
);

export const Navigation = styled.div`
  bottom: 0;
  width: 100%;
  padding: 40px 0 36px;

  ${({ fixed }) => fixedNavigationStyles(fixed)};

  ${media.desktop`
    width: ${contentSizes.desktop}px;
  `};
`;

export const NavigationButton = styled(Button)`
  width: calc(50% - ${BUTTON_MARGIN}px);
  max-width: 240px;

  ${media.desktop`
    width: 240px;
  `};
`;

export const ButtonContainer = styled.div`
  ${media.desktop`
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'block')};
  `};
`;

export const buttonIconStyles = {
  height: '60px',
  width: '60px',
};
