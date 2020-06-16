import styled from 'styled-components';

export const Container = styled.div`
  padding-bottom: 50px;
`;

export const ListContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const StateName = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
`;

export const PlusButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
