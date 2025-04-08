import * as React from 'react';
import {
  ActionList,
  Alert,
  ActionListItem,
  Button,
  ButtonVariant,
  Divider,
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Text,
  TextContent,
  Tooltip,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { AlertVariant } from '@patternfly/react-core';
import { OdhApplication } from '~/types';
import MarkdownView from '~/components/MarkdownView';
import { markdownConverter } from '~/utilities/markdown';
import { useAppContext } from '~/app/AppContext';
import { fireMiscTrackingEvent } from '~/concepts/analyticsTracking/segmentIOUtils';
import { useIntegratedAppStatus } from '~/pages/exploreApplication/useIntegratedAppStatus';
import { addNotification } from '~/redux/actions/actions';
import { useAppDispatch } from '~/redux/hooks';

const DEFAULT_BETA_TEXT =
  'This application is available for early access prior to official ' +
  ' release. It won’t appear in the *Enabled* view, but you can access it by' +
  ' [signing up for beta access.](https://www.starburst.io/platform/starburst-galaxy/).';

type GetStartedPanelProps = {
  selectedApp?: OdhApplication;
  onClose: () => void;
  onEnable: () => void;
};

const fetchNimIntegrationStatus = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/integrations/nim');
    const data = await res.json();
    return data?.isEnabled === true;
  } catch (err) {
    console.error('[NIM] Failed to fetch /api/integrations/nim:', err);
    return false;
  }
};

const GetStartedPanel: React.FC<GetStartedPanelProps> = ({ selectedApp, onClose, onEnable }) => {
  const { dashboardConfig } = useAppContext();
  const { enablement } = dashboardConfig.spec.dashboardConfig;
  const [{ isInstalled, canInstall, error }, loaded] = useIntegratedAppStatus(selectedApp);
  const [isActuallyEnabled, setIsActuallyEnabled] = React.useState(false);

  const dispatch = useAppDispatch();
  const hasNotifiedRef = React.useRef(false);

  React.useEffect(() => {
    if (selectedApp?.metadata.name !== 'nvidia-nim' || isActuallyEnabled) return;

    let interval: NodeJS.Timer;

    const checkEnabled = async () => {
      const enabled = await fetchNimIntegrationStatus();
      if (enabled) {
        setIsActuallyEnabled(true);
        clearInterval(interval);

        if (!hasNotifiedRef.current) {
          dispatch(
            addNotification({
              status: AlertVariant.success,
              title: `${selectedApp.spec.displayName} has been added to the Enabled page.`,
              timestamp: new Date(),
            }),
          );
          hasNotifiedRef.current = true;
        }
      }
    };

    checkEnabled();
    interval = setInterval(checkEnabled, 2000);

    return () => clearInterval(interval);
  }, [selectedApp?.metadata.name, isActuallyEnabled, dispatch, selectedApp?.spec.displayName]);

  if (!selectedApp) {
    return null;
  }

  const renderEnableButton = () => {
    const shouldHide =
      !selectedApp.spec.enable || selectedApp.spec.isEnabled || isInstalled || isActuallyEnabled;

    if (shouldHide) {
      return null;
    }

    const button = (
      <Button
        variant={ButtonVariant.secondary}
        onClick={onEnable}
        isDisabled={!enablement || !canInstall}
        isLoading={!loaded && !error}
      >
        Enable
      </Button>
    );

    return enablement ? button : (
      <Tooltip content="This feature has been disabled by an administrator.">
        <span>{button}</span>
      </Tooltip>
    );
  };

  return (
    <DrawerPanelContent
      data-testid="explore-drawer-panel"
      className="odh-get-started"
      isResizable
      minSize="350px"
    >
      <DrawerHead>
        <TextContent>
          <Text component="h2" style={{ marginBottom: 0 }}>
            {selectedApp.spec.displayName}
          </Text>
          {selectedApp.spec.provider && (
            <Text component="small">by {selectedApp.spec.provider}</Text>
          )}
        </TextContent>
        <DrawerActions>
          <DrawerCloseButton onClick={onClose} />
        </DrawerActions>
      </DrawerHead>

      {selectedApp.spec.getStartedLink && (
        <DrawerPanelBody>
          <ActionList>
            <ActionListItem>
              <Button
                icon={<ExternalLinkAltIcon />}
                onClick={() =>
                  fireMiscTrackingEvent('Explore card get started clicked', {
                    name: selectedApp.metadata.name,
                  })
                }
                iconPosition="right"
                href={selectedApp.spec.getStartedLink}
                target="_blank"
                rel="noopener noreferrer"
                component="a"
              >
                Get started
              </Button>
            </ActionListItem>
            <ActionListItem>{renderEnableButton()}</ActionListItem>
          </ActionList>
        </DrawerPanelBody>
      )}

      <Divider />

      <DrawerPanelBody style={{ paddingTop: 0 }}>
        {selectedApp.spec.beta && (
          <Alert
            variantLabel="error"
            variant="info"
            title={
              selectedApp.spec.betaTitle || `${selectedApp.spec.displayName} is currently in beta.`
            }
            aria-live="polite"
            isInline
          >
            <div
              dangerouslySetInnerHTML={{
                __html: markdownConverter.makeHtml(selectedApp.spec.betaText || DEFAULT_BETA_TEXT),
              }}
            />
          </Alert>
        )}
        <MarkdownView markdown={selectedApp.spec.getStartedMarkDown} />
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
};

export default GetStartedPanel;
