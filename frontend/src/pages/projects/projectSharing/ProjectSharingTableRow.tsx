import * as React from 'react';
import { ActionsColumn, Tbody, Td, Tr } from '@patternfly/react-table';
import {
  Button,
  DropdownDirection,
  Flex,
  FlexItem,
  Text,
  Timestamp,
  TimestampTooltipVariant,
} from '@patternfly/react-core';
import { CheckIcon, TimesIcon } from '@patternfly/react-icons';
import { RoleBindingKind } from '~/k8sTypes';
import { relativeTime } from '~/utilities/time';
import { castProjectSharingRoleType, firstSubject } from './utils';
import { ProjectSharingRoleType } from './types';
import ProjectSharingNameInput from './ProjectSharingNameInput';
import ProjectSharingPermissionSelection from './ProjectSharingPermissionSelection';

type ProjectSharingTableRowProps = {
  obj: RoleBindingKind;
  isEditing: boolean;
  typeAhead?: string[];
  onChange: (name: string, roleType: ProjectSharingRoleType) => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const ProjectSharingTableRow: React.FC<ProjectSharingTableRowProps> = ({
  obj,
  isEditing,
  typeAhead,
  onChange,
  onCancel,
  onEdit,
  onDelete,
}) => {
  const [roleBindingName, setRoleBindingName] = React.useState(firstSubject(obj));
  const [roleBindingRoleRef, setRoleBindingRoleRef] = React.useState<ProjectSharingRoleType>(
    castProjectSharingRoleType(obj.roleRef.name) || ProjectSharingRoleType.EDIT,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const createdDate = new Date(obj.metadata.creationTimestamp || '');

  return (
    <Tbody>
      <Tr>
        <Td dataLabel="Username">
          {isEditing ? (
            <ProjectSharingNameInput
              value={roleBindingName}
              onChange={(selection) => {
                setRoleBindingName(selection);
              }}
              onClear={() => setRoleBindingName('')}
              placeholderText={roleBindingName}
              typeAhead={typeAhead}
            />
          ) : (
            <Text>{roleBindingName}</Text>
          )}
        </Td>
        <Td dataLabel="Permission">
          {isEditing ? (
            <ProjectSharingPermissionSelection
              selection={roleBindingRoleRef}
              onSelect={(selection) => {
                setRoleBindingRoleRef(selection);
              }}
            />
          ) : (
            <Text> {roleBindingRoleRef}</Text>
          )}
        </Td>
        <Td dataLabel="Date added">
          {!isEditing && (
            <Text>
              <Timestamp date={createdDate} tooltip={{ variant: TimestampTooltipVariant.default }}>
                {relativeTime(Date.now(), createdDate.getTime())}
              </Timestamp>
            </Text>
          )}
        </Td>
        <Td isActionCell modifier="nowrap">
          <Flex
            direction={{ default: 'row' }}
            justifyContent={{ default: 'justifyContentFlexEnd' }}
            flexWrap={{ default: 'nowrap' }}
          >
            {isEditing ? (
              <>
                <FlexItem spacer={{ default: 'spacerNone' }}>
                  <Button
                    data-id="save-rolebinding-button"
                    variant="link"
                    icon={<CheckIcon />}
                    isDisabled={isLoading || !roleBindingName || !roleBindingRoleRef}
                    onClick={() => {
                      setIsLoading(true);
                      onChange(roleBindingName, roleBindingRoleRef);
                    }}
                  />
                </FlexItem>
                <FlexItem spacer={{ default: 'spacerNone' }}>
                  <Button
                    data-id="cancel-rolebinding-button"
                    variant="plain"
                    isDisabled={isLoading}
                    icon={<TimesIcon />}
                    onClick={() => {
                      onCancel();
                    }}
                  />
                </FlexItem>
              </>
            ) : (
              <FlexItem spacer={{ default: 'spacerNone' }}>
                <ActionsColumn
                  dropdownDirection={DropdownDirection.up}
                  items={[
                    {
                      title: 'Edit',
                      onClick: () => {
                        onEdit();
                      },
                    },
                    {
                      title: 'Delete',
                      onClick: () => {
                        onDelete();
                      },
                    },
                  ]}
                />
              </FlexItem>
            )}
          </Flex>
        </Td>
      </Tr>
    </Tbody>
  );
};

export default ProjectSharingTableRow;
