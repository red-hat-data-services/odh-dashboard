import * as apisMetaV1 from './io.k8s.apimachinery.pkg.apis.meta.v1';

// OdhDocument is the Schema for the odhdocuments API
export class OdhDocument {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata?: apisMetaV1.ObjectMeta_v2;

  // OdhDocumentSpec defines the desired state of OdhDocument
  public spec?: OdhDocument.Spec;

  // OdhDocumentStatus defines the observed state of OdhDocument
  public status?: OdhDocument.Status;

  constructor(desc: OdhDocument) {
    this.apiVersion = OdhDocument.apiVersion;
    this.kind = OdhDocument.kind;
    this.metadata = desc.metadata;
    this.spec = desc.spec;
    this.status = desc.status;
  }
}

export function isOdhDocument(o: any): o is OdhDocument {
  return o && o.apiVersion === OdhDocument.apiVersion && o.kind === OdhDocument.kind;
}

export namespace OdhDocument {
  export const apiVersion = 'documents.console.openshift.io/v1alpha1';
  export const group = 'documents.console.openshift.io';
  export const version = 'v1alpha1';
  export const kind = 'OdhDocument';

  // OdhDocument is the Schema for the odhdocuments API
  export interface Interface {
    // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata?: apisMetaV1.ObjectMeta_v2;

    // OdhDocumentSpec defines the desired state of OdhDocument
    spec?: OdhDocument.Spec;

    // OdhDocumentStatus defines the observed state of OdhDocument
    status?: OdhDocument.Status;
  }
  // OdhDocumentSpec defines the desired state of OdhDocument
  export class Spec {
    public appDisplayName?: string;

    public appName?: string;

    public description?: string;

    public displayName?: string;

    public durationMinutes: number;

    public featureFlag?: string;

    public icon?: string;

    public img?: string;

    public markDown?: string;

    public provider?: string;

    public type?: string;

    public url?: string;

    constructor(desc: OdhDocument.Spec) {
      this.appDisplayName = desc.appDisplayName;
      this.appName = desc.appName;
      this.description = desc.description;
      this.displayName = desc.displayName;
      this.durationMinutes = desc.durationMinutes;
      this.featureFlag = desc.featureFlag;
      this.icon = desc.icon;
      this.img = desc.img;
      this.markDown = desc.markDown;
      this.provider = desc.provider;
      this.type = desc.type;
      this.url = desc.url;
    }
  }
  // OdhDocumentStatus defines the observed state of OdhDocument
  export class Status {
    public enabled?: boolean;
  }
}

// OdhDocumentList is a list of OdhDocument
export class OdhDocumentList {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // List of odhdocuments. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
  public items: OdhDocument[];

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public metadata?: apisMetaV1.ListMeta;

  constructor(desc: OdhDocumentList) {
    this.apiVersion = OdhDocumentList.apiVersion;
    this.items = desc.items;
    this.kind = OdhDocumentList.kind;
    this.metadata = desc.metadata;
  }
}

export function isOdhDocumentList(o: any): o is OdhDocumentList {
  return o && o.apiVersion === OdhDocumentList.apiVersion && o.kind === OdhDocumentList.kind;
}

export namespace OdhDocumentList {
  export const apiVersion = 'documents.console.openshift.io/v1alpha1';
  export const group = 'documents.console.openshift.io';
  export const version = 'v1alpha1';
  export const kind = 'OdhDocumentList';

  // OdhDocumentList is a list of OdhDocument
  export interface Interface {
    // List of odhdocuments. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
    items: OdhDocument[];

    // Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
    metadata?: apisMetaV1.ListMeta;
  }
}
