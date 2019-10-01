import styled from 'styled-components';

export const Container = styled.div`
  width: calc(100% - 50px);
`;

export const HeaderWrapper = styled.div``;

export const MenuHeader = styled.div``;

export const Content = styled.div`
  overflow: auto;
  max-height: calc(100vh - 70px);
  margin: 20px -20px 0 0;
  padding-right: 20px;
  -webkit-overflow-scrolling: touch;
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const PrimaryList = styled(List)`
  margin-bottom: 20px;
`;

export const SecondaryList = styled(List)``;

export const Item = styled.li`
  line-height: 1.5;
  margin: 2px 0;
  cursor: pointer;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    display: block;
  }
`;

export const PrimaryItem = styled(Item)`
  font-size: 24px;
  border-bottom: 2.4px solid ${({ theme }) => theme.border};
  padding: 8px 0 13px;

  &:first-of-type {
    border-top: 2.4px solid ${({ theme }) => theme.border};
  }
`;

export const SecondaryItem = styled(Item)`
  a {
    padding: 8px 0;
  }
`;

export const menuStyles = {
  zIndex: 9999,
  maxWidth: null,
};

export const closeButtonStyles = {
  backgroundColor: 'transparent',
};
