import styled from 'styled-components';

import { media } from '../../../theme/media';

const mobileMargin = 7;
const desktopMargin = 15;

export const Container = styled.div`
  font-weight: 600;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
`;

export const ProjectView = styled.div`
  margin-top: 7px;
`;

export const Details = styled.ul`
  list-style: none;
  font-size: 14px;
  padding: 0;

  ${media.desktop`
    column-count: 2;
  `}
`;

export const DetailItem = styled.li`
  color: ${({ theme: { text } }) => text};
  margin-bottom: 4px;
  border-top: 2px solid ${({ theme: { border } }) => border};
  display: flex;

  ${media.desktop`
    border-top-color: ${({ theme: { card } }) => card.background};
  `}
`;

export const DetailWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(100% - 37px);
  padding: 12px 0 8px 0;
`;

export const DetailLabel = styled.span`
  color: ${({ theme: { secondaryText } }) => secondaryText};
  margin-right: 5px;
  flex: 0 0 auto;
`;

export const IconEditWrapper = styled.div`
  margin: 5px 0 0 7px;
`;

export const DetailValue = styled.span`
  color: ${({ theme: { text } }) => text};
  flex: 1 1 auto;
`;

export const Statistics = styled.ul`
  margin-bottom: 15px;
  padding: 0;

  ${media.desktop`
    margin-bottom: 30px;
    margin-left: -${desktopMargin}px;
  `}
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
  `}
`;

export const CardHeader = styled.span`
  font-size: 12px;

  ${media.desktop`
    font-size: 18px;
  `}
`;

export const CardValue = styled.span`
  display: block;
  font-size: 66px;
  line-height: 1.09;
  letter-spacing: -3px;

  ${media.desktop`
    padding-top: 40px;
    font-size: 108px;
    line-height: 1em;
    letter-spacing: -4.91px;
  `}
`;

export const statisticsCardStyles = {
  cursor: 'pointer',
};
