#!/bin/bash

# API Base URL
BASE_URL="https://fintech-lms-backend.onrender.com/api"

echo "=== Testing Fintech LMS API ==="
echo ""

# Test 1: API Documentation
echo "1. Testing API Documentation..."
curl -s "$BASE_URL/../" | head -20
echo -e "\n"

# Test 2: List Loan Products
echo "2. Testing GET /api/loan-products/"
curl -s -X GET "$BASE_URL/loan-products/" | python -m json.tool 2>/dev/null || curl -s -X GET "$BASE_URL/loan-products/"
echo -e "\n"

# Test 3: List Loan Applications
echo "3. Testing GET /api/loan-applications/"
curl -s -X GET "$BASE_URL/loan-applications/" | python -m json.tool 2>/dev/null || curl -s -X GET "$BASE_URL/loan-applications/"
echo -e "\n"

# Test 4: Dashboard Graphs
echo "4. Testing GET /api/dashboard/graphs/"
curl -s -X GET "$BASE_URL/dashboard/graphs/" | python -m json.tool 2>/dev/null || curl -s -X GET "$BASE_URL/dashboard/graphs/"
echo -e "\n"

# Test 5: Ongoing Loans
echo "5. Testing GET /api/ongoing-loans/"
curl -s -X GET "$BASE_URL/ongoing-loans/" | python -m json.tool 2>/dev/null || curl -s -X GET "$BASE_URL/ongoing-loans/"
echo -e "\n"

echo "=== Testing Complete ==="


