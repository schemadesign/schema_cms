import styled from 'styled-components';

const ICON_CONTAINER_WIDTH = 50;

export const DetailsContainer = styled.div`
  padding-left: ${ICON_CONTAINER_WIDTH}px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.div``;

export const InputContainer = styled.div`
  position: relative;
`;

export const IconContainer = styled.div`
  width: ${ICON_CONTAINER_WIDTH}px;
  display: flex;
  align-items: center;
`;

export const getCustomInputStyles = theme => ({
  backgroundColor: theme.secondaryText,
  padding: '10px 30px 10px 20px',
});

export const editIconStyles = {
  position: 'absolute',
  right: 5,
  top: 5,
};
