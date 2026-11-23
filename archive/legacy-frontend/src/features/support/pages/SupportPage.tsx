import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Search, HelpCircle, Send, ChevronDown, ChevronUp, Plus, Loader2, CheckCircle, FileText } from 'lucide-react';

const SupportPage: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Help & Support</h2>
          <p className='text-sm text-[#3d5a45]'>Find answers to common questions or contact support</p>
        </div>
        <div className='flex gap-2'>
          <NavLink
            to='/support/faqs'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            FAQs
          </NavLink>
          <NavLink
            to='/support/ticket'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Raise a Ticket
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const FAQsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      category: 'Registration',
      question: 'How do I register my company on the ESSI Employer Portal?',
      answer: `To register your company on the ESSI Employer Portal:\n\n1. Visit the ESSI portal homepage and click "Register" or navigate to /register\n2. Fill in the required business information including:\n   - Employer Name (as per SECP certificate)\n   - Business Type (Private Limited, Partnership, Sole Proprietorship, etc.)\n   - SECP Certificate Number\n   - NTN (National Tax Number)\n   - SRB Registration Number\n   - Complete business address with district\n3. Upload mandatory documents:\n   - SECP Certificate\n   - NTN Certificate\n   - SRB Registration Certificate\n   - Recent Electricity Bill (proof of address)\n   - Proprietor/Employer CNIC\n   - Bank Details/Letter\n   - Company Logo (if applicable)\n4. Submit the registration form\n5. ESSI will review your application and notify you via email/SMS once approved\n\nNote: You must have all documents ready before starting the registration process.`
    },
    {
      id: '2',
      category: 'Registration',
      question: 'What documents are required for registration?',
      answer: `The following documents are mandatory for employer registration:\n\n1. **SECP Certificate** - Certificate of incorporation/registration from Securities and Exchange Commission of Pakistan\n2. **NTN Certificate** - National Tax Number certificate from FBR\n3. **SRB Registration** - Sindh Revenue Board registration certificate\n4. **Electricity Bill** - Recent bill (not older than 3 months) showing business address\n5. **Proprietor/Employer CNIC** - Clear copy of CNIC (front and back)\n5. **Bank Details** - Bank letter or canceled cheque showing company account details\n\n**Conditional Documents** (if applicable):\n- Gas Bill (if gas connection exists)\n- Partnership Deed (for partnership firms)\n- Company Logo (for branding on challans/receipts)\n- Contact Details Document (official letterhead with phone/email)\n\nAll documents must be clear, legible, and in PDF/JPG/PNG format. Maximum file size: 5 MB per document.`
    },
    {
      id: '3',
      category: 'Contributions',
      question: 'How do I create a monthly contribution?',
      answer: `To create a monthly contribution:\n\n1. Navigate to **Monthly Contributions** → **Create Contribution**\n2. Select the contribution month from the dropdown\n3. The system will automatically populate:\n   - Number of active employees\n   - Total contribution amount (based on 5% of wages + 1% service charge)\n   - Individual employee breakdown\n4. Review the employee list and contribution amounts\n5. Click **Submit Contribution** to send for ESSI approval\n6. You will receive a reference number (e.g., CNTR-2026-00123)\n\n**Important Notes:**\n- Contributions must be submitted by the last day of the following month\n- Only active employees are included in the calculation\n- Minimum wage for calculation: PKR 25,000\n- Maximum wage ceiling: PKR 100,000\n- Service charge: 1% of total contribution (minimum PKR 40)`
    },
    {
      id: '4',
      category: 'Contributions',
      question: 'When is the contribution due date?',
      answer: `Monthly contributions are due by the **last day of the following month**.\n\n**Examples:**\n- January contribution → Due by February 28/29\n- February contribution → Due by March 31\n- March contribution → Due by April 30\n- November contribution → Due by December 31\n\n**Late Payment Penalties:**\n- 0.5% penalty per day of delay\n- Maximum penalty: 50% of principal amount\n- Service charge is also subject to penalty\n\n**To avoid penalties:**\n- Submit contributions early in the month\n- Set up payment reminders in Notification Settings\n- Use the "Pay Now" option for pending challans`
    },
    {
      id: '5',
      category: 'Payments',
      question: 'How do I pay a challan?',
      answer: `To pay a challan:\n\n1. Go to **Challans & Payments** → **Payment History**\n2. Find the unpaid challan (status: "Unpaid")\n3. Click **Pay Now** button\n4. You will be redirected to the payment gateway\n5. Choose payment method:\n   - Online Banking (1Bill, JazzCash, EasyPaisa, etc.)\n   - Credit/Debit Card\n   - Bank Transfer (manual)\n6. Complete the payment\n7. System will generate a receipt (e.g., RCP-2026-008590)\n\n**For Bank Transfers:**\n- Use the challan number as reference\n- Upload the deposit slip in the portal\n- Allow 1-2 business days for verification\n\n**Receipt Download:**\n- Available immediately after successful payment\n- Can be downloaded from Payment History or Receipts section\n- Valid for audit and compliance purposes`
    },
    {
      id: '6',
      category: 'Payments',
      question: 'What is the difference between F-4 and F-5?',
      answer: `**F-4 Statement (Monthly Contribution Statement):**\n- Summary of all paid contributions for a period\n- Shows: Month, Receipt No., Employees, Amount, Mode\n- Used for: Monthly reconciliation, audit trail\n- Generated automatically when contributions are paid\n\n**F-5 Voucher (Late Payment Voucher):**\n- Generated ONLY for late payments with penalties\n- Shows detailed penalty calculation:\n  - Principal contribution amount\n  - Service charge\n  - Days late\n  - Penalty percentage (0.5% per day, max 50%)\n  - Penalty amount\n  - Total payable\n- Includes amount in words for official records\n\n**When F-5 is generated:**\n- Payment made after due date\n- System automatically calculates penalty\n- Separate voucher for each late payment\n- Must be paid in full (principal + penalty)`
    },
    {
      id: '7',
      category: 'Employee Management',
      question: 'How do I register a new employee?',
      answer: `To register a new employee:\n\n1. Navigate to **Employee Management** → **Register Employee**\n2. Fill in the required fields:\n   - **Full Name** (as per CNIC)\n   - **Father's Name** (as per CNIC)\n   - **Gender** (Male/Female/Transgender)\n   - **CNIC Number** (13 digits, format: 42101-1234567-1)\n   - **Date of Birth** (DD/MM/YYYY)\n   - **Mobile Number** (03XX-XXXXXXX)\n   - **Designation** (e.g., Production Supervisor)\n   - **Skill Level** (Unskilled/Semi-Skilled/Skilled/Highly Skilled)\n   - **Employment Type** (Permanent/Contractual/Daily Wages/Piece Rated)\n   - **Wage Type** (Monthly/Daily)\n   - **Payment Frequency** (Monthly/Daily/Weekly)\n   - **Date of Joining** (DD/MM/YYYY)\n   - **Monthly Wages** (PKR)\n   - **Bank Account** (optional)\n3. Upload employee photo (optional, max 5MB, square aspect ratio)\n4. Click **Save Employee**\n\n**Validation Rules:**\n- CNIC must be unique (13 digits)\n- Mobile number must be valid Pakistani format\n- Wages must be between PKR 25,000 and 100,000\n- Date of joining cannot be in the future`
    },
    {
      id: '8',
      category: 'Employee Management',
      question: 'How do I update employee status (Active/Inactive/Separated)?',
      answer: `To update employee status:\n\n1. Go to **Employee Management** → **Profile for Contribution**\n2. Find the employee in the list\n3. Click the **Actions** dropdown (three dots or arrow)\n4. Select the desired action:\n   - **Activate/Deactivate** - Toggle between Active/Inactive\n   - **Separate** - Mark as Separated (termination)\n   - **View** - View full employee profile\n   - **Edit** - Modify employee details\n\n**Status Definitions:**\n- **Active** - Currently employed, included in contributions\n- **Inactive** - Temporarily not working (leave, suspension), NOT included in contributions\n- **Separated** - Permanently left (resigned, terminated), NOT included in contributions\n\n**Important:**\n- Separated employees cannot be reactivated (create new record if rehired)\n- Inactive employees can be reactivated anytime\n- Status changes affect next month's contribution calculation`
    },
    {
      id: '9',
      category: 'Company Profile',
      question: 'How do I submit a change request for company information?',
      answer: `To submit a change request:\n\n1. Navigate to **Company Profile** → **Change Requests**\n2. Click **New Change Request**\n3. Select the field to change from dropdown:\n   - Employer Name (requires amended SECP certificate)\n   - Business Type (requires SECP certificate showing new type)\n   - SECP Certificate No. (requires new SECP certificate)\n   - NTN (requires NTN certificate)\n   - SRB Registration No. (requires SRB certificate)\n   - Business Address (requires recent utility bill)\n   - District (requires recent utility bill)\n   - GPS Location (optional: photo of premises)\n   - Contact Person (optional: authority letter)\n   - Designation (optional)\n   - Mobile No. (optional)\n   - Email Address (optional)\n   - Office Phone (optional)\n4. Enter the **new value**\n4. Provide a **reason** (minimum 10 characters)\n5. Upload **supporting document** (required for mandatory fields)\n6. Click **Submit Request**\n\n**After Submission:**\n- Request gets a reference number (e.g., CR-2026-0002)\n- Status: "Pending Review" → "Under Review" → "Approved/Rejected"\n- ESSI typically responds within 5 business days\n- If approved: Company profile is automatically updated\n- If rejected: Reason provided, can resubmit with corrected documents`
    },
    {
      id: '10',
      category: 'Technical',
      question: 'What are the system requirements for the portal?',
      answer: `**Browser Compatibility:**\n- Chrome 90+ (recommended)\n- Firefox 88+\n- Safari 14+\n- Edge 90+\n\n**Requirements:**\n- JavaScript enabled\n- Cookies enabled\n- Minimum screen resolution: 1366x768\n- Internet connection (broadband recommended)\n\n**Mobile Access:**\n- Responsive design works on tablets and phones\n- Best experience on tablets (768px+ width)\n- Mobile app not currently available\n\n**File Upload Limits:**\n- Maximum file size: 5 MB\n- Supported formats: PDF, JPG, PNG\n- Photo uploads: Auto-resized to 200x200px\n\n**Security:**\n- Session timeout: 30 minutes of inactivity\n- Password requirements: 8+ chars, 1 uppercase, 1 number\n- 2FA not currently implemented`
    },
    {
      id: '11',
      category: 'Technical',
      question: 'I forgot my password. How do I reset it?',
      answer: `**Password Reset Process:**\n\n1. On the login page, click **"Forgot Password?"**\n2. Enter your registered email or employer number\n3. Check your email for reset link (expires in 1 hour)\n4. Click the link and enter new password\n5. Password requirements:\n   - Minimum 8 characters\n   - At least 1 uppercase letter\n   - At least 1 number\n   - Cannot match current password\n6. Confirm new password\n7. Login with new credentials\n\n**If you don't receive the email:**\n- Check spam/junk folder\n- Verify email is registered with your account\n- Contact support if email is not accessible\n\n**Change Password (when logged in):**\n- Go to **Settings** → **Change Password**\n- Enter current password\n- Enter new password (with requirements above)\n- Confirm new password\n- Click **Update Password**`
    },
    {
      id: '12',
      category: 'General',
      question: 'Who do I contact for technical support?',
      answer: `**ESSI Employer Portal Support:**\n\n**Email:** support@essi.sindh.gov.pk\n**Phone:** 021-9920XXXX (Ext. 123)\n**Hours:** Monday-Friday, 9:00 AM - 5:00 PM (PKT)\n\n**For Urgent Issues:**\n- Payment failures during business hours\n- System errors preventing submission\n- Login/access issues\n\n**When Contacting Support, Please Provide:**\n1. Your Employer Number (e.g., 3-61-0001)\n2. Company Name\n3. Detailed description of the issue\n4. Screenshots (if applicable)\n5. Browser and OS information\n6. Steps to reproduce the problem\n\n**Self-Service Resources:**\n- FAQs (this page)\n- Video tutorials in Help section\n- User manual (downloadable PDF)\n- System status page: status.essi.sindh.gov.pk`
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(faqs.map(f => f.category))];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Frequently Asked Questions</h3>

      <div className='mb-6'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search FAQs...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full min-h-[46px] pl-10 pr-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
          />
        </div>
      </div>

      <div className='flex flex-wrap gap-2 mb-6'>
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            searchQuery === '' ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5]'
          }`}
          onClick={() => setSearchQuery('')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              searchQuery.toLowerCase().includes(cat.toLowerCase()) ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5]'
            }`}
            onClick={() => setSearchQuery(cat.toLowerCase())}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className='space-y-3'>
        {filteredFaqs.length === 0 ? (
          <div className='text-center py-8'>
            <HelpCircle className='w-12 h-12 text-gray-300 mx-auto mb-4' />
            <p className='text-gray-500'>No FAQs found matching your search</p>
            <p className='text-sm text-gray-400 mt-1'>Try different keywords or browse all categories</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className='bg-white border border-[#cfe4d5] rounded-lg overflow-hidden'
            >
              <button
                onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                className='w-full px-6 py-4 flex items-center justify-between gap-4 text-left'
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#e3f2e8] text-[#067a35]'>
                    {faq.category}
                  </span>
                  <h4 className='font-semibold text-[#17321f] pr-8'>{faq.question}</h4>
                </div>
                {expanded === faq.id ? (
                  <ChevronUp className='w-5 h-5 text-[#3d5a45] flex-shrink-0' />
                ) : (
                  <ChevronDown className='w-5 h-5 text-[#3d5a45] flex-shrink-0' />
                )}
              </button>
              {expanded === faq.id && (
                <div className='px-6 pb-6 border-t border-[#cfe4d5] bg-[#faf9f5]'>
                  <pre className='text-sm text-[#3d5a45] whitespace-pre-wrap font-normal'>{faq.answer}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export const RaiseTicketPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    subject: '',
    category: 'Technical Issue',
    priority: 'Medium',
    description: '',
    employerNo: '3-61-0001',
    attachment: null as File | null
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ subject: '', category: 'Technical Issue', priority: 'Medium', description: '', employerNo: '3-61-0001', attachment: null });
  };

  if (submitted) {
    return (
      <Card>
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-[#e3f2e8] border border-[#cfe4d5] rounded-full flex items-center justify-center mx-auto mb-4'>
            <CheckCircle className='w-8 h-8 text-[#067a35]' />
          </div>
          <h3 className='text-xl font-bold text-[#17321f] mb-2'>Ticket Submitted Successfully!</h3>
          <p className='text-[#3d5a45] mb-6'>Your support ticket has been created. Our team will review it and respond within 24-48 hours.</p>
          <p className='text-sm text-[#3d5a45] mb-6'>Reference: <span className='font-mono font-semibold text-[#0b4d24]'>TKT-{Date.now().toString().slice(-6)}</span></p>
          <Button onClick={() => setSubmitted(false)} className='flex items-center gap-2'>
            <Plus size={18} />
            Create Another Ticket
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Raise a Support Ticket</h3>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            label='Subject *'
            placeholder='Brief description of the issue'
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <div className='flex flex-col gap-1.5'>
            <label className='font-semibold text-sm text-[#17321f]'>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
              required
            >
              <option value='Technical Issue'>Technical Issue</option>
              <option value='Payment Problem'>Payment Problem</option>
              <option value='Registration Help'>Registration Help</option>
              <option value='Contribution Query'>Contribution Query</option>
              <option value='Document Issue'>Document Issue</option>
              <option value='Account Access'>Account Access</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='font-semibold text-sm text-[#17321f]'>Priority *</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
              required
            >
              <option value='Low'>Low - General inquiry</option>
              <option value='Medium'>Medium - Affects workflow</option>
              <option value='High'>High - Urgent, blocking operations</option>
              <option value='Critical'>Critical - System down, payment failure</option>
            </select>
          </div>
          <Input
            label='Employer Number'
            value={formData.employerNo || ''}
            placeholder='3-61-0001 (auto-filled if logged in)'
            disabled
          />
        </div>

        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={8}
            className='w-full min-h-[150px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] resize-y'
            placeholder='Please describe your issue in detail. Include:\n- Steps to reproduce the problem\n- Expected vs actual behavior\n- Any error messages\n- Browser/device information\n- Screenshots (attach below)'
            required
          />
        </div>

        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Attachment (Optional)</label>
          <div className='border-2 border-dashed border-[#cfe4d5] rounded-lg p-6 text-center'>
            <input
              type='file'
              id='attachment'
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={(e) => { const file = e.target.files?.[0]; if (file) setFormData({ ...formData, attachment: file }); }}
              className='hidden'
            />
            <label htmlFor='attachment' className='cursor-pointer'>
              <FileText className='w-10 h-10 text-[#3d5a45] mx-auto mb-2' />
              <p className='text-[#3d5a45]'>Click to upload or drag and drop</p>
              <p className='text-sm text-gray-400 mt-1'>PDF, JPG, PNG up to 5MB</p>
            </label>
            {formData.attachment && (
              <div className='mt-3 p-3 bg-white border border-[#cfe4d5] rounded-md flex items-center justify-between'>
                <span className='text-sm text-[#17321f]'>{formData.attachment?.name}</span>
                <span className='text-sm text-[#3d5a45]'>{(formData.attachment?.size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4 border-t border-[#cfe4d5]'>
          <Button type='button' variant='ghost' onClick={() => setFormData({ subject: '', category: 'Technical Issue', priority: 'Medium', description: '', employerNo: '3-61-0001', attachment: null })}>
            Clear Form
          </Button>
          <Button type='submit' className='flex items-center gap-2' disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Ticket
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SupportPage;