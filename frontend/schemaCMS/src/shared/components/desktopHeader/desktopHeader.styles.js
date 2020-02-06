import { prop } from 'ramda';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Typography } from 'schemaUI';

import SchemaLogoSVG from '../../../images/icons/schemaLogo.svg';
import { media, contentSizes } from '../../../theme/media';
import { styleWhenTrue } from '../../utils/rendering';

const ANIMATION_TIME = '0.4s';
const MENU_EASING = 'cubic-bezier(0.86, 0, 0.07, 1)';

const visibiltyTransition = styleWhenTrue(
  prop('visible'),
  css`
    visibility: visible;
    transition: visibility 0s;
  `,
  css`
    visibility: hidden;
    transition: visibility 0s ${ANIMATION_TIME};
  `
);

export const TopContainer = styled.div`
  display: none;

  ${media.desktop`
    display: flex;
    align-items: center;
    flex-direction: column;
    border-bottom: solid 2px ${({ theme: { card } }) => card.background};
    width: 100%;
  `};
`;

export const Container = styled.div`
  width: ${contentSizes.desktop}px;
  height: 62px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  width: ${contentSizes.desktop - 35}px;
  height: 62px;
  flex: 1 1 auto;
  justify-content: space-between;
`;

export const Actions = styled.div`
  display: flex;
  flex: 0 0 auto;
`;

export const BaseLink = styled(Link)`
  display: flex;
  height: calc(100% - 20px);
  margin: 10px;
  align-items: center;
  cursor: pointer;
`;

export const LogoLink = styled(BaseLink)`
  flex: 0 0 auto;
  margin-left: 0;
`;

export const IconLink = styled(BaseLink)`
  margin-right: 0;
  padding: 0 7px;
`;

export const Logo = styled(SchemaLogoSVG)`
  fill: ${({ theme: { text } }) => text};
  width: 96px;
  height: 16px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  margin: 0 10px;
  overflow: hidden;
  justify-content: center;
`;

export const Title = styled(Typography.H1)`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const headerCustomStyles = {
  padding: null,
};

export const customButtonStyles = {
  position: null,
  flex: '0 0 auto',
};

export const closeButtonStyles = {
  backgroundColor: 'transparent',
  top: 44,
  right: 44,
};

export const menuStyles = visible => ({
  zIndex: 9999,
  maxWidth: 595,
  padding: 50,
  minHeight: null,
  transition: visible
    ? `transform ${ANIMATION_TIME} ${MENU_EASING}, visibility 0s`
    : `transform ${ANIMATION_TIME} ${MENU_EASING}, visibility 0s ${ANIMATION_TIME}`,
  position: 'absolute',
});

export const MenuWrapper = styled.div`
  width: 1000px;
  z-index: 9910;
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  ${visibiltyTransition};
`;

export const Overlayer = styled.div`
  background: ${({ theme: { card } }) => card.background};
  opacity: 0.75;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9900;
  ${visibiltyTransition};
`;

export const logoutButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  height: 'calc(100% - 20px)',
  margin: '6px 0 10px 10px',
  padding: '0 7px',
  borderRadius: null,
  backgroundColor: 'transparent',
};

export const Content = styled.div`
  overflow: auto;
  padding: 40px 0 20px;
  -webkit-overflow-scrolling: touch;
  max-height: calc(100vh - 154px);
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;

  &:first-of-type {
    margin-bottom: 40px;
  }

  &:last-of-type {
    align-items: flex-start;
  }
`;

export const Item = styled.div`
  line-height: 1.5;
  cursor: pointer;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    display: block;
  }
`;

export const PrimaryItem = styled(Item)`
  border-bottom: 2.4px solid ${({ theme, active }) => (active ? theme.header.text : theme.header.border)};
  margin: 2px 0;
  font-size: 20px;
  transition: border 200ms ease-in-out;

  &:hover {
    border-bottom: 2.4px solid ${({ theme }) => theme.header.text};
  }

  &:first-of-type {
    border-top: 2.4px solid ${({ theme }) => theme.header.border};
  }

  a {
    padding: 22px 0 27px;
  }
`;

export const SecondaryItem = styled(Item)`
  padding: 0;
  margin: 10px 0;
  transition: border 400ms;
  border-bottom: 1px solid transparent;
  display: inline-block;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.text};
  }
`;
