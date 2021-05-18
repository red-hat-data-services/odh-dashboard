import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@patternfly/patternfly/patternfly.min.css';
import { Page } from '@patternfly/react-core';
import { detectUser } from '../redux/actions/actions';
import { useDesktopWidth } from '../utilities/useDesktopWidth';
import Header from './Header';
import Routes from './Routes';
import NavSidebar from './NavSidebar';

import './App.scss';
import { useHistory } from 'react-router';
import { useSegmentIOTracking } from '../utilities/useSegmentIOTracking';
import { fireTrackingEvent, initSegment } from '../utilities/segmentIOUtils';
import { RootState } from '../redux/types';

const App: React.FC = () => {
  const isDeskTop = useDesktopWidth();
  const [isNavOpen, setIsNavOpen] = React.useState(isDeskTop);
  const dispatch = useDispatch();
  const history = useHistory();
  const { segmentKey, loaded, loadError } = useSegmentIOTracking();
  const username = useSelector((state: RootState) => state.appReducer.user);
  const clusterID = useSelector((state: RootState) => state.appReducer.clusterID);

  React.useEffect(() => {
    dispatch(detectUser());
  }, [dispatch]);

  React.useEffect(() => {
    setIsNavOpen(isDeskTop);
  }, [isDeskTop]);

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  // when there is a segment key and username and cluster id, initialize segment.io script
  React.useEffect(() => {
    if (segmentKey && loaded && !loadError && username && clusterID) {
      window.clusterID = clusterID;
      initSegment({ segmentKey, username });
    }
  }, [segmentKey, loaded, loadError, username, clusterID]);

  const TrackURLChangeEvent = () => {
    // notify url change events
    React.useEffect(() => {
      let { pathname } = history.location;
      const unlisten = history.listen(() => {
        const { pathname: nextPathname } = history.location;
        if (pathname !== nextPathname) {
          pathname = nextPathname;
          fireTrackingEvent('page');
        }
      });
      return () => unlisten();
    }, []);

    return null;
  };

  return (
    <Page
      className="odh-dashboard"
      header={<Header isNavOpen={isNavOpen} onNavToggle={onNavToggle} />}
      sidebar={<NavSidebar isNavOpen={isNavOpen} />}
    >
      <TrackURLChangeEvent />
      <Routes />
    </Page>
  );
};

export default App;
