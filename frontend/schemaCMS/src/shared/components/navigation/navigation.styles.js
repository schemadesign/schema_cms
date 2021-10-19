import styled, { css } from 'styled-components';
import { always, identity, ifElse, propEq } from 'ramda';
import { Button } from 'schemaUI';
import { Link } from 'react-router-dom';

import { media, contentSizes } from '../../../theme/media';
import { styleWhenTrue } from '../../utils/rendering';

const BUTTON_MARGIN = 5;

export const Container = styled.div`
  height: 120px;

  ${media.desktop`
    height: 100px;
  `};
`;

export const NavigationContent = styled.div`
  display: flex;
  justify-content: ${ifElse(propEq('right', true), always('flex-end'), always('space-between'))};
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  ${({ contentStyles }) => contentStyles};

  ${media.desktop`
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'flex')};
  `};
`;

const fixedStyles = css`
  position: fixed;
  width: calc(100% - 40px);
  z-index: 999;
  background-image: linear-gradient(
    to top,
    ${({ theme: { background } }) => `${background}, ${background} 30%`},
    ${({ theme: { hiddenBackground } }) => hiddenBackground}
  );
`;

const fixedNavigationStyles = styleWhenTrue(identity, fixedStyles);

export const Navigation = styled.div`
  bottom: 0;
  width: 100%;
  padding: ${({ padding }) => padding || '10px 0 36px'};

  ${({ fixed }) => fixedNavigationStyles(fixed)};

  ${media.desktop`
    ${fixedStyles};
    padding: 10px 0 36px;
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

export const NavigationLink = styled(Link)`
  width: calc(50% - ${BUTTON_MARGIN}px);
  max-width: 240px;
  background-color: ${({ theme, $inverse }) => ($inverse ? theme.inverseButton.background : theme.button.background)};
  color: ${({ theme, $inverse }) => ($inverse ? theme.inverseButton.text : theme.button.text)};
  border-radius: 30px;
  text-align: center;
  line-height: 30px;
  text-decoration: none;
  font-size: 20px;
  padding: 9px 0;

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

export const LinkButton = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  padding: 4px 8px 4px 6px;
  background-color: ${({ theme }) => theme.inverseButton.background};
  color: ${({ theme }) => theme.inverseButton.text};
  text-decoration: none;

  ${media.desktop`
    display: ${({ $hideOnDesktop }) => ($hideOnDesktop ? 'none' : 'flex')};
  `};
`;

export const RoundLinkButton = styled(Link)`
  background-color: ${({ theme }) => theme.inverseButton.background};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: inline-block;
  border-radius: 50%;

  ${media.desktop`
    display: ${({ $hideOnDesktop }) => ($hideOnDesktop ? 'none' : 'inline-block')};
  `};
`;
