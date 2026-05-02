#!/usr/bin/env python3
"""
Simple API testing script for Fintech LMS
Run: python test_api.py
"""

import requests
import json

BASE_URL = "https://fintech-lms-backend.onrender.com/api"

def test_endpoint(method, url, data=None, description=""):
    """Test an API endpoint"""
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"{method} {url}")
    print('='*60)
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response:")
        
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
            
        return response.status_code == 200 or response.status_code == 201
        
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("=== Fintech LMS API Testing ===\n")
    
    # Test 1: API Documentation
    test_endpoint("GET", f"{BASE_URL}/../", description="API Documentation")
    
    # Test 2: List Loan Products
    test_endpoint("GET", f"{BASE_URL}/loan-products/", description="List Loan Products")
    
    # Test 3: List Loan Applications
    test_endpoint("GET", f"{BASE_URL}/loan-applications/", description="List Loan Applications")
    
    # Test 4: Dashboard Graphs
    test_endpoint("GET", f"{BASE_URL}/dashboard/graphs/", description="Dashboard Graphs")
    
    # Test 5: Ongoing Loans
    test_endpoint("GET", f"{BASE_URL}/ongoing-loans/", description="Ongoing Loans")
    
    # Test 6: Create Loan Product (POST)
    loan_product_data = {
        "name": "Test Personal Loan",
        "interest_rate": 12.5,
        "ltv": 80.0,
        "min_amount": 10000,
        "max_amount": 500000
    }
    test_endpoint("POST", f"{BASE_URL}/loan-products/", 
                  data=loan_product_data, 
                  description="Create Loan Product")
    
    print("\n" + "="*60)
    print("Testing Complete!")
    print("="*60)

if __name__ == "__main__":
    main()