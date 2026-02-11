#!/bin/bash

# GitHub Actions Workflow Queue Cancellation Script # This script cancels all queued workflows in the repository
# Usage: ./gh_cancel_queued_workflows.sh <owner/repo>
Example: ./gh_cancel_queued_workflows.sh codenote-net/sandbox

# Check arguments
if [ $# -lt 1 ]; then
    echo "Error: Missing required argument"
    echo "Usage: $0 <owner/repo>"
    echo "Example: $0 codenote-net/sandbox"
    exit 1
fi

REPOSITORY="$1"

# Validate repository format
if [[ ! "$REPOSITORY" =~ ^[^/]+/[^/]+$ ]]; then
    echo "Error: Invalid repository format"
    echo "Expected format: owner/repo"
    echo "Example: codenote-net/sandbox"
    exit 1
fi

PER_PAGE=100
PARALLEL_JOBS=10
TOTAL_CANCELLED=0
TOTAL_ERRORS=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting workflow cancellation for ${REPOSITORY}${NC}"
echo "This may take a while for ~100,000 workflows..."

# Verify repository exists and we have access
echo "Verifying repository access..."
if ! gh api "/repos/${REPOSITORY}" >/dev/null 2>&1; then
    echo -e "${RED}Error: Cannot access repository ${REPOSITORY}${NC}"
    echo "Please check:"
    echo " - Repository name and owner are correct"
    echo " - You are authenticated with gh CLI"
    echo " - You have necessary permissions"
    exit 1
fi

# Function to cancel a single workflow
cancel_workflow() {
    local run_id=$1
    if gh api -X POST "/repos/${REPOSITORY}/actions/runs/${run_id}/cancel" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Cancelled workflow: ${run_id}"
        return 0
    else echo -e "${RED}✗${NC} Failed to cancel workflow: ${run_id}"
        return 1
    fi
}

# Export function for parallel execution
export -f cancel_workflow
export REPOSITORY RED GREEN NC

# Function to process workflows in parallel
process_page() {
    local page=$1

    # Get queued workflows for this page
    local workflows=$(gh api \ "/repos/${REPOSITORY}/actions/runs?status=queued&per_page=${PER_PAGE}&page=${page}" \ --jq '.workflow_runs[].id' 2>/dev/null)

    if [ -z "$workflows" ]; then
        return 1
    fi

    # Process workflows in parallel
    echo "$workflows" | xargs -P ${PARALLEL_JOBS} -I {} bash -c 'cancel_workflow {}' return 0
}

# Get total count of queued workflows
echo "Fetching total count of queued workflows..."
TOTAL_COUNT=$(gh api "/repos/${REPOSITORY}/actions/runs?status=queued&per_page=1" --jq '.total_count' 2>/dev/null)

if [ -z "$TOTAL_COUNT" ] || [ "$TOTAL_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}No queued workflows found.${NC}"
    exit 0
fi

echo -e "${YELLOW}Found ${TOTAL_COUNT} queued workflows${NC}"
TOTAL_PAGES=$((($TOTAL_COUNT + $PER_PAGE - 1) / $PER_PAGE))

# Process all pages
echo "Processing ${TOTAL_PAGES} pages..."

for ((page=1; page<=TOTAL_PAGES; page++)); do
    echo -e "\n${YELLOW}Processing page ${page}/${TOTAL_PAGES}${NC}"
    if ! process_page $page; then
        echo "No more workflows found on page ${page}"
        break
    fi
    # Add a small delay to avoid rate limiting
    if [ $((page % 10)) -eq 0 ]; then
        echo "Pausing briefly to avoid rate limits..."
        sleep 2
    fi
done

echo -e "\n${GREEN}Workflow cancellation completed!${NC}"
