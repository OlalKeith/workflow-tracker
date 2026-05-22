from pydantic import EmailStr
from ninja import Schema
from typing import Optional
from datetime import datetime


class ApplicationCreateSchema(Schema):
    applicant_name: str
    applicant_email: EmailStr
    company_name: str
    application_type: str
    description: str


class ApplicationUpdateSchema(Schema):
    applicant_name: Optional[str] = None
    applicant_email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    application_type: Optional[str] = None
    description: Optional[str] = None


class ReviewerDecisionSchema(Schema):
    decision: str  # Approved | Rejected | Need More Information
    reviewer_comment: Optional[str] = None


class ApplicationOutSchema(Schema):
    id: int
    tracking_number: str
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: str
    description: str
    status: str
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None


class MessageSchema(Schema):
    message: str