import React from 'react';
import { useSelector } from 'react-redux';
import {
  ApplicationLauncher,
  ApplicationLauncherGroup,
  ApplicationLauncherItem,
} from '@patternfly/react-core';
import openshiftLogo from '../images/openshift.svg';
import { RootState } from '../redux/types';

const consolePrefix = 'console-openshift-console';

export const getOCMLink = (clusterID: string): string =>
  `https://cloud.redhat.com/openshift/details/${clusterID}`;

export const getOpenShiftDedicatedLink = (): string => {
  const { hostname, protocol, port } = window.location;
  const hostParts = hostname.split('.').slice(1);
  if (hostParts.length < 2) {
    return '';
  }
  return `${protocol}//${consolePrefix}.${hostParts.join('.')}:${port}`;
};

const AppLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [clusterID, clusterBranding] = useSelector((state: RootState) => [
    state.appState.clusterID,
    state.appState.clusterBranding,
  ]);
  const osDedicatedLink = getOpenShiftDedicatedLink();

  const onToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  const appLauncherItems: React.ReactNode[] = [];
  if (clusterID && clusterBranding !== 'okd' && clusterBranding !== 'azure') {
    appLauncherItems.push(
      <ApplicationLauncherItem
        key="os-cluster-manager"
        href={getOCMLink(clusterID)}
        isExternal
        icon={<img src={openshiftLogo} alt="" />}
        rel="noopener noreferrer"
        target="_blank"
      >
        OpenShift Cluster Manager
      </ApplicationLauncherItem>,
    );
  }
  if (osDedicatedLink) {
    appLauncherItems.push(
      <ApplicationLauncherItem
        key="os-dedicated"
        href={osDedicatedLink}
        isExternal
        icon={<img src={openshiftLogo} alt="" />}
        rel="noopener noreferrer"
        target="_blank"
      >
        OpenShift Dedicated
      </ApplicationLauncherItem>,
    );
  }

  if (appLauncherItems.length === 0) {
    return null;
  }

  return (
    <ApplicationLauncher
      aria-label="Application launcher"
      className="co-app-launcher"
      onSelect={onSelect}
      onToggle={onToggle}
      isOpen={isOpen}
      items={[
        <ApplicationLauncherGroup key="rh-apps" label="Red Hat Applications">
          {appLauncherItems}
        </ApplicationLauncherGroup>,
      ]}
      position="right"
      isGrouped
    />
  );
};

export default AppLauncher;
