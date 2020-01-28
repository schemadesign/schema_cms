import styled from 'styled-components';
import { Form as FormikForm } from 'formik';

export const Row = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: auto auto;
`;

export const Form = styled(FormikForm)`
  padding-top: 24px;
`;
