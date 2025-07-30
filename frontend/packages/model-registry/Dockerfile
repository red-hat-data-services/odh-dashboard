# Source code for the repos
ARG UI_SOURCE_CODE=./upstream/frontend
ARG BFF_SOURCE_CODE=./upstream/bff

# Set the base images for the build stages
ARG NODE_BASE_IMAGE=registry.access.redhat.com/ubi9/nodejs-20@sha256:7dbff8f83362f151313b45422ad3c8a37363a0190e6b392731a819f635ced464
ARG GOLANG_BASE_IMAGE=registry.access.redhat.com/ubi9/go-toolset:1.24@sha256:6ef4378dccbf2319fa67a856151e0f79540b05bd577ec4d394edc953aa246556
ARG DISTROLESS_BASE_IMAGE=registry.access.redhat.com/ubi9-minimal@sha256:67fee1a132e8e326434214b3c7ce90b2500b2ad02c9790cc61581feb58d281d5

# UI build stage
FROM ${NODE_BASE_IMAGE} AS ui-builder

ARG UI_SOURCE_CODE
ARG DEPLOYMENT_MODE
ARG PLATFORM_MODE

WORKDIR /usr/src/app

# Copy the source code to the container
COPY ${UI_SOURCE_CODE} /usr/src/app

# List files for debugging
RUN ls -la /usr/src/app

# Install the dependencies and build
RUN npm cache clean --force
RUN npm ci --omit=optional
RUN npm run build:prod

# BFF build stage
FROM ${GOLANG_BASE_IMAGE} AS bff-builder

ARG BFF_SOURCE_CODE

ARG TARGETOS
ARG TARGETARCH

WORKDIR /usr/src/app

# Copy the Go Modules manifests
COPY ${BFF_SOURCE_CODE}/go.mod ${BFF_SOURCE_CODE}/go.sum ./

# Download dependencies
RUN go mod download

# Copy the go source files
COPY ${BFF_SOURCE_CODE}/cmd/ cmd/
COPY ${BFF_SOURCE_CODE}/internal/ internal/

# Build the Go application
RUN CGO_ENABLED=0 GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH} go build -a -o bff ./cmd

# Final stage
# Use distroless as minimal base image to package the application binary
FROM ${DISTROLESS_BASE_IMAGE}
WORKDIR /
COPY --from=bff-builder /usr/src/app/bff ./
COPY --from=ui-builder /usr/src/app/dist ./static/
USER 65532:65532

# Expose port 8080
EXPOSE 8080

ENTRYPOINT ["/bff"]
