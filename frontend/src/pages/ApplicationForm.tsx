import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createApplication, getApplication, updateApplication } from '../api/applications'
import type { Application } from '../types/application'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const APPLICATION_TYPES = [
  'Recordation',
  'Renewal',
  'Change of Ownership',
  'Change of Name',
  'Discontinuation',
]

export default function ApplicationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    applicant_name: '',
    applicant_email: '',
    company_name: '',
    application_type: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      getApplication(Number(id)).then(app => {
        setForm({
          applicant_name: app.applicant_name,
          applicant_email: app.applicant_email,
          company_name: app.company_name,
          application_type: app.application_type,
          description: app.description,
        })
      })
    }
  }, [id])


  const validateEmail = (email: string) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateName = (name: string) => {
    // At least 2 characters, only letters and spaces
    return /^[A-Za-z ]{2,}$/.test(name.trim())
  }

  const validateCompany = (company: string) => {
    // At least 2 characters, allow letters, numbers, spaces, and common symbols
    return /^[A-Za-z0-9 .,&'"-]{2,}$/.test(company.trim())
  }

  const validateDescription = (desc: string) => {
    // At least 10 characters
    return desc.trim().length >= 10
  }

  const handleSubmit = async () => {
    if (!form.applicant_name.trim() || !form.applicant_email.trim() || !form.company_name.trim() || !form.application_type.trim() || !form.description.trim()) {
      setError('All fields are required.')
      return
    }
    if (!validateName(form.applicant_name)) {
      setError('Applicant name must be at least 2 letters and contain only letters and spaces.')
      return
    }
    if (!validateEmail(form.applicant_email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!validateCompany(form.company_name)) {
      setError('Company name must be at least 2 characters and can include letters, numbers, spaces, and .,&\'"-')
      return
    }
    if (!validateDescription(form.description)) {
      setError('Description must be at least 10 characters long.')
      return
    }
    setError('')
    setLoading(true)
    try {
      if (isEdit && id) {
        await updateApplication(Number(id), form)
        navigate(`/applications/${id}`)
      } else {
        const app = await createApplication(form)
        navigate(`/applications/${app.id}`)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? 'Edit Application' : 'New Application'}
      </h1>

      <div className="space-y-4">
        <div>
          <Label>Applicant Name</Label>
          <Input
            value={form.applicant_name}
            onChange={e => setForm(p => ({ ...p, applicant_name: e.target.value }))}
          />
        </div>

        <div>
          <Label>Applicant Email</Label>
          <Input
            type="email"
            value={form.applicant_email}
            onChange={e => setForm(p => ({ ...p, applicant_email: e.target.value }))}
          />
        </div>

        <div>
          <Label>Company Name</Label>
          <Input
            value={form.company_name}
            onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
          />
        </div>

        <div>
          <Label>Application Type</Label>
          <Select
            value={form.application_type}
            onValueChange={val => setForm(p => ({ ...p, application_type: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {APPLICATION_TYPES.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            rows={4}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}