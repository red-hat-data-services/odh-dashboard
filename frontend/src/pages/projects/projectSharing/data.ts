import { RoleBindingKind } from '~/k8sTypes';
import { SortableData } from '~/components/table/useTableColumnSort';
import { firstSubject } from './utils';
import { ProjectSharingRBType } from './types';

const COL_NAME: SortableData<RoleBindingKind> = {
  field: 'name',
  label: 'Username',
  width: 30,
  sortable: (a, b) => firstSubject(a).localeCompare(firstSubject(b)),
};

const COL_GROUPS: SortableData<RoleBindingKind> = {
  field: 'name',
  label: 'Groups',
  width: 30,
  sortable: (a, b) => firstSubject(a).localeCompare(firstSubject(b)),
};

export const columnsProjectSharing: SortableData<RoleBindingKind>[] = [
  {
    field: 'permission',
    label: 'Permission',
    width: 20,
    sortable: (a, b) => a.roleRef.name.localeCompare(b.roleRef.name),
  },
  {
    field: 'date',
    label: 'Date added',
    width: 25,
    sortable: (a, b) =>
      new Date(b.metadata.creationTimestamp || 0).getTime() -
      new Date(a.metadata.creationTimestamp || 0).getTime(),
  },
];

export const getColumnsProjectSharing = (
  projectType: ProjectSharingRBType,
): SortableData<RoleBindingKind>[] => [
  ...(projectType === ProjectSharingRBType.USER ? [COL_NAME] : [COL_GROUPS]),
  ...columnsProjectSharing,
];
