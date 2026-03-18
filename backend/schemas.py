from pydantic import BaseModel
from typing import Optional, List

class CompanyBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    title: Optional[str] = None
    company_name: str
    email: Optional[str] = None
    person_location: Optional[str] = None
    employee_size: Optional[str] = None
    employee_count: Optional[int] = None
    industry: Optional[str] = None
    person_linkedin_link: Optional[str] = None
    website: Optional[str] = None
    company_linkedin_link: Optional[str] = None
    country: Optional[str] = None
    corporate_phone: Optional[str] = None
    classification: Optional[str] = None
    confidence_score: Optional[float] = None
    signals: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int

    class Config:
        from_attributes = True

class FilterOptions(BaseModel):
    countries: List[str]
    classifications: List[str]
    industries: List[str]
    min_employee_count: Optional[int] = None
    max_employee_count: Optional[int] = None
