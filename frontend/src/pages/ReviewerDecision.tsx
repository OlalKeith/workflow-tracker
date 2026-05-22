import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { recordDecision } from '../api/applications'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const DECISIONS = ['Approved', 'Rejected', 'Need More Information']

export default function ReviewerDecision() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [decision, setDecision] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const requiresComment = decision === 'Rejected' || decision === 'Need More Information'

  const handleSubmit = async () => {
    if (!decision) { setError('Select a decision.'); return }
    if (requiresComment && !comment.trim()) {
      setError('A comment is required for this decision.')
      return
    }
    setLoading(true)
    try {
      await recordDecision(Number(id), { decision, reviewer_comment: comment })
      navigate(`/applications/${id}`)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Record Decision</h1>

      <div>
        <Label>Decision</Label>
        <Select value={decision} onValueChange={setDecision}>
          <SelectTrigger>
            <SelectValue placeholder="Select decision" />
          </SelectTrigger>
          <SelectContent>
            {DECISIONS.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>
          Reviewer Comment {requiresComment && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={requiresComment ? 'Required for this decision' : 'Optional'}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Decision'}
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
      </div>
    </div>
  )
}