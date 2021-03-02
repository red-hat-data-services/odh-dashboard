import React from 'react';
import { Gallery, PageSection } from '@patternfly/react-core';
import { useWatchComponents } from '../../utilities/useWatchComponents';
import ApplicationsPage from '../ApplicationsPage';
import { ODHAppType, ODHDocType } from '../../types';
import QuickStarts from '../../app/QuickStarts';
import OdhDocCard from '../../components/OdhDocCard';

type DocAppType = {
  odhApp: ODHAppType;
  docType: ODHDocType;
};

const description = `Access all learning paths and getting started resources for Red Hat OpenShift
  Data Science and supported programs.`;

const LearningPaths: React.FC = () => {
  const { components, loaded, loadError } = useWatchComponents(false);
  const [docApps, setDocApps] = React.useState<DocAppType[]>([]);
  const isEmpty = !components || components.length === 0;

  React.useEffect(() => {
    if (loaded && !loadError) {
      const updatedDocApps = components.reduce((acc, component) => {
        if (component.spec.quickStart) {
          acc.push({ odhApp: component, docType: ODHDocType.QuickStart });
        }
        if (component.spec.howDoI) {
          acc.push({ odhApp: component, docType: ODHDocType.HowDoI });
        }
        if (component.spec.tutorial) {
          acc.push({ odhApp: component, docType: ODHDocType.Tutorial });
        }
        if (component.spec.docsLink) {
          acc.push({ odhApp: component, docType: ODHDocType.Documentation });
        }
        return acc;
      }, [] as DocAppType[]);
      setDocApps(updatedDocApps);
    }
  }, [components, loaded, loadError]);

  return (
    <QuickStarts>
      <ApplicationsPage
        title="Learning paths"
        description={description}
        loaded={loaded}
        empty={isEmpty}
        loadError={loadError}
      >
        {!isEmpty ? (
          <PageSection>
            <Gallery className="odh-explore-apps__gallery" hasGutter>
              {docApps
                .sort((a, b) => a.odhApp.spec.displayName.localeCompare(b.odhApp.spec.displayName))
                .map((app) => (
                  <OdhDocCard
                    key={app.odhApp.metadata.name}
                    odhApp={app.odhApp}
                    docType={app.docType}
                  />
                ))}
            </Gallery>
          </PageSection>
        ) : null}
      </ApplicationsPage>
    </QuickStarts>
  );
};

export default LearningPaths;
