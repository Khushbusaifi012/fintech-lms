from django.contrib import admin
from .models import LoanProduct, LoanApplication, Collateral, Loan

@admin.register(LoanProduct)
class LoanProductAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'interest_rate',
        'ltv',
        'min_amount',
        'max_amount',
        'created_at',
    )
    search_fields = ('name',)
    list_filter = ('created_at',)


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'customer_name',
        'loan_product',
        'requested_amount',
        'status',
        'created_at',
    )
    list_filter = ('status', 'loan_product')
    search_fields = ('customer_name',)


@admin.register(Collateral)
class CollateralAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'loan_application',
        'fund_name',
        'units',
        'nav',
        'created_at',
    )
    search_fields = ('fund_name',)


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'loan_application',
        'approved_amount',
        'outstanding_amount',
        'status',
        'created_at',
    )
    list_filter = ('status',)
