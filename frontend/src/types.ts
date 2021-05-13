/*
 * Common types, should be kept up to date with backend types
 */

export interface OdhApplication {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    [k: string]: unknown;
  };
  spec?: {
    category?: string;
    comingSoon?: boolean;
    csvName?: string;
    description?: string;
    displayName?: string;
    docsLink?: string;
    enable?: {
      actionLabel?: string;
      description?: string;
      title?: string;
      validationConfigMap?: string;
      validationJob?: string;
      validationSecret?: string;
      variableDisplayText?: {
        [k: string]: string;
      };
      variableHelpText?: {
        [k: string]: string;
      };
      variables?: {
        [k: string]: string;
      };
      [k: string]: unknown;
    };
    endPoint?: string;
    featureFlag?: string;
    getStartedLink?: string;
    img?: string;
    isEnabled?: boolean;
    kfdefApplications: string[];
    link?: string;
    provider?: string;
    quickStart?: string;
    route?: string;
    routeNamespace?: string;
    routeSuffix?: string;
    serviceName?: string;
    support?: string;
    [k: string]: unknown;
  };
  status?: {
    enabled?: boolean;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export enum OdhDocumentType {
  Documentation = 'documentation',
  HowTo = 'how-to',
  QuickStart = 'quickstart',
  Tutorial = 'tutorial',
}

export interface OdhDocument {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    [k: string]: unknown;
  };
  spec?: {
    appName?: string;
    description?: string;
    displayName?: string;
    durationMinutes: number;
    featureFlag?: string;
    icon?: string;
    img?: string;
    markDown?: string;
    provider?: string;
    type?: string;
    url?: string;
    [k: string]: unknown;
  };
  status?: {
    enabled?: boolean;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export type OdhGettingStarted = {
  appName: string;
  markDown: string;
};
