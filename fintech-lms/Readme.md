📚 LMS – Loan Management System :-
A full-stack Loan Management System (LMS) built using Django REST Framework for the backend and React + Vite for the frontend.
The system manages loan products, loan applications, collateral details, ongoing loans, and dashboard analytics through a modern REST-based architecture.

🚀 Tech Stack:-
Backend:-
1.Django

2.Django REST Framework (DRF)

3.PostgreSQL (via psycopg2-binary)

4.django-cors-headers

Frontend:-
1.React.js

2.Vite

3.Axios

4.Chart.js & react-chartjs-2

📁 Project Structure :-LMS/
LMS/
├── lms_backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── lms_backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── loans/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── admin.py
│
├── lms_frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.mjs
│   └── src/
│       ├── components/
│       └── api/

⚙️ Backend Setup (Django) :-
1️⃣ Create Virtual Environment:-

1.python -m venv venv

2.source venv/bin/activate   # Windows: venv\Scripts\activate

2️⃣ Install Dependencies:-
1.cd lms_backend

2.pip install -r requirements.txt

3.pip install django djangorestframework psycopg2-binary django-cors-headers

3️⃣ Database Migration:-
1.python manage.py makemigrations

1.python manage.py migrate

4️⃣ Create Superuser:-
1.python manage.py createsuperuser

5️⃣ Run Server:-
1.python manage.py runserver

2.Backend will run at:http://127.0.0.1:8000/

⚛️ Frontend Setup (React + Vite):-
1️⃣ Install Dependencies:-

1.cd lms_frontend

2.npm install

2️⃣ Start Development Server:-
1.npm run dev

2.Frontend will run at:http://localhost:5173/

🔐 Authentication and Security:-
1.APIs secured using Django REST Framework permissions

2.CORS configured for frontend-backend communication

📊 Features:-
1.Loan Product Management

2.Loan Application Creation & Submission

3.Eligibility Check

4.Loan Collateral Management

5.Track Loan Status: Draft,Submitted,Approved,Rejected,Ongoing,Close

6.Dashboard Analytics (Graphs & Metrics)

7.Clean, modular React UI

8.REST APIs for seamless frontend integration

API endpoints and example responses 🔗:-
1.📌 Loan Products
| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/api/loan-products/`      | List all loan products |
| GET    | `/api/loan-products/{id}/` | Get loan product by ID |
| POST   | `/api/loan-products/`      | Create loan product    |
| PUT    | `/api/loan-products/{id}/` | Update loan product    |
| DELETE | `/api/loan-products/{id}/` | Delete loan product    |

Example Response:-{
  "id": 1,
  "name": "Gold Loan",
  "interest_rate": 12.5,
  "ltv": 75,
  "min_amount": 50000,
  "max_amount": 500000
}

2.📌 Loan Applications
| Method | Endpoint                         | Description            |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/loan-applications/`        | List loan applications |
| POST   | `/api/loan-applications/`        | Create application     |
| POST   | `/api/loan-applications/submit/` | Submit application     |

Example Response:-{
  "id": 10,
  "customer_name": "Rahul Sharma",
  "loan_product": 1,
  "amount": 200000,
  "status": "SUBMITTED"
}

3.📌 Collaterals
| Method | Endpoint                                  | Description     |
| ------ | ----------------------------------------- | --------------- |
| GET    | `/api/collaterals/{loan_application_id}/` | Get collaterals |
| POST   | `/api/collaterals/`                       | Add collateral  |

4.📌 Ongoing Loans
| Method | Endpoint                 | Description       |
| ------ | ------------------------ | ----------------- |
| GET    | `/api/ongoing-loans/`    | List active loans |
| GET    | `/api/loans/{id}/`       | Loan details      |
| POST   | `/api/loans/{id}/close/` | Close loan        |

5.📌 Dashboard
| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/dashboard/graphs/` | Loan & disbursement analytics |

Example Response:-{
  "labels": ["01 Jan", "02 Jan", "03 Jan"],
  "new_loans": [5, 8, 3],
  "disbursements": [200000, 350000, 150000]
}

🗂️ Database Schema
1.🧾 LoanProduct
| Field         | Type            | Description            |
| ------------- | --------------- | ---------------------- |
| id            | AutoField       | Primary Key            |
| name          | CharField (100) | Loan product name      |
| interest_rate | FloatField      | Interest rate (%)      |
| ltv           | FloatField      | Loan-to-value ratio    |
| min_amount    | FloatField      | Minimum loan amount    |
| max_amount    | FloatField      | Maximum loan amount    |
| created_at    | DateTimeField   | Auto timestamp         |
| updated_at    | DateTimeField   | Auto updated timestamp |

2.🧾 LoanApplication
| Field            | Type                     | Description                                      |
| ---------------- | ------------------------ | ------------------------------------------------ |
| id               | AutoField                | Primary Key                                      |
| customer_name    | CharField (100)          | Applicant name                                   |
| student          | BooleanField             | Student or not                                   |
| profession       | CharField (100)          | Profession                                       |
| dob              | DateField                | Date of birth                                    |
| nationality      | CharField (50)           | Nationality                                      |
| address          | TextField                | Address                                          |
| pan_number       | CharField (20)           | PAN number                                       |
| purpose_of_loan  | TextField                | Loan purpose                                     |
| gender           | CharField (10)           | Gender                                           |
| designation      | CharField (100)          | Job designation                                  |
| annual_income    | FloatField               | Annual income                                    |
| cibil_score      | IntegerField             | Credit score                                     |
| loan_product     | ForeignKey → LoanProduct | Linked loan product                              |
| requested_amount | FloatField               | Requested loan amount                            |
| status           | ChoiceField              | DRAFT / SUBMITTED / APPROVED / REJECTED / CLOSED |
| created_at       | DateTimeField            | Auto timestamp                                   |
| updated_at       | DateTimeField            | Auto updated timestamp                           |

3.🧾 Collateral
| Field            | Type                         | Description            |
| ---------------- | ---------------------------- | ---------------------- |
| id               | AutoField                    | Primary Key            |
| loan_application | ForeignKey → LoanApplication | Related application    |
| fund_name        | CharField (100)              | Mutual fund name       |
| units            | FloatField                   | Units pledged          |
| nav              | FloatField                   | Net Asset Value        |
| created_at       | DateTimeField                | Auto timestamp         |
| updated_at       | DateTimeField                | Auto updated timestamp |

4.🧾 Loan
| Field              | Type                            | Description            |
| ------------------ | ------------------------------- | ---------------------- |
| id                 | AutoField                       | Primary Key            |
| loan_application   | OneToOneField → LoanApplication | Approved application   |
| approved_amount    | FloatField                      | Approved loan amount   |
| outstanding_amount | FloatField                      | Remaining amount       |
| status             | ChoiceField                     | ACTIVE / CLOSED        |
| created_at         | DateTimeField                   | Auto timestamp         |
| updated_at         | DateTimeField                   | Auto updated timestamp |

