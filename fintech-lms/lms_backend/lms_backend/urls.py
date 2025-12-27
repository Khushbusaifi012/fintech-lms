"""
URL configuration for lms_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def api_docs(request):
    """API Documentation endpoint"""
    base_url = request.build_absolute_uri('/api/')
    docs = {
        "title": "Fintech LMS API Documentation",
        "version": "1.0",
        "base_url": base_url,
        "endpoints": {
            "Loan Products": {
                "GET /api/loan-products/": "List all loan products",
                "GET /api/loan-products/{id}/": "Get a specific loan product",
                "POST /api/loan-products/": "Create a new loan product",
                "PUT /api/loan-products/{id}/": "Update a loan product",
                "DELETE /api/loan-products/{id}/": "Delete a loan product",
            },
            "Loan Applications": {
                "GET /api/loan-applications/": "List all loan applications",
                "GET /api/loan-applications/{id}/": "Get a specific loan application",
                "POST /api/loan-applications/": "Create a new loan application",
                "PUT /api/loan-applications/{id}/": "Update a loan application",
                "DELETE /api/loan-applications/{id}/": "Delete a loan application",
                "GET /api/loan-applications/{id}/eligibility/": "Check loan eligibility",
                "POST /api/loan-applications/{id}/submit/": "Submit loan application",
            },
            "Collaterals": {
                "GET /api/collaterals/": "List all collaterals",
                "GET /api/collaterals/{loan_application_id}/": "Get collaterals for a loan application",
                "POST /api/collaterals/": "Create a new collateral",
            },
            "Loans": {
                "GET /api/ongoing-loans/": "List all ongoing loans",
                "GET /api/loans/{id}/": "Get loan details",
                "POST /api/loans/{id}/close/": "Close a loan",
            },
            "Dashboard": {
                "GET /api/dashboard/graphs/": "Get dashboard graph data",
            },
        },
        "authentication": "JWT tokens (Bearer token)",
        "admin_panel": request.build_absolute_uri('/admin/'),
    }
    return JsonResponse(docs, json_dumps_params={'indent': 2})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('loans.urls')),
    path('api/docs/', api_docs, name='api-docs'),
    path('', api_docs, name='root'),
]
