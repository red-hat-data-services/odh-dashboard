import {
  Flex,
  FlexItem,
  HelperTextItem,
  HelperText,
  Label,
  Split,
  SplitItem,
  Truncate,
  Stack,
  StackItem,
  Skeleton,
  MenuItem,
  FormHelperText,
} from '@patternfly/react-core';
import * as React from 'react';
import HardwareProfileDetailsPopover from '#~/concepts/hardwareProfiles/HardwareProfileDetailsPopover';
import { HardwareProfileConfig } from '#~/concepts/hardwareProfiles/useHardwareProfileConfig';
import {
  formatResource,
  formatResourceValue,
  getProfileScore,
} from '#~/concepts/hardwareProfiles/utils';
import SimpleSelect, { SimpleSelectOption } from '#~/components/SimpleSelect';
import { HardwareProfileKind, KnownLabels } from '#~/k8sTypes';
import TruncatedText from '#~/components/TruncatedText';
import ProjectScopedIcon from '#~/components/searchSelector/ProjectScopedIcon.tsx';
import {
  ProjectScopedGroupLabel,
  ProjectScopedSearchDropdown,
} from '#~/components/searchSelector/ProjectScopedSearchDropdown';
import ProjectScopedToggleContent from '#~/components/searchSelector/ProjectScopedToggleContent';
import { ScopedType } from '#~/pages/modelServing/screens/const';
import {
  getHardwareProfileDescription,
  getHardwareProfileDisplayName,
  isHardwareProfileEnabled,
} from '#~/pages/hardwareProfiles/utils.ts';
import { ProjectDetailsContext } from '#~/pages/projects/ProjectDetailsContext';
import { SupportedArea, useIsAreaAvailable } from '#~/concepts/areas';
import { SchedulingType } from '#~/types';

type HardwareProfileSelectProps = {
  initialHardwareProfile?: HardwareProfileKind;
  previewDescription?: boolean;
  hardwareProfiles: HardwareProfileKind[];
  isProjectScoped: boolean;
  hardwareProfilesLoaded: boolean;
  hardwareProfilesError: Error | undefined;
  projectScopedHardwareProfiles: [
    data: HardwareProfileKind[],
    loaded: boolean,
    loadError: Error | undefined,
    refresh: () => Promise<void>,
  ];
  allowExistingSettings: boolean;
  hardwareProfileConfig: HardwareProfileConfig;
  isHardwareProfileSupported: (profile: HardwareProfileKind) => boolean;
  onChange: (profile: HardwareProfileKind | undefined) => void;
  project?: string;
};

const EXISTING_SETTINGS_KEY = '.existing';

const HardwareProfileSelect: React.FC<HardwareProfileSelectProps> = ({
  initialHardwareProfile,
  previewDescription = false,
  hardwareProfiles,
  isProjectScoped,
  hardwareProfilesLoaded,
  hardwareProfilesError,
  projectScopedHardwareProfiles,
  allowExistingSettings = false,
  hardwareProfileConfig,
  isHardwareProfileSupported,
  onChange,
  project,
}) => {
  const [searchHardwareProfile, setSearchHardwareProfile] = React.useState('');
  const [
    currentProjectHardwareProfiles,
    currentProjectHardwareProfilesLoaded,
    currentProjectHardwareProfilesError,
  ] = projectScopedHardwareProfiles;

  const { currentProject } = React.useContext(ProjectDetailsContext);
  const isKueueEnabled = useIsAreaAvailable(SupportedArea.KUEUE).status;
  const isProjectKueueEnabled =
    currentProject.metadata.labels?.[KnownLabels.KUEUE_MANAGED] === 'true';

  const shouldFilterKueueProfiles = !isKueueEnabled || !isProjectKueueEnabled;

  const maybeRemoveKueueProfiles = React.useCallback(
    (hp: HardwareProfileKind) => {
      if (shouldFilterKueueProfiles) {
        return hp.spec.scheduling?.type !== SchedulingType.QUEUE;
      }
      return true;
    },
    [shouldFilterKueueProfiles],
  );

  const options = React.useMemo(() => {
    const enabledProfiles = hardwareProfiles
      .filter((hp) => isHardwareProfileEnabled(hp))
      .filter(maybeRemoveKueueProfiles)
      .toSorted((a, b) => {
        // First compare by whether they have extra resources
        const aHasExtra = (a.spec.identifiers ?? []).length > 2;
        const bHasExtra = (b.spec.identifiers ?? []).length > 2;

        // If one has extra resources and the other doesn't, sort the extra resources one later
        if (aHasExtra !== bHasExtra) {
          return aHasExtra ? 1 : -1;
        }

        // If they're the same (both have or both don't have extra resources),
        // then sort by their score
        return getProfileScore(a) - getProfileScore(b);
      });

    // allow continued use of already selected profile if it is disabled
    if (initialHardwareProfile && !isHardwareProfileEnabled(initialHardwareProfile)) {
      enabledProfiles.push(initialHardwareProfile);
    }

    const formattedOptions: SimpleSelectOption[] = enabledProfiles.map((profile) => {
      const displayName = `${getHardwareProfileDisplayName(profile)}${
        !isHardwareProfileEnabled(profile) ? ' (disabled)' : ''
      }`;
      const description = getHardwareProfileDescription(profile);

      return {
        key: profile.metadata.name,
        label: displayName,
        description: (
          <Stack>
            {description && (
              <StackItem>
                <TruncatedText maxLines={1} content={description} />
              </StackItem>
            )}
            {profile.spec.identifiers && (
              <StackItem>
                <Truncate
                  content={profile.spec.identifiers
                    .map((identifier) => {
                      const resourceValue = formatResourceValue(
                        identifier.defaultCount,
                        identifier.resourceType,
                      ).toString();
                      return formatResource(identifier.displayName, resourceValue, resourceValue);
                    })
                    .join('; ')}
                />
              </StackItem>
            )}
          </Stack>
        ),
        dropdownLabel: (
          <Split>
            <SplitItem>{displayName}</SplitItem>
            <SplitItem isFilled />
            <SplitItem>
              {isHardwareProfileSupported(profile) && <Label color="blue">Compatible</Label>}
            </SplitItem>
          </Split>
        ),
      };
    });

    // allow usage of existing settings if no hardware profile is found
    if (allowExistingSettings) {
      formattedOptions.push({
        key: EXISTING_SETTINGS_KEY,
        label: 'Use existing settings',
        description: 'Use existing resource requests/limits, tolerations, and node selectors.',
      });
    }

    return formattedOptions;
  }, [
    hardwareProfiles,
    initialHardwareProfile,
    allowExistingSettings,
    isHardwareProfileSupported,
    maybeRemoveKueueProfiles,
  ]);

  const renderMenuItem = (
    profile: HardwareProfileKind,
    index: number,
    scope: 'project' | 'global',
  ) => {
    const description = getHardwareProfileDescription(profile);
    return (
      <MenuItem
        key={`${index}-${scope}-hardware-profile-${profile.metadata.name}`}
        isSelected={
          profile.metadata.name === hardwareProfileConfig.selectedProfile?.metadata.name &&
          profile.metadata.namespace === hardwareProfileConfig.selectedProfile.metadata.namespace
        }
        onClick={() => onChange(profile)}
        icon={<ProjectScopedIcon isProject={scope === 'project'} alt="" />}
        description={
          <Stack style={{ marginLeft: '19px' }}>
            {description && (
              <StackItem>
                <Truncate content={description} />
              </StackItem>
            )}
            {profile.spec.identifiers && (
              <StackItem>
                <Truncate
                  content={profile.spec.identifiers
                    .map((identifier) =>
                      formatResource(
                        identifier.displayName,
                        identifier.defaultCount.toString(),
                        identifier.defaultCount.toString(),
                      ),
                    )
                    .join('; ')}
                />
              </StackItem>
            )}
          </Stack>
        }
      >
        <Split>
          <SplitItem>{getHardwareProfileDisplayName(profile)}</SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            {isHardwareProfileSupported(profile) && <Label color="blue">Compatible</Label>}
          </SplitItem>
        </Split>
      </MenuItem>
    );
  };

  // Restore filtering and sorting logic for project and global hardware profiles
  const getHardwareProfiles = () => {
    const currentProjectEnabledProfiles = currentProjectHardwareProfiles
      .filter((hp) => isHardwareProfileEnabled(hp))
      .toSorted((a, b) => {
        const aHasExtra = (a.spec.identifiers ?? []).length > 2;
        const bHasExtra = (b.spec.identifiers ?? []).length > 2;
        if (aHasExtra !== bHasExtra) {
          return aHasExtra ? 1 : -1;
        }
        return getProfileScore(a) - getProfileScore(b);
      });
    if (initialHardwareProfile && !isHardwareProfileEnabled(initialHardwareProfile)) {
      currentProjectEnabledProfiles.push(initialHardwareProfile);
    }
    return currentProjectEnabledProfiles
      .filter(maybeRemoveKueueProfiles)
      .filter((profile) =>
        getHardwareProfileDisplayName(profile)
          .toLocaleLowerCase()
          .includes(searchHardwareProfile.toLocaleLowerCase()),
      );
  };

  const getDashboardHardwareProfiles = () => {
    const DashboardEnabledProfiles = hardwareProfiles
      .filter((hp) => isHardwareProfileEnabled(hp))
      .toSorted((a, b) => {
        const aHasExtra = (a.spec.identifiers ?? []).length > 2;
        const bHasExtra = (b.spec.identifiers ?? []).length > 2;
        if (aHasExtra !== bHasExtra) {
          return aHasExtra ? 1 : -1;
        }
        return getProfileScore(a) - getProfileScore(b);
      });
    if (initialHardwareProfile && !isHardwareProfileEnabled(initialHardwareProfile)) {
      DashboardEnabledProfiles.push(initialHardwareProfile);
    }
    return DashboardEnabledProfiles.filter(maybeRemoveKueueProfiles).filter((profile) =>
      getHardwareProfileDisplayName(profile)
        .toLocaleLowerCase()
        .includes(searchHardwareProfile.toLocaleLowerCase()),
    );
  };

  if (isProjectScoped && !currentProjectHardwareProfilesLoaded && !hardwareProfilesLoaded) {
    return <Skeleton />;
  }

  return (
    <>
      <Flex direction={{ default: 'row' }} spaceItems={{ default: 'spaceItemsSm' }}>
        <FlexItem grow={{ default: 'grow' }}>
          {isProjectScoped && currentProjectHardwareProfiles.length > 0 ? (
            <>
              <ProjectScopedSearchDropdown
                projectScopedItems={getHardwareProfiles()}
                globalScopedItems={getDashboardHardwareProfiles()}
                renderMenuItem={renderMenuItem}
                searchValue={searchHardwareProfile}
                onSearchChange={setSearchHardwareProfile}
                onSearchClear={() => setSearchHardwareProfile('')}
                toggleContent={
                  <ProjectScopedToggleContent
                    displayName={
                      hardwareProfileConfig.selectedProfile
                        ? getHardwareProfileDisplayName(hardwareProfileConfig.selectedProfile)
                        : undefined
                    }
                    isProject={
                      hardwareProfileConfig.selectedProfile?.metadata.namespace === project
                    }
                    projectLabel={ScopedType.Project}
                    globalLabel={ScopedType.Global}
                    fallback={
                      allowExistingSettings ? 'Use existing settings' : 'Select hardware profile...'
                    }
                  />
                }
                projectGroupLabel={
                  <ProjectScopedGroupLabel isProject>
                    Project-scoped hardware profiles
                  </ProjectScopedGroupLabel>
                }
                globalGroupLabel={
                  <ProjectScopedGroupLabel isProject={false}>
                    Global-scoped hardware profiles
                  </ProjectScopedGroupLabel>
                }
                dataTestId="hardware-profile-selection"
                projectGroupTestId="project-scoped-hardware-profiles"
                globalGroupTestId="global-scoped-hardware-profiles"
                isFullWidth
              />
              {previewDescription &&
              hardwareProfileConfig.selectedProfile &&
              (getHardwareProfileDescription(hardwareProfileConfig.selectedProfile) ||
                hardwareProfileConfig.selectedProfile.spec.identifiers) ? (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem>
                      <TruncatedText
                        maxLines={2}
                        content={
                          getHardwareProfileDescription(hardwareProfileConfig.selectedProfile) ||
                          (hardwareProfileConfig.selectedProfile.spec.identifiers &&
                            hardwareProfileConfig.selectedProfile.spec.identifiers
                              .map((identifier) =>
                                formatResource(
                                  identifier.displayName,
                                  identifier.defaultCount.toString(),
                                  identifier.defaultCount.toString(),
                                ),
                              )
                              .join('; '))
                        }
                      />
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              ) : hardwareProfileConfig.useExistingSettings ? (
                'Use existing resource requests/limits, tolerations, and node selectors.'
              ) : null}
              {(hardwareProfilesError || currentProjectHardwareProfilesError) && (
                <HelperText isLiveRegion>
                  <HelperTextItem variant="error">Error loading hardware profiles</HelperTextItem>
                </HelperText>
              )}
            </>
          ) : (
            <>
              <SimpleSelect
                dataTestId="hardware-profile-select"
                previewDescription={previewDescription}
                options={options}
                value={
                  hardwareProfileConfig.selectedProfile?.metadata.name ??
                  (hardwareProfileConfig.useExistingSettings ? EXISTING_SETTINGS_KEY : undefined)
                }
                onChange={(key) => {
                  if (key === EXISTING_SETTINGS_KEY) {
                    onChange(undefined);
                  } else {
                    const profile = hardwareProfiles.find((hp) => hp.metadata.name === key);
                    if (profile) {
                      onChange(profile);
                    }
                  }
                }}
                placeholder={
                  options.length > 0
                    ? 'Select hardware profile...'
                    : hardwareProfilesError
                    ? 'Error loading hardware profiles'
                    : 'No enabled or valid hardware profiles are available. Contact your administrator.'
                }
                isFullWidth
                isSkeleton={!hardwareProfilesLoaded && !hardwareProfilesError}
                isScrollable
              />
              {hardwareProfilesError && (
                <HelperText isLiveRegion>
                  <HelperTextItem variant="error">Error loading hardware profiles</HelperTextItem>
                </HelperText>
              )}
            </>
          )}
        </FlexItem>
        <FlexItem>
          {options.length > 0 && (
            <HardwareProfileDetailsPopover
              hardwareProfile={hardwareProfileConfig.selectedProfile}
              localQueueName={
                hardwareProfileConfig.selectedProfile?.spec.scheduling?.kueue?.localQueueName
              }
              priorityClass={
                hardwareProfileConfig.selectedProfile?.spec.scheduling?.kueue?.priorityClass
              }
              tolerations={
                hardwareProfileConfig.selectedProfile?.spec.scheduling?.node?.tolerations
              }
              nodeSelector={
                hardwareProfileConfig.selectedProfile?.spec.scheduling?.node?.nodeSelector
              }
              resources={hardwareProfileConfig.resources}
            />
          )}
        </FlexItem>
      </Flex>
    </>
  );
};

export default HardwareProfileSelect;
