import styled from 'styled-components';

import { media } from '../../../theme/media';

export const Container = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
  background-color: ${({ theme: { stepper } }) => stepper.background};

  svg {
    cursor: pointer;
  }

  ${media.desktop`
    position: static;
    background-color: transparent;
    padding: 0;
    display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'fixed')};
  `};
`;

export const Button = styled.div`
  background-color: ${({ theme: { stepper } }) => stepper.background};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.desktop`
    width: 60px;
    height: 60px;
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
