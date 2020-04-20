import styled from 'styled-components';

export const Container = styled.div``;

export const Form = styled.form``;

export const getCustomHomeIconStyles = ({ active }) => ({
  opacity: active ? 1 : 0.3,
  cursor: 'pointer',
});
