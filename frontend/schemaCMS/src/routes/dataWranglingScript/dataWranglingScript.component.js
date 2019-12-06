import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';

import { DataWranglingDefaultScript } from './dataWranglingScriptComponent/dataWranglingDefaultScript.component';
import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { IMAGE_SCRAPING_SCRIPT_TYPE } from '../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { ImageScrapingScript } from './imageScrapingScriptComponent/imageScrapingScript.component';

export class DataWranglingScript extends PureComponent {
  static propTypes = {
    dataWranglingScript: PropTypes.object,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    fetchDataWranglingScript: PropTypes.func.isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    const {
      match: {
        params: { scriptId },
      },
    } = this.props;
    await this.props.fetchDataWranglingScript({ scriptId });
    this.setState({ loading: false });
  }

  renderGeneralOrCustomRoute = renderWhenTrueOtherwise(
    () => <ImageScrapingScript {...this.props} />,
    () => <DataWranglingDefaultScript {...this.props} />
  );

  render() {
    const { dataWranglingScript } = this.props;
    const { loading } = this.state;
    const isImageScraping = dataWranglingScript.specs.type === IMAGE_SCRAPING_SCRIPT_TYPE;

    return (
      <LoadingWrapper loading={loading} noData={isEmpty(dataWranglingScript)}>
        {this.renderGeneralOrCustomRoute(isImageScraping)}
      </LoadingWrapper>
    );
  }
}
