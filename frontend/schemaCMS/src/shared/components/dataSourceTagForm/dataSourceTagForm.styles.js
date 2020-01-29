import styled from 'styled-components';
import { Form as FormikForm } from 'formik';

export const Tag = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding: 10px 0;

  &:last-child {
    border: none;
  }
`;

export const Form = styled(FormikForm)`
  padding-top: 24px;
`;
