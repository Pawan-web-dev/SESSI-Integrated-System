/* Employer registration wizard – page shell. */
/* Left column: progress / checklist. Right column: the current step from ./steps/. */
import { AppFooter } from '@/components/layout/AppFooter';
import { DocumentsChecklist } from './layout/DocumentsChecklist';
import { RegistrationHeader } from './layout/RegistrationHeader';
import { SecureNotice } from './layout/SecureNotice';
import { WizardProgress } from './layout/WizardProgress';
import { BusinessInformationStep } from './steps/BusinessInformationStep';
import { ContactLocationStep } from './steps/ContactLocationStep';
import { CreateAccountStep } from './steps/CreateAccountStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import { SubmittedStep } from './steps/SubmittedStep';
import { VerifyContactStep } from './steps/VerifyContactStep';
import type { ViewProps } from '@/types/view';

export function RegistrationView({ v, P }: ViewProps) {
  return (
    <div className="min-h-[100vh] flex flex-col bg-white">
      <RegistrationHeader v={v} P={P} />
      <div className="flex-1 w-full max-w-[1220px] my-0 mx-auto pt-0 px-4 pb-7 box-border">
        <div className="rg bg-white border border-solid border-essi-line rounded-2xl shadow-panel p-6 -mt-2.5">
          <aside className="w-[270px] flex-none max-w-full">
            {v.showSteps ? <WizardProgress v={v} P={P} /> : null}
            {v.showNeed ? <DocumentsChecklist /> : null}
            <SecureNotice />
          </aside>
          <section className="flex-1 min-w-0">
            {v.s_acct ? <CreateAccountStep v={v} P={P} /> : null}
            {v.s_verify ? <VerifyContactStep v={v} P={P} /> : null}
            {v.s_1 ? <BusinessInformationStep v={v} P={P} /> : null}
            {v.s_2 ? <DocumentUploadStep v={v} P={P} /> : null}
            {v.s_3 ? <ContactLocationStep v={v} P={P} /> : null}
            {v.s_4 ? <ReviewSubmitStep v={v} P={P} /> : null}
            {v.s_done ? <SubmittedStep v={v} P={P} /> : null}
          </section>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
