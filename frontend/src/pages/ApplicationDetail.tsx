import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getApplication, startReview, submitApplication } from '../api/applications'
import type { Application } from '../types/application'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState<Application | null>(null)

  useEffect(() => {
    if (id) getApplication(Number(id)).then(setApp)
  }, [id])

  if (!app) return <div className="p-6 text-muted-foreground">Loading...</div>

  const refresh = () => getApplication(Number(id)).then(setApp)

  const handleSubmit = async () => {
    await submitApplication(app.id)
    refresh()
  }

  const handleStartReview = async () => {
    await startReview(app.id)
    refresh()
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-mono">{app.tracking_number}</p>
          <h1 className="text-2xl font-semibold">{app.applicant_name}</h1>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <Card>
        <CardHeader><CardTitle>Application Details</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Email" value={app.applicant_email} />
          <Row label="Company" value={app.company_name} />
          <Row label="Type" value={app.application_type} />
          <Row label="Description" value={app.description} />
          <Row label="Created" value={new Date(app.created_at).toLocaleString()} />
          {app.submitted_at && <Row label="Submitted" value={new Date(app.submitted_at).toLocaleString()} />}
          {app.reviewed_at && <Row label="Reviewed" value={new Date(app.reviewed_at).toLocaleString()} />}
          {app.reviewer_comment && <Row label="Reviewer Comment" value={app.reviewer_comment} />}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {(app.status === 'Draft' || app.status === 'Need More Information') && (
          <>
            <Button onClick={() => navigate(`/applications/${app.id}/edit`)}>Edit</Button>
            <Button variant="outline" onClick={handleSubmit}>Submit</Button>
          </>
        )}
        {app.status === 'Submitted' && (
          <Button onClick={handleStartReview}>Start Review</Button>
        )}
        {app.status === 'Under Review' && (
          <Button onClick={() => navigate(`/applications/${app.id}/decision`)}>
            Record Decision
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate('/')}>
  <ArrowLeft className="w-4 h-4 mr-1" /> Back
</Button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-36 text-muted-foreground shrink-0">{label}</span>
      <span>{value}</span>
    </div>
  )
}