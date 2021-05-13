# Open Data Hub Dashboard

A dashboard for Open Data Hub components.

- Shows what's installed
- Show's what's available for installation
- Links to component UIs
- Links to component documentation

## Requirements
Before developing for ODH, the basic requirements:
* Your system needs to be running [NodeJS version 12+ and NPM](https://nodejs.org/)
* You have done an 'oc login' to the OpenShift cluster (see [CONTRIBUTING.md](./CONTRIBUTING.md))
  
### Additional tooling requirements
* [OpenShift CLI, the "oc" command](https://docs.openshift.com/enterprise/3.2/cli_reference/get_started_cli.html#installing-the-cli)
* [s2i](https://github.com/openshift/source-to-image)
* [Quay.io](https://quay.io/)

## Deploy OdhApplications, OdhDocuments to the OpenShift cluster
   1. Deploy the OdhApplications, OdhDocuments CRDS
      ```
      oc apply -f install/deploy/base/custom-resource-definition.yaml
      ```

   2. Deploy the OdhApplications, OdhDocuments Resources to your OC_PROJECT
      ```
      oc project $OC_PROJECT
      cat install/deploy/base/{odh-application.yaml,odh-document.yaml} | oc apply -f -
      ```

## Development
   1. Clone the repository
      ```
      $ git clone https://github.com/red-hat-data-services/odh-dashboard
      ```

   1. Within the repo context, install project dependencies
      ```
      $ cd odh-dashboard && npm install
      ```

### Serve development content
This is the default context for running a local UI

  ```
  $ npm run start
  ```

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#Serving%20Content)


### Testing
Run the tests.

  ```
  $ npm run test
  ```

For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#Testing)

## Contributing
Contributing encompasses [repository specific requirements](./CONTRIBUTING.md)
