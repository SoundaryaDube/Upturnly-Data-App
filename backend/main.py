from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import distinct
from typing import List, Optional
import pandas as pd
import io
import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For PoC, allow all. In prod, restrict to frontend domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", status_code=201)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV file.")
    
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    
    # Simple mapping based on the provided CSV structure
    # Treating missing values as None
    df = df.where(pd.notnull(df), None)
    
    companies_to_add = []
    companies_to_add = []
    for _, row in df.iterrows():
        # Parse employee size to integer
        emp_size_str = str(row.get('Employee Size')) if row.get('Employee Size') else None
        emp_count = 0
        if emp_size_str:
            # Remove commas and extract first number found
            clean_str = emp_size_str.replace(',', '').replace('+', '').replace('<', '').replace('>', '')
            # Handle ranges like "51-200" or "1-10" by taking the lower bound, or average? 
            # Let's take the lower bound for "min size" filtering safety, 
            # actually usually people want to find companies *within* a size. 
            # If "51-200", and they search for > 100, it might be tricky.
            # Let's parse the first number we find.
            import re
            numbers = re.findall(r'\d+', clean_str)
            if numbers:
                emp_count = int(numbers[0])

        company = models.Company(
            first_name=row.get('First name'),
            last_name=row.get('Last name'),
            title=row.get('Title'),
            company_name=row.get('Company name'),
            email=row.get('Email'),
            person_location=row.get('Person Location'),
            employee_size=emp_size_str,
            employee_count=emp_count,
            industry=row.get('Industry'),
            person_linkedin_link=row.get('Person Linkedin Link'),
            website=row.get('Website'),
            company_linkedin_link=row.get('Compnay Linkedin Link'), # Note typo in CSV header 'Compnay'
            country=row.get('Country'),
            corporate_phone=str(row.get('Corporate Phone')) if row.get('Corporate Phone') else None,
            classification=row.get('classification'),
            confidence_score=row.get('confidence_score') if pd.notna(row.get('confidence_score')) else 0.0,
            signals=str(row.get('signals')) if row.get('signals') else None
        )
        companies_to_add.append(company)
    
    try:
        db.add_all(companies_to_add)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return {"message": f"Successfully uploaded {len(companies_to_add)} records."}

@app.get("/companies", response_model=List[schemas.Company])
def get_companies(
    skip: int = 0, 
    limit: int = 100, 
    country: Optional[str] = None, 
    classification: Optional[str] = None,
    industry: Optional[str] = None,
    min_employee_size: Optional[int] = None,
    max_employee_size: Optional[int] = None,
    has_phone: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Company)
    
    if country:
        query = query.filter(models.Company.country == country)
    if classification:
        query = query.filter(models.Company.classification == classification)
    if industry:
        query = query.filter(models.Company.industry == industry)
    
    if min_employee_size is not None:
        query = query.filter(models.Company.employee_count >= min_employee_size)
    if max_employee_size is not None:
        query = query.filter(models.Company.employee_count <= max_employee_size)
        
    if has_phone:
        query = query.filter(models.Company.corporate_phone != None, models.Company.corporate_phone != '')

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Company.company_name.ilike(search_filter)) | 
            (models.Company.email.ilike(search_filter))
        )
        
    companies = query.offset(skip).limit(limit).all()
    return companies

@app.get("/filters", response_model=schemas.FilterOptions)
def get_filters(db: Session = Depends(database.get_db)):
    countries = db.query(distinct(models.Company.country)).filter(models.Company.country.isnot(None)).all()
    classifications = db.query(distinct(models.Company.classification)).filter(models.Company.classification.isnot(None)).all()
    industries = db.query(distinct(models.Company.industry)).filter(models.Company.industry.isnot(None)).all()
    
    # Get min and max employee counts for the range slider
    from sqlalchemy import func
    min_emp = db.query(func.min(models.Company.employee_count)).scalar() or 0
    max_emp = db.query(func.max(models.Company.employee_count)).scalar() or 10000

    return {
        "countries": [c[0] for c in countries],
        "classifications": [c[0] for c in classifications],
        "industries": [c[0] for c in industries],
        "min_employee_count": min_emp,
        "max_employee_count": max_emp
    }

@app.delete("/clear", status_code=204)
def clear_data(db: Session = Depends(database.get_db)):
    db.query(models.Company).delete()
    db.commit()
    return {"message": "All data cleared"}
