import * as React from 'react';
import * as _ from 'lodash-es';
import { ConsoleLinkKind } from '../types';
import { POLL_INTERVAL } from './const';
import { fetchConsoleLinks } from '../services/consoleLinksService';

export type ConsoleLinkResults = {
  consoleLinks: ConsoleLinkKind[];
  loaded: boolean;
  loadError?: Error;
};

export const useWatchConsoleLinks = (): ConsoleLinkResults => {
  const [results, setResults] = React.useState<ConsoleLinkResults>({
    consoleLinks: [],
    loaded: false,
  });

  React.useEffect(() => {
    let watchHandle;
    const watchConsoleLinks = () => {
      fetchConsoleLinks()
        .then((consoleLinks: ConsoleLinkKind[]) => {
          const newResults: ConsoleLinkResults = {
            consoleLinks,
            loaded: true,
          };
          if (!_.isEqual(newResults, results)) {
            setResults(newResults);
          }
        })
        .catch((e) => {
          setResults({ consoleLinks: [], loaded: false, loadError: e });
        });
      watchHandle = setTimeout(watchConsoleLinks, POLL_INTERVAL);
    };
    watchConsoleLinks();

    return () => {
      if (watchHandle) {
        clearTimeout(watchHandle);
      }
    };
    // Don't update when results are updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return results;
};
