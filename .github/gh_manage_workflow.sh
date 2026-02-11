#!/bin/bash

# GitHub Actions Workflow Queue Cancellation Script 
# This script cancels all queued workflows for a particular workflow file in the current repository 
# Usage: ./gh_manage_workflow.sh cancel deploy.yml

# Check arguments
if [ $# -lt 2 ]; then
    echo "Error: Missing required argument"
    echo "Usage: $0 <cancel | delete> ${action.yml}"
    echo "Example: $0 cancel deploy.yml"
    exit 1
fi

WF_ACTION=$1
WORKFLOW_FILE=$2

if [ $WF_ACTION != "cancel" || $WF_ACTION != "delete"] then;
    echo "Error: Invalid Workflow action"
    echo "Expected: \"cancel or delete\""
    exit 1
if

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting workflow cancellation for ${WORKFLOW_FILE}${NC}"

for id in $(gh run list --workflow $WF_ACTION --json databaseId --jq '.[].databaseId'); do gh run ${WORKFLOW_FILE} "$id"; done

echo -e "\n${GREEN}Workflow cancellation completed!${NC}"