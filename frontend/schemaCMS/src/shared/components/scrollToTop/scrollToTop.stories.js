import React, { Fragment, PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { Button } from 'schemaUI';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { ScrollToTop } from './scrollToTop.component';

export const defaultProps = {
  history: createMemoryHistory(),
  keyLength: 0,
}

export class Wrapper extends PureComponent {
  state = {
    path: '/init'
  }

  componentDidMount() {
    setTimeout(() => {
      window.scrollTo(0, 1000);
    }, 500);
  }

  handleChangeLocation = () => {
    const id = Math.round(Math.random() * 1000).toString(16);
    const path = `/some-other-url-${id}`;

    this.setState({ path });
    this.props.history.push(path);
  }

  render() {
    return (
      <Router {...this.props}>
        <ScrollToTop />
        <h1>
          Scroll to top
        </h1>
        <h3 style={{backgroundColor: '#777', padding: '3px 15px', display: 'inline-block'}}>
          {this.state.path}
        </h3>
        <p>Lorem ipsum dolor sit amet,</p>
        <p>consectetur adipiscing elit.</p>
        <p>In vel augue eget enim auctor iaculis,</p>
        <p>Donec quis pulvinar urna,</p>
        <p>ac malesuada nisi.</p>
        <p>Cras at lorem auctor,</p>
        <p>Linterdum dolor consequat,</p>
        <p>Lorem ipsum dolor sit amet,</p>
        <p>consectetur adipiscing elit.</p>
        <p>In vel augue eget enim auctor iaculis.</p>
        <p>Donec quis pulvinar urna,</p>
        <p>ac malesuada nisi.</p>
        <p>Cras at lorem auctor.</p>
        <p>Linterdum dolor consequat.</p>
        <Button
          onClick={this.handleChangeLocation}
          customStyles={{padding: '0 20px', margin: '20px 5px'}}
          inverse
        >
          Change location
        </Button>
      </Router>
    );
  }
}

storiesOf('Shared Components|ScrollToTop', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <Wrapper {...defaultProps} />);
