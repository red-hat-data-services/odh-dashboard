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
import { ODHAppType } from '../../types';
import OdhAppCard from '../../components/OdhAppCard';
import { getComponents } from '../../redux/actions/actions';

import './EnabledApplications.scss';

interface ConnectedEnabledApplicationsProps {
  components: ODHAppType[];
  getComponents: (installed: boolean) => void;
  componentsLoading: boolean;
  componentsError: { statusCode: number; error: string; message: string };
}
const ConnectedEnabledApplications: React.FC<ConnectedEnabledApplicationsProps> = ({
  components,
  getComponents,
  componentsLoading,
  componentsError,
}) => {
  React.useEffect(() => {
    getComponents(true);
  }, []);

  const renderComponents = React.useCallback(() => {
    return (
      <>
        {components
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((c) => (
            <OdhAppCard key={c.id} odhApp={c} />
          ))}
      </>
    );
  }, [components]);

  const buildComponentList = () => {
    if (componentsError) {
      return (
        <PageSection className="odh-installed-apps__error">
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={WarningTriangleIcon} />
            <Title headingLevel="h5" size="lg">
              Error loading components
            </Title>
            <EmptyStateBody className="odh-installed-apps__error-body">
              <div>
                <code className="odh-installed-apps__display-error">{componentsError.message}</code>
              </div>
            </EmptyStateBody>
          </EmptyState>
        </PageSection>
      );
    }

    if (componentsLoading) {
      return (
        <PageSection className="odh-installed-apps__loading">
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
      <PageSection className="odh-installed-apps__gallery">
        <Gallery hasGutter>{renderComponents()}</Gallery>
      </PageSection>
    );
  };

  return (
    <>
      <PageSection className="odh-installed-apps__heading" variant={PageSectionVariants.light}>
        <TextContent className="odh-installed-apps__heading__text">
          <Text component="h1">Enabled</Text>
          <Text component="p">
            Launch your enabled applications or get started with quick start instructions and tasks.
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
  getComponents: (installed: boolean) => dispatch(getComponents(installed)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedEnabledApplications);
