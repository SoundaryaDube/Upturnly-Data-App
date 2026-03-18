from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    title = Column(String, nullable=True)
    company_name = Column(String, index=True)
    email = Column(String, nullable=True)
    person_location = Column(String, nullable=True)
    employee_size = Column(String, nullable=True) # Kept as string to handle ranges/text
    employee_count = Column(Integer, nullable=True) # Parsed integer for range filtering
    industry = Column(String, nullable=True)
    person_linkedin_link = Column(String, nullable=True)
    website = Column(String, nullable=True)
    company_linkedin_link = Column(String, nullable=True)
    country = Column(String, index=True)
    corporate_phone = Column(String, nullable=True)
    classification = Column(String, index=True)
    confidence_score = Column(Float, nullable=True)
    # Storing extra signals as text for simplicity in PoC
    signals = Column(Text, nullable=True) 
    
    # Original CSV columns mapping
    # 1: First name,Last name,Title,Company name,Email,Person Location,Employee Size,Industry,Person Linkedin Link,Website,Compnay Linkedin Link,Country,Corporate Phone,classification,confidence_score
