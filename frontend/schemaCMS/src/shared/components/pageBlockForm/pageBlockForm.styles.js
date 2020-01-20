import styled from 'styled-components';

export const UploaderContainer = styled.div`
  position: relative;
`;

export const UploaderList = styled.div`
  line-height: 24px;
  font-size: 18px;
`;

export const UploaderItem = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
`;

export const ImageName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const removeIconStyles = {
  width: 30,
  height: 30,
  minWidth: 30,
  marginLeft: 20,
  cursor: 'pointer',
};

export const menuIconStyles = { width: 10, marginRight: 20 };
