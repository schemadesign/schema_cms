import styled from 'styled-components';
import { media } from '../../../theme/media';

const desktopMargin = 15;
const mobileMargin = 7;

export const Statistics = styled.ul`
  margin-bottom: 15px;
  padding: 0;

  ${media.desktop`
    margin-bottom: 30px;
    margin-left: -${desktopMargin}px;
  `};
`;

export const CardWrapper = styled.li`
  font-size: 12px;
  display: inline-block;
  width: calc(50% - ${mobileMargin}px);
  margin-bottom: ${mobileMargin * 2}px;

  &:nth-child(2n + 1) {
    margin-right: ${mobileMargin}px;
  }

  &:nth-child(2n) {
    margin-left: ${mobileMargin}px;
  }

  ${media.desktop`
    font-size: 18px;
    width: calc(25% - ${desktopMargin}px);

    :nth-child(2n + 1) {
      margin-right: 0;
      margin-left: ${desktopMargin}px;
    }

    &:nth-child(2n) {
      margin-left: ${desktopMargin}px;
    }
  `};
`;

export const CardHeader = styled.span`
  font-size: 12px;

  ${media.desktop`
    color: ${({ theme: { card } }) => card.text};
    font-size: 18px;
  `};
`;

export const CardValue = styled.span`
  display: block;
  font-size: 66px;
  line-height: 1.09;
  font-weight: 500;

  ${media.desktop`
    padding-top: 40px;
    font-size: 108px;
    line-height: 1em;
  `};
`;

export const statisticsCardStyles = {
  cursor: 'pointer',
  fontWeight: 600,
};
