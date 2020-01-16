import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';

import { DataWranglingDefaultScript } from './dataWranglingScriptComponent/dataWranglingDefaultScript.component';
import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { IMAGE_SCRAPING_SCRIPT_TYPE } from '../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { ImageScrapingScript } from './imageScrapingScriptComponent/imageScrapingScript.component';
import reportError from '../../shared/utils/reportError';

export class DataWranglingScript extends PureComponent {
  static propTypes = {
    dataWranglingScript: PropTypes.object,
    fetchDataWranglingScript: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  state = {
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const {
        match: {
          params: { scriptId },
        },
      } = this.props;
      await this.props.fetchDataWranglingScript({ scriptId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  renderGeneralOrCustomRoute = renderWhenTrueOtherwise(
    () => <ImageScrapingScript {...this.props} />,
    () => <DataWranglingDefaultScript {...this.props} />
  );

  render() {
    const { dataWranglingScript } = this.props;
    const { error, loading } = this.state;
    const noData = isEmpty(dataWranglingScript);
    const isImageScraping = !noData && dataWranglingScript.specs.type === IMAGE_SCRAPING_SCRIPT_TYPE;

    return (
      <LoadingWrapper loading={loading} noData={isEmpty(dataWranglingScript)} error={error}>
        {this.renderGeneralOrCustomRoute(isImageScraping)}
      </LoadingWrapper>
    );
  }
}
