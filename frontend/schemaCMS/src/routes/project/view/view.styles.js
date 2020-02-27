import styled, { css } from 'styled-components';

import { media } from '../../../theme/media';
import { ErrorWrapper } from '../../../shared/components/form/inputs/textInput/textInput.styles';

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
