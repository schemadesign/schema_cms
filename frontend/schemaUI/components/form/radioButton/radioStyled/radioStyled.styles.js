import { defaultTheme } from '../../../../utils/theme';

const getRadio = ({ radioButton }) => ({
  width: '16px',
  height: '16px',
  border: `1px solid ${radioButton.border}`,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const getCheckedRadio = ({ radioButton }) => ({
  width: '8px',
  height: '8px',
  backgroundColor: radioButton.active.background,
  borderRadius: '50%',
});

export const getStyles = (theme = defaultTheme) => ({
  radioStyles: getRadio(theme),
  checkedRadioStyles: getCheckedRadio(theme),
});
