import styled from 'styled-components';
import { colors } from '../../../theme/styled';

export const Container = styled.div``;

export const Form = styled.form``;

export const CardFooter = styled.div`
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const getCustomHomeIconStyles = ({ active }) => ({
  opacity: active ? 1 : 0.3,
  cursor: 'pointer',
});

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  ul,
  li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }

  li {
    margin: 6px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }

  .previous,
  .next {
    border: none;
    width: auto;
  }

  .selected,
  & li:not(.previous):not(.next):hover {
    background-color: ${colors.white};
    color: ${colors.black};
  }

  a {
    padding: 4px;
  }
`;
