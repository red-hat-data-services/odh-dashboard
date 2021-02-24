import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Gallery,
  PageSection,
} from '@patternfly/react-core';
import { useWatchComponents } from '../../utilities/useWatchComponents';
import OdhExploreCard from '../../components/OdhExploreCard';
import ApplicationsPage from '../ApplicationsPage';
import { ODHAppType } from '../../types';
import GetStartedPanel from './GetStartedPanel';

const description = `Add optional programs to your Red Hat OpenShift Data Science instance.`;

const ExploreApplications: React.FC = () => {
  const { components, loaded, loadError } = useWatchComponents(false);
  const [selectedComponent, setSelectedComponent] = React.useState<ODHAppType>();
  const isEmpty = !components || components.length === 0;

  const updateSelection = React.useCallback(
    (selection?: ODHAppType): void => {
      if (!selection || selection === selectedComponent) {
        setSelectedComponent(undefined);
        return;
      }
      setSelectedComponent(selection);
    },
    [selectedComponent],
  );

  return (
    <ApplicationsPage
      title="Explore"
      description={description}
      loaded={loaded}
      empty={isEmpty}
      loadError={loadError}
    >
      {!isEmpty ? (
        <Drawer isExpanded={!!selectedComponent} isInline>
          <DrawerContent
            panelContent={
              <GetStartedPanel onClose={() => updateSelection()} selectedApp={selectedComponent} />
            }
          >
            <DrawerContentBody>
              <PageSection>
                <Gallery className="odh-explore-apps__gallery" hasGutter>
                  {components
                    .sort((a, b) => a.spec.displayName.localeCompare(b.spec.displayName))
                    .map((c) => (
                      <OdhExploreCard
                        key={c.metadata.name}
                        odhApp={c}
                        isSelected={selectedComponent === c}
                        onSelect={() => updateSelection(c)}
                      />
                    ))}
                </Gallery>
              </PageSection>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      ) : null}
    </ApplicationsPage>
  );
};

export default ExploreApplications;
