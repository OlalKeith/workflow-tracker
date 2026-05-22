import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApplications } from '../api/applications'
import type { Application } from '../types/application'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <Button onClick={() => navigate('/applications/new')}>New Application</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking No.</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(app => (
              <TableRow
                key={app.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <TableCell className="font-mono text-sm">{app.tracking_number}</TableCell>
                <TableCell>{app.applicant_name}</TableCell>
                <TableCell>{app.company_name}</TableCell>
                <TableCell>{app.application_type}</TableCell>
                <TableCell><StatusBadge status={app.status} /></TableCell>
                <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}