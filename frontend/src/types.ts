/*
 * Common types, should be kept up to date with backend types
 */

export enum OdhDocumentType {
  Documentation = 'documentation',
  HowTo = 'how-to',
  QuickStart = 'quickstart',
  Tutorial = 'tutorial',
}

export type OdhGettingStarted = {
  appName: string;
  markDown: string;
};
