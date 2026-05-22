import { Badge } from '@/components/ui/badge'
import { ApplicationStatus } from '../types/application'

const statusStyles: Record<ApplicationStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700',
  Submitted: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-yellow-100 text-yellow-700',
  'Need More Information': 'bg-orange-100 text-orange-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge className={statusStyles[status]} variant="outline">
      {status}
    </Badge>
  )
}