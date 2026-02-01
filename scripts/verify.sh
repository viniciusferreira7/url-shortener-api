#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Symbols
CHECK="✓"
CROSS="✗"
ARROW="→"

# Function to print step header
print_step() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}${ARROW} $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${YELLOW}${ARROW} $1${NC}"
}

# Exit on error
set -e

# Trap errors
trap 'print_error "Verification failed at step: $CURRENT_STEP"; exit 1' ERR

echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║     🚀 VERIFICATION PIPELINE 🚀       ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════╝${NC}"

# Step 1: Git Pull
CURRENT_STEP="Git Pull"
print_step "Pulling latest changes from origin"
CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch: $CURRENT_BRANCH"
git pull origin "$CURRENT_BRANCH"
print_success "Repository updated successfully"

# Step 2: Unit Tests
CURRENT_STEP="Unit Tests"
print_step "Running unit tests"
bun test:unit
print_success "Unit tests passed"

# Step 3: Docker
CURRENT_STEP="Docker"
print_step "Starting Docker services"
bun docker:up
print_success "Docker services started"

# Step 4: E2E Tests
CURRENT_STEP="E2E Tests"
print_step "Running E2E tests"
bun test:e2e
print_success "E2E tests passed"

# Step 5: Linting & Formatting
CURRENT_STEP="Lint & Format"
print_step "Running linter and formatter"
bun check:fix
print_success "Code linting and formatting completed"

# Step 6: Type Checking
CURRENT_STEP="Type Check"
print_step "Running TypeScript type checking"
bun check:type
print_success "Type checking passed"

# Final success message
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✨ ALL CHECKS PASSED SUCCESSFULLY ✨  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
