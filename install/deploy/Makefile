OC_PROJECT ?= redhat-ods-applications
DASHBOARD_NAME ?= odh-dashboard
IMAGE ?= s2i-odh-dashboard
TAG ?= v0.0.1
REPLICAS ?= 2

all: output-vars

output-vars:
	@echo OC_PROJECT=$(OC_PROJECT) IMAGE=$(IMAGE) TAG=$(TAG)

set-project:
	oc project $(OC_PROJECT)

set-dashboard-name:
	kustomize cfg set . DASHBOARD_NAME $(DASHBOARD_NAME) -R

set-namespace:
	kustomize edit set namespace $(OC_PROJECT)

set-image:
	kustomize edit set image $(IMAGE)=$(IMAGE):$(TAG)

deploy: output-vars set-project set-dashboard-name set-namespace set-image
	kustomize build | kubectl apply -f -

undeploy:
	kustomize build | kubectl delete -f -
	

