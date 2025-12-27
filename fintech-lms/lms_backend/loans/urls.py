from django.urls import path
from .views import (
    LoanProductView,
    LoanApplicationView,
    CollateralView,
    EligibilityView,
    SubmitLoanView,
    OngoingLoansView,
    LoanDetailView,
    CloseLoanView,
    DashboardGraphView
)

urlpatterns = [
    # Loan Products
    path('loan-products/', LoanProductView.as_view()),
    path('loan-products/<int:id>/', LoanProductView.as_view()),

    # Loan Applications
    path('loan-applications/', LoanApplicationView.as_view()),
    path('loan-applications/<int:id>/', LoanApplicationView.as_view()),
    path('loan-applications/<int:id>/eligibility/', EligibilityView.as_view()),
    path('loan-applications/<int:id>/submit/', SubmitLoanView.as_view()),

    # Collaterals
    path('collaterals/', CollateralView.as_view()),
    path('collaterals/<int:loan_application_id>/', CollateralView.as_view()),

    # Ongoing Loans
    path('ongoing-loans/', OngoingLoansView.as_view()),
    path('loans/<int:id>/', LoanDetailView.as_view()),
    path('loans/<int:id>/close/', CloseLoanView.as_view()),   #for close loan

    #for dashboard graphs
    path('dashboard/graphs/', DashboardGraphView.as_view()),

]
