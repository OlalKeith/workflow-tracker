from ninja import Router
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Application
from .schemas import (
    ApplicationCreateSchema,
    ApplicationUpdateSchema,
    ReviewerDecisionSchema,
    ApplicationOutSchema,
    MessageSchema,
)
from typing import List

router = Router()

VALID_TYPES = [t.value for t in Application.ApplicationType]
VALID_DECISIONS = ['Approved', 'Rejected', 'Need More Information']


@router.post("/", response=ApplicationOutSchema)
def create_application(request, payload: ApplicationCreateSchema):
    if payload.application_type not in VALID_TYPES:
        raise ValueError(f"Invalid application type: {payload.application_type}")
    app = Application.objects.create(**payload.dict())
    return app


@router.get("/", response=List[ApplicationOutSchema])
def list_applications(request):
    return Application.objects.all()


@router.get("/{app_id}", response=ApplicationOutSchema)
def get_application(request, app_id: int):
    return get_object_or_404(Application, id=app_id)


@router.put("/{app_id}", response=ApplicationOutSchema)
def update_application(request, app_id: int, payload: ApplicationUpdateSchema):
    app = get_object_or_404(Application, id=app_id)
    if app.status not in [Application.Status.DRAFT, Application.Status.NEED_MORE_INFO]:
        return router.create_response(request, {"message": "Only Draft or Need More Information applications can be edited."}, status=400)
    for attr, value in payload.dict(exclude_none=True).items():
        setattr(app, attr, value)
    app.save()
    return app


@router.post("/{app_id}/submit", response=ApplicationOutSchema)
def submit_application(request, app_id: int):
    app = get_object_or_404(Application, id=app_id)
    if app.status not in [Application.Status.DRAFT, Application.Status.NEED_MORE_INFO]:
        return router.create_response(request, {"message": "Only Draft or Need More Information applications can be submitted."}, status=400)
    app.status = Application.Status.SUBMITTED
    app.submitted_at = timezone.now()
    app.save()
    return app


@router.post("/{app_id}/start-review", response=ApplicationOutSchema)
def start_review(request, app_id: int):
    app = get_object_or_404(Application, id=app_id)
    if app.status != Application.Status.SUBMITTED:
        return router.create_response(request, {"message": "Only Submitted applications can move to Under Review."}, status=400)
    app.status = Application.Status.UNDER_REVIEW
    app.save()
    return app


@router.post("/{app_id}/decision", response=ApplicationOutSchema)
def record_decision(request, app_id: int, payload: ReviewerDecisionSchema):
    app = get_object_or_404(Application, id=app_id)
    if app.status != Application.Status.UNDER_REVIEW:
        return router.create_response(request, {"message": "Only Under Review applications can receive a decision."}, status=400)
    if payload.decision not in VALID_DECISIONS:
        return router.create_response(request, {"message": f"Invalid decision: {payload.decision}"}, status=400)
    if payload.decision in ['Rejected', 'Need More Information'] and not payload.reviewer_comment:
        return router.create_response(request, {"message": "A comment is required for Rejected or Need More Information decisions."}, status=400)
    app.status = payload.decision
    app.reviewer_comment = payload.reviewer_comment or ''
    app.reviewed_at = timezone.now()
    app.save()
    return app