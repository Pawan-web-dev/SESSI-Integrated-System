import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Eye, EyeOff, Loader2, FileText, Upload, X } from 'lucide-react';

const registerSchema = z.object({
  employerName: z.string().min(2, 'Employer name is required').max(200),
  businessType: z.string().min(1, 'Business type is required'),
  secpCertificate: z.string().min(1, 'SECP Certificate No. is required'),
  ntn: z.string().min(1, 'NTN is required'),
  srbRegistration: z.string().min(1, 'SRB Registration No. is required'),
  address: z.string().min(10, 'Business address is required'),
  district: z.string().min(1, 'District is required'),
  gpsLocation: z.string().optional(),
  contactPerson: z.string().optional(),
  designation: z.string().optional(),
  mobile: z.string().regex(/^03\d{2}-\d{7}$/, 'Mobile must be in format 03XX-XXXXXXX').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface DocumentUpload {
  name: string;
  file: File | null;
  preview: string | null;
  required: boolean;
}

const documentFields: Omit<DocumentUpload, 'file' | 'preview'>[] = [
  { name: 'SECP Certificate', required: true },
  { name: 'NTN Certificate', required: true },
  { name: 'SRB Registration', required: true },
  { name: 'Electricity Bill', required: true },
  { name: 'Gas Bill', required: false },
  { name: 'Partnership Deed', required: false },
  { name: 'Proprietor/Employer CNIC', required: true },
  { name: 'Bank Details', required: true },
  { name: 'Company Logo', required: false },
  { name: 'Contact Numbers & Email', required: true },
];

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState({ password: false, confirm: false });
  const [documents, setDocuments] = React.useState<DocumentUpload[]>(
    documentFields.map(d => ({ ...d, file: null, preview: null }))
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const handleFileChange = (index: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5 MB');
      return;
    }
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setDocuments(prev => prev.map((doc, i) =>
        i === index ? { ...doc, file, preview: reader.result as string } : doc
      ));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (index: number) => {
    setDocuments(prev => prev.map((doc, i) =>
      i === index ? { ...doc, file: null, preview: null } : doc
    ));
  };

  const validateStep = (step: number) => {
    const stepFields: Record<number, (keyof RegisterFormData)[]> = {
      1: ['employerName', 'businessType', 'secpCertificate', 'ntn', 'srbRegistration'],
      2: ['address', 'district', 'gpsLocation', 'contactPerson', 'designation', 'mobile', 'email', 'phone'],
      3: ['password', 'confirmPassword', 'termsAccepted'],
    };

    const fields = stepFields[step] || [];
    let isValid = true;

    fields.forEach(field => {
      if (errors[field]) {
        isValid = false;
      }
    });

    if (step === 1) {
      const requiredDocs = documents.filter((d) => d.required && !d.file);
      if (requiredDocs.length > 0) {
        isValid = false;
      }
    }

    return isValid;
  };

  const onSubmit = async (_data: RegisterFormData) => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#faf9f5] p-6'>
        <Card className='w-full max-w-md'>
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-[#e3f2e8] border border-[#cfe4d5] rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-[#067a35]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-[#0b4d24] mb-2'>Registration Submitted!</h2>
            <p className='text-[#3d5a45] mb-6'>Your registration application has been submitted successfully.</p>
            <div className='bg-[#f1faf4] border border-[#cfe4d5] rounded-lg p-4 mb-6 text-left'>
              <p className='font-semibold text-[#17321f] mb-2'>What happens next?</p>
              <ul className='text-sm text-[#3d5a45] space-y-1 list-disc list-inside'>
                <li>ESSI will review your application within 5-7 business days</li>
                <li>You will receive an email/SMS notification once reviewed</li>
                <li>If approved, you will receive your Employer Number and login credentials</li>
                <li>If additional documents are needed, you will be contacted</li>
              </ul>
            </div>
            <p className='text-sm text-[#3d5a45] mb-6'>Reference: <span className='font-mono font-semibold text-[#0b4d24]'>REG-{Date.now().toString().slice(-8)}</span></p>
            <Button onClick={() => { setSubmitted(false); reset(); setActiveStep(1); setDocuments(documents.map(d => ({ ...d, file: null, preview: null }))); }} className='flex items-center gap-2 mx-auto'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' /></svg>
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-[#17321f]'>Business Information</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          label='Employer Name *'
          placeholder='ABC Manufacturing (Pvt.) Ltd.'
          {...register('employerName')}
          error={errors.employerName?.message as string}
        />
        <div className='flex flex-col gap-1.5'>
          <label className='font-semibold text-sm text-[#17321f]'>Business Type *</label>
          <select
            {...register('businessType')}
            className={`w-full min-h-[46px] px-3 border rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] ${
              errors.businessType ? 'border-red-500' : 'border-[#b9d6c4]'
            }`}
          >
            <option value=''>--- Please Select ---</option>
            <option value='Private Limited Company'>Private Limited Company</option>
            <option value='Public Limited Company'>Public Limited Company</option>
            <option value='Partnership Firm'>Partnership Firm</option>
            <option value='Sole Proprietorship'>Sole Proprietorship</option>
            <option value='Association of Persons'>Association of Persons</option>
            <option value='Trust'>Trust</option>
            <option value='NGO/NPO'>NGO/NPO</option>
            <option value='Government Entity'>Government Entity</option>
            <option value='Other'>Other</option>
          </select>
          {errors.businessType && <span className='text-red-500 text-xs mt-1'>{errors.businessType.message as string}</span>}
        </div>
        <Input
          label='SECP Certificate No. *'
          placeholder='123456789'
          {...register('secpCertificate')}
          error={errors.secpCertificate?.message as string}
        />
        <Input
          label='NTN *'
          placeholder='1234567-8'
          {...register('ntn')}
          error={errors.ntn?.message as string}
        />
        <Input
          label='SRB Registration No. *'
          placeholder='SRB-12345'
          {...register('srbRegistration')}
          error={errors.srbRegistration?.message as string}
        />
      </div>

      <h3 className='text-lg font-semibold text-[#17321f] pt-4 border-t border-[#cfe4d5]'>Mandatory Documents</h3>
      <p className='text-sm text-[#3d5a45]'>Upload all required documents. Maximum file size: 5 MB. Formats: PDF, JPG, PNG.</p>
      <div className='space-y-3'>
        {documents.map((doc, index) => (
          <div
            key={doc.name}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
              doc.required ? 'bg-white border-[#cfe4d5]' : 'bg-[#faf9f5] border-[#e5ebe7]'
            }`}
          >
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <p className='font-medium text-[#17321f]'>{doc.name}</p>
                {doc.required && (
                  <span className='px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700'>
                    Required
                  </span>
                )}
              </div>
              <p className='text-sm text-[#3d5a45] mt-0.5'>
                {doc.required ? 'This document is required for registration' : 'Optional - upload if applicable'}
              </p>
            </div>
            <div className='flex items-center gap-2 flex-shrink-0'>
              {doc.file ? (
                <div className='flex items-center gap-3 bg-white border border-[#cfe4d5] rounded-lg px-3 py-2'>
                  <FileText className='w-5 h-5 text-[#067a35]' />
                  <span className='text-sm text-[#17321f] truncate max-w-[200px]'>{doc.file.name}</span>
                  <span className='text-xs text-[#3d5a45]'>{(doc.file.size / 1024).toFixed(1)} KB</span>
                  <button
                    type='button'
                    onClick={() => removeFile(index)}
                    className='text-red-500 hover:text-red-700 p-1'
                    aria-label='Remove file'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              ) : (
                <label className='cursor-pointer'>
                  <input
                    type='file'
                    accept='.pdf,.jpg,.jpeg,.png'
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileChange(index, file); }}
                    className='hidden'
                    id={`doc-${index}`}
                  />
                  <button
                    type='button'
                    onClick={() => document.getElementById(`doc-${index}`)?.click()}
                    className='flex items-center gap-2 px-4 py-2 bg-[#067a35] text-white rounded-lg text-sm font-medium hover:bg-[#08401e] transition-colors'
                  >
                    <Upload className='w-4 h-4' />
                    {doc.required ? 'Upload' : 'Upload (Optional)'}
                  </button>
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between pt-4 border-t border-[#cfe4d5]'>
        <Button type='button' variant='ghost' disabled>Back</Button>
        <Button
          type='button'
          onClick={() => validateStep(1) && setActiveStep(2)}
          disabled={!validateStep(1) || submitting}
          className='flex items-center gap-2'
        >
          Next
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-[#17321f]'>Contact & Location</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          label='Business Address *'
          placeholder='Plot 123, Sector 45, Korangi Industrial Area'
          {...register('address')}
          error={errors.address?.message as string}
          className='md:col-span-2'
        />
        <Input
          label='District *'
          placeholder='Korangi, Karachi'
          {...register('district')}
          error={errors.district?.message as string}
        />
        <Input
          label='GPS Location (Optional)'
          placeholder='24.8607, 67.0011'
          {...register('gpsLocation')}
          error={errors.gpsLocation?.message as string}
        />
        <Input
          label='Contact Person (Optional)'
          placeholder='Muhammad Ali'
          {...register('contactPerson')}
          error={errors.contactPerson?.message as string}
        />
        <Input
          label='Designation (Optional)'
          placeholder='HR Manager'
          {...register('designation')}
          error={errors.designation?.message as string}
        />
        <Input
          label='Mobile No. (Optional)'
          placeholder='0300-1234567'
          {...register('mobile')}
          error={errors.mobile?.message as string}
        />
        <Input
          label='Email Address (Optional)'
          type='email'
          placeholder='hr@abcmanufacturing.example'
          {...register('email')}
          error={errors.email?.message as string}
        />
        <Input
          label='Office Phone (Optional)'
          placeholder='021-35000000'
          {...register('phone')}
          error={errors.phone?.message as string}
        />
      </div>

      <div className='flex justify-between pt-4 border-t border-[#cfe4d5]'>
        <Button type='button' variant='ghost' onClick={() => setActiveStep(1)}>Back</Button>
        <Button
          type='button'
          onClick={() => validateStep(2) && setActiveStep(3)}
          disabled={!validateStep(2) || submitting}
          className='flex items-center gap-2'
        >
          Next
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-[#17321f]'>Account Credentials</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Password *</label>
          <div className='relative'>
            <input
              type={showPassword.password ? 'text' : 'password'}
              {...register('password')}
              className={`w-full min-h-[46px] px-3 border rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] pr-10 ${
                errors.password ? 'border-red-500' : 'border-[#b9d6c4]'
              }`}
              placeholder='Enter password'
            />
            <button
              type='button'
              onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3d5a45]'
              aria-label='Toggle password visibility'
            >
              {showPassword.password ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.password && <span className='text-red-500 text-xs mt-1 block'>{errors.password.message as string}</span>}
          <div className='mt-2 space-y-1 text-xs text-[#3d5a45]'>
            <p className={`${password.length >= 8 ? 'text-[#067a35]' : 'text-gray-400'}`}>✓ At least 8 characters</p>
            <p className={`${/[A-Z]/.test(password) ? 'text-[#067a35]' : 'text-gray-400'}`}>✓ At least one uppercase letter</p>
            <p className={`${/[0-9]/.test(password) ? 'text-[#067a35]' : 'text-gray-400'}`}>✓ At least one number</p>
          </div>
        </div>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Confirm Password *</label>
          <div className='relative'>
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={`w-full min-h-[46px] px-3 border rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] pr-10 ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#b9d6c4]'
              }`}
              placeholder='Confirm password'
            />
            <button
              type='button'
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3d5a45]'
              aria-label='Toggle password visibility'
            >
              {showPassword.confirm ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.confirmPassword && <span className='text-red-500 text-xs mt-1 block'>{errors.confirmPassword.message as string}</span>}
          {confirmPassword && password === confirmPassword && password && !errors.confirmPassword && (
            <span className='text-[#067a35] text-xs mt-1 block'>✓ Passwords match</span>
          )}
        </div>
      </div>

      <div className='bg-[#f1faf4] border border-[#cfe4d5] rounded-lg p-4'>
        <h4 className='font-semibold text-[#17321f] mb-2 flex items-center gap-2'>
          <svg className='w-4 h-4 text-[#067a35]' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
          Terms & Conditions
        </h4>
        <div className='text-sm text-[#3d5a45] space-y-2 max-h-60 overflow-y-auto pr-2'>
          <p className='font-medium'>By registering, you agree to:</p>
          <ul className='list-disc list-inside space-y-1'>
            <li>Provide accurate and complete information</li>
            <li>Maintain valid documents and update them when they expire</li>
            <li>Pay monthly contributions by the due date (last day of following month)</li>
            <li>Accept late payment penalties (0.5% per day, max 50%)</li>
            <li>Comply with ESSI Act, 1965 and all applicable laws</li>
            <li>Allow ESSI to verify information with relevant authorities</li>
            <li>Receive communications via email and SMS</li>
          </ul>
        </div>
        <label className='flex items-start gap-3 mt-4 cursor-pointer'>
          <input
            type='checkbox'
            {...register('termsAccepted')}
            className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f] mt-0.5'
          />
          <span className='text-sm text-[#3d5a45]'>
            I have read and agree to the <a href='#' className='text-[#067a35] underline hover:text-[#08401e]'>Terms & Conditions</a> and <a href='#' className='text-[#067a35] underline hover:text-[#08401e]'>Privacy Policy</a>
          </span>
        </label>
        {errors.termsAccepted && <span className='text-red-500 text-xs mt-1 block'>{errors.termsAccepted.message as string}</span>}
      </div>

      <div className='flex justify-between pt-4 border-t border-[#cfe4d5]'>
        <Button type='button' variant='ghost' onClick={() => setActiveStep(2)}>Back</Button>
        <Button
          type='submit'
          onClick={handleSubmit(onSubmit)}
          disabled={!validateStep(3) || submitting}
          className='flex items-center gap-2'
        >
          {submitting ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin' />
              Submitting...
            </>
          ) : (
            'Submit Registration'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#faf9f5] p-6'>
      <Card className='w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-[#0b4d24]'>Employer Registration</h2>
            <p className='text-sm text-[#3d5a45]'>Register your company with ESSI Sindh</p>
          </div>
          <div className='flex items-center gap-4'>
            {[1, 2, 3].map(step => (
              <div key={step} className='flex items-center'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step < activeStep ? 'bg-[#067a35] text-white' :
                    step === activeStep ? 'bg-[#0b4d24] text-white' :
                    'bg-white text-[#3d5a45] border border-[#cfe4d5]'
                  }`}
                >
                  {step < activeStep ? (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                  ) : step.toString()}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-colors ${
                      step < activeStep ? 'bg-[#067a35]' : 'bg-[#cfe4d5]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='mb-6'>
          <div className='flex items-center gap-2'>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeStep === 1 ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5]'
            }`}>
              Business Info
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeStep === 2 ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5]'
            }`}>
              Contact & Location
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeStep === 3 ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5]'
            }`}>
              Credentials
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 1 && renderStep1()}
          {activeStep === 2 && renderStep2()}
          {activeStep === 3 && renderStep3()}
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;