import styled from 'styled-components';

export const HeaderList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

export const HeaderItem = styled.li`
  display: inline-block;
  line-height: 1.25;
  margin-right: 1.5em;
  color: ${({ theme: { label } }) => label.text};

  &::before {
    content: '•';
    margin-left: -1.5em;
    display: inline-block;
    padding: 0 7px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderIcon = styled.div``;
