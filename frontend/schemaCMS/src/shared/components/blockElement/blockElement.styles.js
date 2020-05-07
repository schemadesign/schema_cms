import styled from 'styled-components';

import { media } from '../../../theme/media';

const ICON_CONTAINER_WIDTH = 50;

export const DetailsContainer = styled.div`
  ${media.desktop`
    padding-left: ${ICON_CONTAINER_WIDTH}px;
  `}
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.div``;

export const SelectLabel = styled.div`
  white-space: pre-wrap;
  padding: 0 30px 0 10px;
`;

export const MarkdownContainer = styled.div`
  padding-bottom: 30px;

  .mde-header {
    background-color: ${({ theme }) => theme.background};
  }

  .mde-header path {
    fill: ${({ theme }) => theme.icon.fill};
  }

  .mde-header button {
    color: ${({ theme }) => theme.secondaryText};
  }

  .mde-header button:focus {
    outline: none;
  }

  .mde-header .mde-tabs button.selected {
    color: ${({ theme }) => theme.text};
    border: none;
  }

  .mde-textarea-wrapper textarea {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.background};
  }

  .react-mde .grip {
    background-color: ${({ theme }) => theme.background};
    height: auto;
  }

  .react-mde .grip path {
    fill: ${({ theme }) => theme.icon.fill};
  }

  .mde-header ul.mde-header-group li.mde-header-item ul.react-mde-dropdown {
    background-color: ${({ theme }) => theme.background};
  }

  .mde-header ul.mde-header-group li.mde-header-item button {
    color: ${({ theme }) => theme.text};
  }

  .mde-header ul.mde-header-group li.mde-header-item ul.react-mde-dropdown li button p:hover {
    color: ${({ theme }) => theme.secondaryText};
  }
`;

export const InputContainer = styled.div`
  position: relative;
  padding-bottom: 30px;
`;

export const ObservableHQContainer = styled.div`
  position: relative;
  padding-bottom: 30px;
`;

export const IconContainer = styled.div`
  width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;

  ${media.desktop`
    width: ${ICON_CONTAINER_WIDTH}px;
  `}
`;

export const getCustomInputStyles = theme => ({
  backgroundColor: theme.secondaryText,
  padding: '10px 30px 10px 20px',
});

export const customStyles = {
  paddingBottom: 2,
};

export const editIconStyles = {
  position: 'absolute',
  right: 5,
  top: 5,
};

export const getCustomSelectedWrapperStyles = theme => ({
  backgroundColor: theme.secondaryText,
  padding: '20px 10px',
});

export const SetElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 2px solid ${({ theme }) => theme.border};
  }
`;

export const SetElementContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const RemoveContainer = styled.div`
  cursor: pointer;
  margin-top: 10px;
`;
