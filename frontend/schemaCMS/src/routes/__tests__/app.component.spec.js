import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

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

  it('should not render App when language is not set', () => {
    const wrapper = shallow(component({ language: undefined }));
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render App when language is set', () => {
    const wrapper = shallow(component({ language: 'en' }));
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call startup on mount', () => {
    const startup = spy();
    shallow(component({ startup }));

    expect(startup).to.have.been.calledOnce;
  });
});
