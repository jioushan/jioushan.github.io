#!/bin/bash
mkdir -p docs/public
COMMIT=${COMMIT_REF:-$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")}
echo "{\"commit\":\"${COMMIT:0:7}\"}" > docs/public/version.json
