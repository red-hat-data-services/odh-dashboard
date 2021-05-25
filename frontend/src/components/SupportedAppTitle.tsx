import React from 'react';
import { CardTitle } from '@patternfly/react-core';
import { OdhApplication } from '../gen/io.openshift.console.applications.v1alpha1';

type SupportedAppTitleProps = {
  odhApp: OdhApplication;
  showProvider?: boolean;
};

const SupportedAppTitle: React.FC<SupportedAppTitleProps> = ({ odhApp, showProvider = false }) => {
  return (
    <CardTitle>
      <span className="odh-card__title-supported">{odhApp.spec.displayName}</span>
      {showProvider && odhApp.spec.provider ? (
        <div>
          <span className="odh-card__provider">by {odhApp.spec.provider}</span>
        </div>
      ) : null}
    </CardTitle>
  );
};

export default SupportedAppTitle;
