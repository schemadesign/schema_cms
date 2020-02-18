import styled, { css } from 'styled-components';

import { media } from '../../../theme/media';
import { ErrorWrapper } from '../../../shared/components/form/inputs/textInput/textInput.styles';

const mobileMargin = 7;
const desktopMargin = 15;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
`;

export const ProjectView = styled.div`
  ${media.desktop`
    margin-top: 70px;
  `};
`;

export const Details = styled.ul`
  list-style: none;
  font-size: 14px;
  padding: 0;
  margin-bottom: 0;

  ${media.desktop`
    font-size: 18px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  `};
`;

export const DetailItem = styled.li`
  color: ${({ theme: { text } }) => text};
  margin-bottom: 4px;
  border-top: 2px solid ${({ theme: { label } }) => label.border};
  display: flex;

  ${media.desktop`
    border-top-color: ${({ theme: { card } }) => card.background};
    width: calc(50% - 10px);
    flex: 0 0 auto;
    order: ${({ order }) => order};
  `};
`;

export const DetailWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 12px 0 8px 0;
  position: relative;

  ${media.desktop`
    flex-direction: column;
    font-weight: normal;
  `};
`;

export const DetailLabel = styled.span`
  color: ${({ theme: { secondaryText } }) => secondaryText};
  margin-right: 5px;
  flex: 0 0 auto;
  font-size: 14px;

  ${media.desktop`
    margin-bottom: 6px;
  `};
`;

export const DetailValue = styled.span`
  color: ${({ theme: { text } }) => text};
  flex: 1 1 auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

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

export const containerInputStyles = {
  paddingBottom: 0,
  position: 'static',
};

export const inputStyles = {
  fontSize: 'inherit',
  lineHeight: 'inherit',
};

export const selectContainerStyles = css`
  font-size: inherit;
  width: 100%;
  padding-bottom: 0;
  position: static;
`;

export const InputContainer = styled.div`
  ${ErrorWrapper} {
    margin: 5px 0 0;
  }

  svg {
    margin-top: 7px;
  }
`;
