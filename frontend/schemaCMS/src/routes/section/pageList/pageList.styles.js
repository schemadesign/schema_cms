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
  display: active ? 'block' : 'none',
  width: '17px',
  height: '17px',
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
  }

  li {
    margin: 6px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
  }

  .previous,
  .next {
    border: none;
    width: auto;
    border-radius: 5px;
    padding: 2px;
    transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
  }

  .previous:not(.disabled):hover,
  .next:not(.disabled):hover {
    background-color: ${colors.white};
    color: ${colors.black};
  }

  .selected,
  & li:not(.previous):not(.next):hover {
    background-color: ${colors.white};
    color: ${colors.black};
  }

  a {
    padding: 4px;
  }

  .disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }
`;

export const CardHeaderIcons = styled.div`
  display: flex;
  justify-content: end;
`;
