import styled, { css } from 'styled-components';
import { always, cond, T, propEq } from 'ramda';
import { Link } from 'react-router-dom';

import { media } from '../../../theme/media';

export const Container = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 20px;
  z-index: 1000;
  background-color: ${({ theme: { stepper } }) => stepper.background};

  svg {
    cursor: pointer;
    transform: scale(0.8);
  }

  ${media.desktop`
    position: static;
    background-color: transparent;
    padding: 0;
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'fixed')};

    svg {
      transform: scale(1);
    }
  `};
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const disabledStyles = css`
  opacity: 0.2;
  pointer-events: none;
`;

const inActiveStyles = css`
  svg {
    opacity: 0.4;
  }
`;

const statusButtonStyles = cond([
  [propEq('disabled', true), always(disabledStyles)],
  [propEq('$active', false), always(inActiveStyles)],
  [T, always(null)],
]);

export const Button = styled(Link)`
  background-color: ${({ theme: { stepper } }) => stepper.background};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 3px;

  ${statusButtonStyles}

  ${media.desktop`
    width: 60px;
    height: 60px;
    padding: 0px;
  `};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.desktop`
    margin-left: 15px;
  `};
`;

export const PageTitle = styled.div`
  padding-top: 9px;
  color: ${({ theme: { secondaryText } }) => secondaryText};
  font-size: 12px;
  display: none;

  ${media.desktop`
    display: block;
  `};
`;
