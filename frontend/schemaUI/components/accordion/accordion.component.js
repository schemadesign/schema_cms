import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { pickAll, identity, pipe, ifElse, map, isNil, always, equals, complement, pickBy, isEmpty } from 'ramda';

import { getStyles } from './accordion.styles';
import AccordionContext from './accordion.context';
import { CaretIcon } from '../icons';

export class Accordion extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    arrowIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    customIconStyles: PropTypes.object,
    customPanelStyles: PropTypes.object,
    customHeaderStyles: PropTypes.object,
    customDetailsStyles: PropTypes.object,
    customExpandButtonStyles: PropTypes.object,
    collapseCopy: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    expandCopy: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    newOpen: PropTypes.bool,
  };

  static defaultProps = {
    customPanelStyles: {},
    customHeaderStyles: {},
    customDetailsStyles: {},
    newOpen: false,
  };

  state = {
    accordionsState: {},
    isAnyOpen: false,
  };

  componentDidMount() {
    const temporaryAccordionState = {};
    this.props.children.forEach(({ props }) => {
      temporaryAccordionState[props.id] = false;
    });

    this.setState({
      accordionsState: temporaryAccordionState,
      isAnyOpen: false,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children.length !== this.props.children.length) {
      const newIds = this.props.children.map(({ props }) => props.id);
      const accordionsState = pipe(
        pickAll(newIds),
        map(ifElse(isNil, always(this.props.newOpen), identity))
      )(this.state.accordionsState);
      const isAnyOpen = this.getIsAnyOpen(accordionsState);

      this.setState({
        accordionsState,
        isAnyOpen,
        register: false,
      });
    }
  }

  getIsAnyOpen = pipe(
    pickBy(equals(true)),
    complement(isEmpty)
  );

  toggleOpenAccordion = () => {
    const isAnyOpen = this.getIsAnyOpen(this.state.accordionsState);
    const accordionsState = map(() => !isAnyOpen)(this.state.accordionsState);

    this.setState({ accordionsState, isAnyOpen: !isAnyOpen });
  };

  setAccordionState = (id, value) => {
    const accordionsState = { ...this.state.accordionsState };
    accordionsState[id] = value;
    const isAnyOpen = this.getIsAnyOpen(accordionsState);

    this.setState({ accordionsState, isAnyOpen });
  };

  render() {
    const {
      children,
      arrowIcon = null,
      customIconStyles,
      collapseCopy,
      expandCopy,
      customExpandButtonStyles,
      ...rest
    } = this.props;
    const { accordionsState, isAnyOpen } = this.state;
    const { iconStyles, expandButtonStyles } = getStyles();
    const icon = arrowIcon || <CaretIcon customStyles={{ ...iconStyles, ...customIconStyles }} />;
    const context = {
      icon,
      accordionsState,
      setAccordionState: this.setAccordionState,
      ...rest,
    };

    return (
      <Fragment>
        {collapseCopy && expandCopy && !!children ? (
          <div style={{ ...expandButtonStyles, ...customExpandButtonStyles }} onClick={this.toggleOpenAccordion}>
            {isAnyOpen ? collapseCopy : expandCopy}
          </div>
        ) : null}
        <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>{' '}
      </Fragment>
    );
  }
}
