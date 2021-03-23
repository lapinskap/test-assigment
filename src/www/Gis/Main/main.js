import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';

// import Map from "ol/Map";
// import View from "ol/View";

// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import BingMaps from "ol/source/BingMaps";
//
// import FullScreen from "ol/control/FullScreen";
// import OverviewMap from "ol/control/OverviewMap";
// import ScaleLine from "ol/control/ScaleLine";
// import Control from "ol/control/Control";

// import Tree, {TreeNode} from 'rc-tree'
// import 'rc-tree/assets/index.css'
import 'ol/ol.css';

class GisMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = { extHtml: { __html: '' } };

    fetch('/Raw/gis.html').then((res) => res.text()).then((result) => {
      this.setState({
        extHtml: { __html: result },
      });

      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/Raw/gis.js';
      script.defer = true;
      document.body.appendChild(script);
    });
  }

  render() {
    const { extHtml } = this.state;
    return (
      <>
        <CSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <PageTitle
            heading="GIS"
            subheading="Geospatial Information System"
            icon="pe-7s-map icon-gradient bg-premium-dark"
          />

          <Container fluid>
            <Row>
              <Col md="12">
                <Card className="main-card mb-3">
                  <CardBody>
                    {/* eslint-disable-next-line react/no-danger */}
                    <div dangerouslySetInnerHTML={extHtml} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </CSSTransitionGroup>
      </>
    );
  }
}

export default GisMain;
