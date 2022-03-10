import * as React from 'react';
import {
  Form,
  FormGroup,
  Checkbox,
  PageSection,
  PageSectionVariants,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import ApplicationsPage from '../ApplicationsPage';
import { fetchClusterSettings, updateClusterSettings } from '../../services/clusterSettingsService';
import { ClusterSettings } from '../../types';
import './ClusterSettings.scss';

const description = `Update global settings for all users.`;

const DEFAULT_CONFIG: ClusterSettings = {
  userTrackingEnabled: false,
};

const ClusterSettings: React.FC = () => {
  const isEmpty = false;
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<Error>();
  const [clusterSettings, setClusterSettings] = React.useState<ClusterSettings>(DEFAULT_CONFIG);

  React.useEffect(() => {
    fetchClusterSettings()
      .then((clusterSettings: ClusterSettings) => {
        setLoaded(true);
        setLoadError(undefined);
        setClusterSettings(clusterSettings);
      })
      .catch((e) => {
        setLoadError(e);
      });
  }, []);

  return (
    <ApplicationsPage
      title="Cluster Settings"
      description={description}
      loaded={loaded}
      empty={isEmpty}
      loadError={loadError}
      errorMessage="Unable to load cluster settings."
      emptyMessage="No cluster settings found."
    >
      {!isEmpty ? (
        <div className="odh-cluster-settings">
          <PageSection variant={PageSectionVariants.light}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <FormGroup
                fieldId="usage-data"
                label="Usage Data Collection"
                helperText={
                  <Text component={TextVariants.small}>
                    For more information see the{' '}
                    <Text
                      component={TextVariants.a}
                      href="https://access.redhat.com/documentation/en-us/red_hat_openshift_data_science/1/html/managing_users_and_user_resources/usage-data-collection#usage-data-collection-notice-for-openshift-data-science"
                      target="_blank"
                    >
                      documentation
                    </Text>
                    .
                  </Text>
                }
              >
                <Checkbox
                  label="Allow collection of usage data"
                  isChecked={clusterSettings.userTrackingEnabled}
                  onChange={async () => {
                    try {
                      const updatedClusterSettings = {
                        userTrackingEnabled: !clusterSettings.userTrackingEnabled,
                      };
                      const response: ClusterSettings = await updateClusterSettings(
                        updatedClusterSettings,
                      );
                      setClusterSettings(response);
                    } catch (e) {
                      console.log('Error changing data collection');
                    }
                  }}
                  aria-label="usageData"
                  id="usage-data-checkbox"
                  name="usageDataCheckbox"
                />
              </FormGroup>
            </Form>
          </PageSection>
        </div>
      ) : null}
    </ApplicationsPage>
  );
};

export default ClusterSettings;
