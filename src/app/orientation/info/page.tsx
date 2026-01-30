'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOrientation, WorkerStatus } from '@/lib/orientation-context'
import { ProgressIndicator } from '@/components/ProgressIndicator'

const statusOptions: { value: WorkerStatus; label: string }[] = [
  { value: 'NEW_TO_POSITION', label: 'New to this position' },
  { value: 'RETURNING_HAZARDS_CHANGED', label: 'Returning worker (hazards have changed)' },
  { value: 'UNDER_25_RETURNING', label: 'Under 25 years old, returning after 6+ months' },
  { value: 'AFFECTED_BY_HAZARD_CHANGES', label: 'Affected by changes to hazards' },
  { value: 'ANNUAL_REVIEW', label: 'Annual review' },
]

export default function WorkerInfoPage() {
  const router = useRouter()
  const { setWorkerInfo, setSessionId, setCurrentStep } = useOrientation()

  const [formData, setFormData] = useState({
    fullName: '',
    hireDate: '',
    supervisorName: '',
    siteId: '',
    statusType: '' as WorkerStatus | '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required'
    }
    if (!formData.supervisorName.trim()) {
      newErrors.supervisorName = 'Supervisor name is required'
    }
    if (!formData.statusType) {
      newErrors.statusType = 'Please select your status'
    }
    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required'
    }
    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required'
    }
    if (!formData.emergencyContactRelationship.trim()) {
      newErrors.emergencyContactRelationship = 'Relationship is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    setWorkerInfo({
      fullName: formData.fullName,
      hireDate: formData.hireDate,
      supervisorName: formData.supervisorName,
      siteId: formData.siteId || 'default',
      statusType: formData.statusType as WorkerStatus,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      emergencyContactRelationship: formData.emergencyContactRelationship,
    })

    setSessionId(sessionId)
    setCurrentStep('video')
    router.push('/orientation/video')
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Header with Gilson Red Gradient */}
      <header className="text-white py-4 px-4" style={{
        background: 'linear-gradient(135deg, #a12642 0%, #8a1f38 40%, #7a1c32 70%, #5a1424 100%)'
      }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-oswald), sans-serif' }}>
            Gil-Son Safety Orientation
          </h1>
        </div>
      </header>

      <ProgressIndicator />

      {/* Form */}
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#231f20', fontFamily: 'var(--font-oswald), sans-serif' }}>
              Your Information
            </h2>
            <p className="mb-6" style={{ color: '#6b6b6b' }}>
              Please fill in your details to begin the orientation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1" style={{ color: '#231f20' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  style={{ color: '#231f20' }}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Hire Date */}
              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium mb-1" style={{ color: '#231f20' }}>
                  Hire Date *
                </label>
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    errors.hireDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ color: '#231f20' }}
                />
                {errors.hireDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.hireDate}</p>
                )}
              </div>

              {/* Supervisor Name */}
              <div>
                <label htmlFor="supervisorName" className="block text-sm font-medium mb-1" style={{ color: '#231f20' }}>
                  Supervisor Name *
                </label>
                <input
                  type="text"
                  id="supervisorName"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    errors.supervisorName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your supervisor's name"
                  style={{ color: '#231f20' }}
                />
                {errors.supervisorName && (
                  <p className="mt-1 text-sm text-red-500">{errors.supervisorName}</p>
                )}
              </div>

              {/* Status Type */}
              <div>
                <label htmlFor="statusType" className="block text-sm font-medium mb-1" style={{ color: '#231f20' }}>
                  Orientation Status *
                </label>
                <select
                  id="statusType"
                  name="statusType"
                  value={formData.statusType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    errors.statusType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ color: '#231f20' }}
                >
                  <option value="">Select your status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.statusType && (
                  <p className="mt-1 text-sm text-red-500">{errors.statusType}</p>
                )}
              </div>

              {/* Emergency Contact Section */}
              <div className="pt-4 border-t" style={{ borderColor: '#e5e5e5' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#231f20', fontFamily: 'var(--font-oswald), sans-serif' }}>
                  Emergency Contact
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="emergencyContactName" className="block text-sm font-medium mb-1" style={{ color: '#231f20' }}>
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-all ${
                        errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contact name"
                      style={{ color: '#231f20' }}
                    />
                    {errors.emergencyContactName && (
                      <p className="mt-1 text-sm text-red-500">{errors.emergencyContactName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="emergencyContactPhone" className="block text-sm font-medium mb-1" style={{ color: '#231f20' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-all ${
                        errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 555-5555"
                      style={{ color: '#231f20' }}
                    />
                    {errors.emergencyContactPhone && (
                      <p className="mt-1 text-sm text-red-500">{errors.emergencyContactPhone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium mb-1" style={{ color: '#231f20' }}>
                      Relationship *
                    </label>
                    <input
                      type="text"
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-all ${
                        errors.emergencyContactRelationship ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Spouse, Parent, Sibling"
                      style={{ color: '#231f20' }}
                    />
                    {errors.emergencyContactRelationship && (
                      <p className="mt-1 text-sm text-red-500">{errors.emergencyContactRelationship}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 px-6 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#a12642' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7a1c32'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#a12642'}
                >
                  Continue to Video
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
