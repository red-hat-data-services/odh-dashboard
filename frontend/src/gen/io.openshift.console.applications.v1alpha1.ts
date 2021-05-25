import * as apisMetaV1 from './io.k8s.apimachinery.pkg.apis.meta.v1';

// OdhApplication is the Schema for the odhapplications API
export class OdhApplication {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata?: apisMetaV1.ObjectMeta_v2;

  // OdhApplicationSpec defines the desired state of odhApplication
  public spec?: OdhApplication.Spec;

  // OdhApplicationStatus defines the observed state of OdhApplication
  public status?: OdhApplication.Status;

  constructor(desc: OdhApplication) {
    this.apiVersion = OdhApplication.apiVersion;
    this.kind = OdhApplication.kind;
    this.metadata = desc.metadata;
    this.spec = desc.spec;
    this.status = desc.status;
  }
}

export function isOdhApplication(o: any): o is OdhApplication {
  return o && o.apiVersion === OdhApplication.apiVersion && o.kind === OdhApplication.kind;
}

export namespace OdhApplication {
  export const apiVersion = 'applications.console.openshift.io/v1alpha1';
  export const group = 'applications.console.openshift.io';
  export const version = 'v1alpha1';
  export const kind = 'OdhApplication';

  // OdhApplication is the Schema for the odhapplications API
  export interface Interface {
    // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata?: apisMetaV1.ObjectMeta_v2;

    // OdhApplicationSpec defines the desired state of odhApplication
    spec?: OdhApplication.Spec;

    // OdhApplicationStatus defines the observed state of OdhApplication
    status?: OdhApplication.Status;
  }
  // OdhApplicationSpec defines the desired state of odhApplication
  export class Spec {
    public category?: string;

    public comingSoon?: boolean;

    public csvName?: string;

    public description?: string;

    public displayName?: string;

    public docsLink?: string;

    public enable?: OdhApplication.Spec.Enable;

    public endPoint?: string;

    public featureFlag?: string;

    public getStartedLink?: string;

    public img?: string;

    public isEnabled?: boolean;

    public kfdefApplications: string[];

    public link?: string;

    public provider?: string;

    public quickStart?: string;

    public route?: string;

    public routeNamespace?: string;

    public routeSuffix?: string;

    public serviceName?: string;

    public support?: string;

    constructor(desc: OdhApplication.Spec) {
      this.category = desc.category;
      this.comingSoon = desc.comingSoon;
      this.csvName = desc.csvName;
      this.description = desc.description;
      this.displayName = desc.displayName;
      this.docsLink = desc.docsLink;
      this.enable = desc.enable;
      this.endPoint = desc.endPoint;
      this.featureFlag = desc.featureFlag;
      this.getStartedLink = desc.getStartedLink;
      this.img = desc.img;
      this.isEnabled = desc.isEnabled;
      this.kfdefApplications = desc.kfdefApplications;
      this.link = desc.link;
      this.provider = desc.provider;
      this.quickStart = desc.quickStart;
      this.route = desc.route;
      this.routeNamespace = desc.routeNamespace;
      this.routeSuffix = desc.routeSuffix;
      this.serviceName = desc.serviceName;
      this.support = desc.support;
    }
  }

  export namespace Spec {
    export class Enable {
      public actionLabel?: string;

      public description?: string;

      public title?: string;

      public validationConfigMap?: string;

      public validationJob?: string;

      public validationSecret?: string;

      public variableDisplayText?: { [key: string]: string };

      public variableHelpText?: { [key: string]: string };

      public variables?: { [key: string]: string };
    }
  }
  // OdhApplicationStatus defines the observed state of OdhApplication
  export class Status {
    public enabled?: boolean;
  }
}

// OdhApplicationList is a list of OdhApplication
export class OdhApplicationList {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // List of odhapplications. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
  public items: OdhApplication[];

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public metadata?: apisMetaV1.ListMeta;

  constructor(desc: OdhApplicationList) {
    this.apiVersion = OdhApplicationList.apiVersion;
    this.items = desc.items;
    this.kind = OdhApplicationList.kind;
    this.metadata = desc.metadata;
  }
}

export function isOdhApplicationList(o: any): o is OdhApplicationList {
  return o && o.apiVersion === OdhApplicationList.apiVersion && o.kind === OdhApplicationList.kind;
}

export namespace OdhApplicationList {
  export const apiVersion = 'applications.console.openshift.io/v1alpha1';
  export const group = 'applications.console.openshift.io';
  export const version = 'v1alpha1';
  export const kind = 'OdhApplicationList';

  // OdhApplicationList is a list of OdhApplication
  export interface Interface {
    // List of odhapplications. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
    items: OdhApplication[];

    // Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
    metadata?: apisMetaV1.ListMeta;
  }
}
