import {theme} from '../../utils/theme';

const {primary} = theme;

export const containerStyle = {
  'border-top': `2px solid ${primary.border}`,
  'background-color': primary.background,
  color: primary.text,
  padding: '12px 14px 14px',
  display: 'flex',
  'flex-direction': 'column',

};

export const headerStyle = {
  'margin-bottom': '14px',
  color: primary.label,
  'font-size': '12px'
};