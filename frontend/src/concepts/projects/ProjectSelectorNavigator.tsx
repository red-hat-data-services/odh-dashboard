import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectsContext } from '~/concepts/projects/ProjectsContext';
import ProjectSelector from './ProjectSelector';

type ProjectSelectorProps = {
  getRedirectPath: (namespace: string) => string;
} & Omit<React.ComponentProps<typeof ProjectSelector>, 'onSelection' | 'namespace'>;

const ProjectSelectorNavigator: React.FC<ProjectSelectorProps> = ({
  getRedirectPath,
  ...projectSelectorProps
}) => {
  const navigate = useNavigate();
  const { namespace } = useParams();
  const { updatePreferredProject } = React.useContext(ProjectsContext);

  return (
    <ProjectSelector
      {...projectSelectorProps}
      onSelection={(projectName) => {
        if (!projectName) {
          updatePreferredProject(null);
        }
        navigate(getRedirectPath(projectName));
      }}
      namespace={namespace ?? ''}
    />
  );
};

export default ProjectSelectorNavigator;
