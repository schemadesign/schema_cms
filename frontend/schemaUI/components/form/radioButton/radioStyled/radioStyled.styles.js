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
  transition: 'background 0.25s ease-in-out',
});

const getUncheckedRadio = ({ radioButton }) => ({
  width: '8px',
  height: '8px',
  backgroundColor: 'transparent',
  borderRadius: '50%',
  transition: 'background 0.25s ease-in-out',
});

export const getStyles = (theme = defaultTheme) => ({
  radioStyles: getRadio(theme),
  checkedRadioStyles: getCheckedRadio(theme),
  unCheckedRadioStyles: getUncheckedRadio(theme),
});
