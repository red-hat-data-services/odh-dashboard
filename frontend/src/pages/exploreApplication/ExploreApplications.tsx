import React from 'react';
import { connect } from 'react-redux';
import { QuestionCircleIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import {
  PageSection,
  PageSectionVariants,
  Gallery,
  TextContent,
  Text,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Spinner,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { getComponents } from '../../redux/actions/actions';
import { ODHAppType } from '../../types';
import OdhExploreCard from '../../components/OdhExploreCard';

import './ExploreApplications.scss';

interface ConnectedExploreApplicationsProps {
  components: ODHAppType[];
  getComponents: () => void;
  componentsLoading: boolean;
  componentsError: boolean;
}
const ConnectedExploreApplications: React.FC<ConnectedExploreApplicationsProps> = ({
  components,
  getComponents,
  componentsLoading,
  componentsError,
}) => {
  const [selectedComponent, setSelectedComponent] = React.useState<string>();

  React.useEffect(() => {
    getComponents();
  }, []);

  const renderComponents = React.useCallback(() => {
    return (
      <>
        {components
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((c) => (
            <OdhExploreCard
              key={c.id}
              odhApp={c}
              isSelected={selectedComponent === c.label}
              onSelect={() => setSelectedComponent(c.label)}
            />
          ))}
      </>
    );
  }, [components]);

  const buildComponentList = () => {
    if (componentsError) {
      return (
        <PageSection className="odh-explore-apps__error">
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={WarningTriangleIcon} />
            <Title headingLevel="h5" size="lg">
              Error loading components
            </Title>
            <EmptyStateBody className="odh-explore-apps__error-body">
              <div>
                <code className="odh-explore-apps__display-error">
                  {JSON.stringify(componentsError, null, 2)}
                </code>
              </div>
            </EmptyStateBody>
          </EmptyState>
        </PageSection>
      );
    }

    if (componentsLoading) {
      return (
        <PageSection className="odh-explore-apps__loading">
          <EmptyState variant={EmptyStateVariant.full}>
            <Spinner size="xl" />
            <Title headingLevel="h5" size="lg">
              Loading
            </Title>
          </EmptyState>
        </PageSection>
      );
    }

    if (!components || components.length === 0) {
      return (
        <PageSection>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={QuestionCircleIcon} />

            <Title headingLevel="h5" size="lg">
              No Components Found
            </Title>
          </EmptyState>
        </PageSection>
      );
    }

    return (
      <PageSection className="odh-explore-apps__gallery">
        <Gallery hasGutter>{renderComponents()}</Gallery>
      </PageSection>
    );
  };

  return (
    <>
      <PageSection className="odh-explore-apps__heading" variant={PageSectionVariants.light}>
        <TextContent className="odh-explore-apps__heading__text">
          <Text component="h1">Explore</Text>
          <Text component="p">
            This is a catalog of all the third-party supported optional programs you can add to your
            Managed Open Data Hub instance.
          </Text>
        </TextContent>
      </PageSection>
      {buildComponentList()}
    </>
  );
};

const mapStateToProps = (state) => {
  return state.appReducer;
};

const mapDispatchToProps = (dispatch) => ({
  getComponents: () => dispatch(getComponents()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedExploreApplications);
