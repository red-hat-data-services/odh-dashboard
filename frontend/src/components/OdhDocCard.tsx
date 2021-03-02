import React from 'react';
import { Brand, Card, CardBody, CardFooter, CardHeader, CardTitle } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { QuickStartContext, QuickStartContextValues } from '@cloudmosaic/quickstarts';
import { ODHAppType, ODHDocType } from '../types';

import './OdhCard.scss';

type OdhDocCardProps = {
  odhApp: ODHAppType;
  docType: ODHDocType;
};

const OdhDocCard: React.FC<OdhDocCardProps> = ({ odhApp, docType }) => {
  const qsContext = React.useContext<QuickStartContextValues>(QuickStartContext);

  const onQuickStart = (e) => {
    e.preventDefault();
    odhApp.spec.quickStart &&
      qsContext.setActiveQuickStart &&
      qsContext.setActiveQuickStart(odhApp.spec.quickStart);
  };

  const renderDocBadges = () => {
    if (docType === ODHDocType.Documentation) {
      return (
        <div className="odh-card__partner-badge odh-m-doc odh-m-documentation">Documentation</div>
      );
    }
    if (docType === ODHDocType.Tutorial) {
      return (
        <>
          <div className="odh-card__partner-badge odh-m-doc odh-m-tutorial">Tutorial</div>
          <div className="odh-card__partner-badge odh-m-doc">
            {odhApp.spec.tutorialLength} minutes
          </div>
        </>
      );
    }
    if (docType === ODHDocType.QuickStart) {
      return (
        <>
          <div className="odh-card__partner-badge odh-m-doc odh-m-quick-start">Quick start</div>
          <div className="odh-card__partner-badge odh-m-doc">
            {odhApp.spec.quickStartLength} minutes
          </div>
        </>
      );
    }
    if (docType === ODHDocType.HowDoI) {
      return (
        <>
          <div className="odh-card__partner-badge odh-m-doc odh-m-how-do-i">How do I</div>
          <div className="odh-card__partner-badge odh-m-doc">
            {odhApp.spec.howDoILength} minutes
          </div>
        </>
      );
    }
    return null;
  };

  const renderDocLink = () => {
    if (docType === ODHDocType.Documentation) {
      return (
        <a
          className="odh-card__footer__link"
          href={odhApp.spec?.docsLink ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to page
          <ExternalLinkAltIcon />
        </a>
      );
    }
    if (docType === ODHDocType.Tutorial) {
      return (
        <a
          className="odh-card__footer__link"
          href={odhApp.spec?.tutorial ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Access tutorial
          <ExternalLinkAltIcon />
        </a>
      );
    }
    if (docType === ODHDocType.QuickStart) {
      return (
        <a className="odh-card__footer__link" href="#" onClick={onQuickStart}>
          Quick start
        </a>
      );
    }
    if (docType === ODHDocType.HowDoI) {
      return (
        <a
          className="odh-card__footer__link"
          href={odhApp.spec?.howDoI ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Start the tour
          <ExternalLinkAltIcon />
        </a>
      );
    }
    return null;
  };

  return (
    <Card isHoverable className="odh-card">
      <CardHeader>
        <Brand
          className="odh-card__header-brand"
          src={odhApp.spec.img}
          alt={odhApp.spec.displayName}
        />
        <div className="odc-card__doc-badges">{renderDocBadges()}</div>
      </CardHeader>
      <CardTitle>{odhApp.spec.displayName}</CardTitle>
      <CardBody>{odhApp.spec.description}</CardBody>
      <CardFooter className="odh-card__footer">{renderDocLink()}</CardFooter>
    </Card>
  );
};

export default OdhDocCard;
