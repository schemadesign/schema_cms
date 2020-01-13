import React from 'react';
import { shallow } from 'enzyme';

import { DEFAULT_LOCALE, LOCALES } from '../../i18n';
import { App } from '../app.component';

describe('App: Component', () => {
  const children = <div className="app__children">Children</div>;
  const defaultProps = {
    startup: () => {},
    language: DEFAULT_LOCALE,
    match: { params: { lang: LOCALES.POLISH } },
  };

  const component = props => (
    <App {...defaultProps} {...props}>
      {children}
    </App>
  );

  const render = (props = {}) => shallow(component(props));

  it('should not render App when language is not set', () => {
    const wrapper = render({ language: undefined });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render App when language is set', () => {
    const wrapper = render({ language: 'en' });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call startup on mount', () => {
    const startup = jest.spyOn(defaultProps, 'startup');
    render({ startup });

    expect(startup).toHaveBeenCalledTimes(1);
  });
});
