from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from rest_framework import status

from .models import *
from .serializers import *

# Create your views here.
class LoanProductView(APIView):
    def get(self, request, id=None):
        if id:
            product = get_object_or_404(LoanProduct, id=id)
            return Response(LoanProductSerializer(product).data)
        products = LoanProduct.objects.all()
        return Response(LoanProductSerializer(products, many=True).data)

    def post(self, request):
        serializer = LoanProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
      # 🔹 UPDATE (PUT)
    def put(self, request, id):
        product = get_object_or_404(LoanProduct, id=id)

        serializer = LoanProductSerializer(
            product,
            data=request.data,
            partial=True   
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        product = get_object_or_404(LoanProduct, id=id)
        product.delete()
        return Response({"message": "Loan product deleted"})
    

class LoanApplicationView(APIView):
    def get(self, request, id=None):
        if id:
            app = LoanApplication.objects.get(id=id)
            return Response(LoanApplicationSerializer(app).data)
        apps = LoanApplication.objects.all()
        return Response(LoanApplicationSerializer(apps, many=True).data)

    def post(self, request):
        serializer = LoanApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def put(self, request, id):
        app = LoanApplication.objects.get(id=id)
        serializer = LoanApplicationSerializer(app, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, id):
        LoanApplication.objects.filter(id=id).delete()
        return Response({"message": "Deleted"})

class CollateralView(APIView):

    def post(self, request):
        serializer = CollateralSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get(self, request, loan_application_id=None):
        if loan_application_id:
            collaterals = Collateral.objects.filter(loan_application_id=loan_application_id)
        else:
            collaterals = Collateral.objects.all()
        return Response(CollateralSerializer(collaterals, many=True).data)

class EligibilityView(APIView):
    def get(self, request, id):
        application = LoanApplication.objects.get(id=id)
        collaterals = Collateral.objects.filter(loan_application=application)

        total_value = sum(c.units * c.nav for c in collaterals)
        ltv = application.loan_product.ltv
        eligible_amount = total_value * (ltv / 100)

        return Response({
            "total_collateral_value": total_value,
            "eligible_loan_amount": eligible_amount
        })

class SubmitLoanView(APIView):
    def post(self, request, id):
        app = LoanApplication.objects.get(id=id)

        if hasattr(app, 'loan'):
            return Response({
                "message": "Loan already created for this application",
                "loan_id": app.loan.id
            }, status=400)

        app.status = 'APPROVED'
        app.save()

        loan = Loan.objects.create(
            loan_application=app,
            approved_amount=app.requested_amount,
            outstanding_amount=app.requested_amount
        )

        return Response({"message": "Loan Approved", "loan_id": loan.id})


class OngoingLoansView(APIView):
    def get(self, request):
        loans = Loan.objects.filter(status='ACTIVE')
        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data)
    
class CloseLoanView(APIView):
    def post(self, request, id):
        loan = Loan.objects.get(id=id)
        loan.status = 'CLOSED'
        loan.outstanding_amount = 0
        loan.save()

        application = loan.loan_application
        application.status = 'CLOSED'
        application.save()

        return Response({
            "message": "Loan closed successfully"
        })

class LoanDetailView(APIView):
    def get(self, request, id):
        loan = Loan.objects.get(id=id)
        serializer = LoanSerializer(loan)
        return Response(serializer.data)

class DashboardGraphView(APIView):
    def get(self, request):
        qs = (
            Loan.objects
            .filter(status='ACTIVE')
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(
                total_loans=Count('id'),
                total_disbursed=Sum('approved_amount')
            )
            .order_by('day')
        )

        labels = []
        loans = []
        disbursements = []

        for row in qs:
            labels.append(row['day'].strftime('%d %b'))
            loans.append(row['total_loans'])
            disbursements.append(row['total_disbursed'] or 0)

        return Response({
            "labels": labels,
            "new_loans": loans,
            "disbursements": disbursements
        })