from django.db import models

# Create your models here.
class LoanProduct(models.Model):
    name = models.CharField(max_length=100)
    interest_rate = models.FloatField()
    ltv = models.FloatField()
    min_amount = models.FloatField()
    max_amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class LoanApplication(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CLOSED', 'Closed'),
    ]

    customer_name = models.CharField(max_length=100)
    student = models.BooleanField(default=False)  # is student or not
    profession = models.CharField(max_length=100, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    nationality = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    pan_number = models.CharField(max_length=20, blank=True, null=True)
    purpose_of_loan = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    annual_income = models.FloatField(blank=True, null=True)
    cibil_score = models.IntegerField(blank=True, null=True)

    loan_product = models.ForeignKey(LoanProduct, on_delete=models.CASCADE)
    requested_amount = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Collateral(models.Model):
    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE)
    fund_name = models.CharField(max_length=100)
    units = models.FloatField()
    nav = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Loan(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('CLOSED', 'Closed'),
    ]

    loan_application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE)
    approved_amount = models.FloatField()
    outstanding_amount = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
