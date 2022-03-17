import * as React from 'react';
import * as _ from 'lodash-es';
import {
  Button,
  ButtonVariant,
  Checkbox,
  TextVariants,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  InputGroupTextVariant,
  PageSection,
  PageSectionVariants,
  Text,
  TextInput,
} from '@patternfly/react-core';
import ApplicationsPage from '../ApplicationsPage';
import { fetchClusterSettings, updateClusterSettings } from '../../services/clusterSettingsService';
import { ClusterSettings } from '../../types';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/actions/actions';
import './ClusterSettings.scss';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const description = `Update global settings for all users.`;

const DEFAULT_USER_TRACKING = false;
const DEFAULT_PVC_SIZE = 20;
const MIN_PVC_SIZE = 1;
const MAX_PVC_SIZE = 16384;
const DEFAULT_CONFIG: ClusterSettings = {
  userTrackingEnabled: DEFAULT_USER_TRACKING,
  pvcSize: DEFAULT_PVC_SIZE,
};

const ClusterSettings: React.FC = () => {
  const isEmpty = false;
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<Error>();
  const [clusterSettings, setClusterSettings] = React.useState(DEFAULT_CONFIG);
  const [pvcSize, setPvcSize] = React.useState<number | string>(DEFAULT_PVC_SIZE);
  const [userTrackingEnabled, setUserTrackingEnabled] =
    React.useState<boolean>(DEFAULT_USER_TRACKING);
  const pvcDefaultBtnRef = React.useRef<HTMLButtonElement>();
  const dispatch = useDispatch();

  React.useEffect(() => {
    fetchClusterSettings()
      .then((clusterSettings: ClusterSettings) => {
        setLoaded(true);
        setLoadError(undefined);
        setClusterSettings(clusterSettings);
        setPvcSize(clusterSettings.pvcSize);
        setUserTrackingEnabled(clusterSettings.userTrackingEnabled);
      })
      .catch((e) => {
        setLoadError(e);
      });
  }, []);

  const submitClusterSettings = (newClusterSettings: ClusterSettings) => {
    if (!_.isEqual(clusterSettings, newClusterSettings)) {
      if (Number(newClusterSettings?.pvcSize) !== 0) {
        updateClusterSettings(newClusterSettings)
          .then((response) => {
            if (response.success) {
              setClusterSettings(newClusterSettings);
              dispatch(
                addNotification({
                  status: 'success',
                  title: 'Cluster settings updated successfully.',
                  timestamp: new Date(),
                }),
              );
            } else {
              throw new Error(response.error);
            }
          })
          .catch((e) => {
            dispatch(
              addNotification({
                status: 'danger',
                title: 'Error',
                message: e.message,
                timestamp: new Date(),
              }),
            );
          });
      }
    }
  };

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
          <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <Form
                  className="odh-cluster-settings__form"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <FormGroup
                    fieldId="pvc-size"
                    label="PVC size"
                    helperText="Note: PVC size must be between 1 GiB and 16384 GiB."
                    helperTextInvalid="Note: PVC size must be between 1 GiB and 16384 GiB."
                    helperTextInvalidIcon={<ExclamationCircleIcon />}
                    validated={pvcSize !== '' ? 'success' : 'error'}
                  >
                    <Text>
                      Changing the PVC size changes the storage size attached to the new notebook
                      servers for all users.
                    </Text>
                    <InputGroup>
                      <TextInput
                        className="odh-number-input"
                        name="pvc"
                        id="pvc-size-input"
                        type="text"
                        aria-label="PVC Size Input"
                        value={pvcSize}
                        pattern="/^(\s*|\d+)$/"
                        onBlur={() => {
                          submitClusterSettings({ pvcSize: Number(pvcSize), userTrackingEnabled });
                        }}
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            if (pvcDefaultBtnRef.current) pvcDefaultBtnRef.current.focus();
                          }
                        }}
                        onChange={async (value: string) => {
                          const modifiedValue = value.replace(/ /g, '');
                          if (modifiedValue !== '') {
                            let newValue = Number.isInteger(Number(modifiedValue))
                              ? Number(modifiedValue)
                              : pvcSize;
                            newValue =
                              newValue > MAX_PVC_SIZE
                                ? MAX_PVC_SIZE
                                : newValue < MIN_PVC_SIZE
                                ? MIN_PVC_SIZE
                                : newValue;
                            setPvcSize(newValue);
                          } else {
                            setPvcSize(modifiedValue);
                          }
                        }}
                      />
                      <InputGroupText id="plain-example" variant={InputGroupTextVariant.plain}>
                        GiB
                      </InputGroupText>
                    </InputGroup>
                    <Button
                      innerRef={pvcDefaultBtnRef}
                      variant={ButtonVariant.secondary}
                      onClick={() => {
                        submitClusterSettings({ pvcSize: DEFAULT_PVC_SIZE, userTrackingEnabled });
                        setPvcSize(DEFAULT_PVC_SIZE);
                      }}
                    >
                      Restore Default
                    </Button>
                  </FormGroup>
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
                      isChecked={userTrackingEnabled}
                      onChange={() => {
                        submitClusterSettings({
                          pvcSize: Number(pvcSize),
                          userTrackingEnabled: !userTrackingEnabled,
                        });
                        setUserTrackingEnabled(!userTrackingEnabled);
                      }}
                      aria-label="usageData"
                      id="usage-data-checkbox"
                      name="usageDataCheckbox"
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </PageSection>
        </div>
      ) : null}
    </ApplicationsPage>
  );
};

export default ClusterSettings;
