import styled from 'styled-components';
import { always, cond, ifElse, propEq, T } from 'ramda';
import { Button } from 'schemaUI';

import { media, contentSizes } from '../../../theme/media';
import { BACK, NEXT } from './navigation.constants';

const BUTTON_MARGIN = 5;
const BUTTON_MARGIN_DESKTOP = 255;

const setTranslate = x =>
  cond([[propEq('type', BACK), always(`${x}px`)], [propEq('type', NEXT), always(`${-x}px`)], [T, always('0')]]);

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
  `};
`;

export const NavigationButton = styled(Button)`
  width: calc(50% - ${BUTTON_MARGIN}px);

  ${media.desktop`
    width: 23.5%;
    transform: translateX(${setTranslate(BUTTON_MARGIN_DESKTOP)});
  `};
`;

export const buttonIconStyles = {
  height: '60px',
  width: '60px',
};
