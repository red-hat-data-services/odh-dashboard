import React from 'react';
import { Label, LabelGroup } from '@patternfly/react-core';
import { getILabLabels, removeILabLabels } from '~/pages/modelCatalog/utils';

export const ModelCatalogLabels: React.FC<{
  labels?: string[];
  tasks?: string[];
  showNonILabLabels?: boolean;
}> = ({ labels = [], tasks = [], showNonILabLabels = false }) => (
  <LabelGroup data-testid="model-catalog-label-group">
    {getILabLabels(labels).map((l) => {
      switch (l) {
        case 'lab-base':
          return (
            <Label data-testid="model-catalog-label" color="yellow" variant="filled">
              LAB starter
            </Label>
          );
        case 'lab-teacher':
          return (
            <Label data-testid="model-catalog-label" color="purple" variant="filled">
              LAB teacher
            </Label>
          );
        case 'lab-judge':
          return (
            <Label data-testid="model-catalog-label" color="orange" variant="filled">
              LAB judge
            </Label>
          );
        default:
          return (
            <Label data-testid="model-catalog-label" key={l} variant="outline">
              {l}
            </Label>
          );
      }
    })}
    {tasks.map((task) => (
      <Label data-testid="model-catalog-label" key={task} variant="outline">
        {task}
      </Label>
    ))}
    {showNonILabLabels &&
      removeILabLabels(labels).map((label) => (
        <Label data-testid="model-catalog-label" key={label} variant="outline">
          {label}
        </Label>
      ))}
  </LabelGroup>
);
