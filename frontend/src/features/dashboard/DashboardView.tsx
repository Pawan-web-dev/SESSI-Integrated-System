/* Employer dashboard – page shell. Picks the section to show from the view model. */
/* Layout: header, sidebar, welcome banner, one section, footer. Sections live in ./sections/<menu-group>/ */
import { AppFooter } from '@/components/layout/AppFooter';
import { DashboardHeader } from './layout/DashboardHeader';
import { DashboardSidebar } from './layout/DashboardSidebar';
import { MobileMenuButton } from './layout/MobileMenuButton';
import { WelcomeBanner } from './layout/WelcomeBanner';
import { ComingSoonSection } from './sections/common/ComingSoonSection';
import { BusinessInformationSection } from './sections/company-profile/BusinessInformationSection';
import { ChangeRequestDetailsSection } from './sections/company-profile/ChangeRequestDetailsSection';
import { ChangeRequestsSection } from './sections/company-profile/ChangeRequestsSection';
import { ContactLocationSection } from './sections/company-profile/ContactLocationSection';
import { MandatoryDocumentsSection } from './sections/company-profile/MandatoryDocumentsSection';
import { NewChangeRequestSection } from './sections/company-profile/NewChangeRequestSection';
import { ContributionSubmittedSection } from './sections/contributions/ContributionSubmittedSection';
import { CreateContributionSection } from './sections/contributions/CreateContributionSection';
import { MonthlyContributionSection } from './sections/contributions/MonthlyContributionSection';
import { EmployeeProfilesSection } from './sections/employees/EmployeeProfilesSection';
import { RegisterEmployeeSection } from './sections/employees/RegisterEmployeeSection';
import { NotificationsInboxSection } from './sections/notifications/NotificationsInboxSection';
import { ContributionSummarySection } from './sections/overview/ContributionSummarySection';
import { OverviewSection } from './sections/overview/OverviewSection';
import { F4ReturnSection } from './sections/payments/F4ReturnSection';
import { F5ReturnSection } from './sections/payments/F5ReturnSection';
import { F5VoucherSection } from './sections/payments/F5VoucherSection';
import { GenerateChallanSection } from './sections/payments/GenerateChallanSection';
import { PaymentHistorySection } from './sections/payments/PaymentHistorySection';
import { ReceiptSection } from './sections/payments/ReceiptSection';
import { F4FormSection } from './sections/payments/F4FormSection';
import { F4DeclarationSection } from './sections/payments/F4DeclarationSection';
import { C1ScheduleSection } from './sections/payments/C1ScheduleSection';
import { ChangePasswordSection } from './sections/settings/ChangePasswordSection';
import type { ViewProps } from '@/types/view';

export function DashboardView({ v, P }: ViewProps) {
  return (
    <div className="min-h-[100vh] flex flex-col bg-white">
      <DashboardHeader v={v} P={P} />
      <div className="flex flex-1">
        <div className={`bd ${v.bdOn}`} onClick={v.toggleMenu}>
        </div>
        <DashboardSidebar v={v} P={P} />
        <main className="mn flex-1 p-6 box-border min-w-0">
          <MobileMenuButton v={v} P={P} />
          <WelcomeBanner v={v} P={P} />
          {v.isCS ? <ContributionSummarySection v={v} P={P} /> : null}
          {v.isDash ? <OverviewSection v={v} P={P} /> : null}
          {v.isReg ? <RegisterEmployeeSection v={v} P={P} /> : null}
          {v.isProf ? <EmployeeProfilesSection v={v} P={P} /> : null}
          {v.isMC ? <MonthlyContributionSection v={v} P={P} /> : null}
          {v.isCC ? <CreateContributionSection v={v} P={P} /> : null}
          {v.isDone ? <ContributionSubmittedSection v={v} P={P} /> : null}
          {v.isChallan ? <GenerateChallanSection v={v} P={P} /> : null}
          {v.isF5V ? <F5VoucherSection v={v} P={P} /> : null}
          {v.isHist ? <PaymentHistorySection v={v} P={P} /> : null}
          {v.isF4 ? <F4ReturnSection v={v} P={P} /> : null}
          {v.isF5 ? <F5ReturnSection v={v} P={P} /> : null}
          {v.isRcpt ? <ReceiptSection v={v} P={P} /> : null}
          {v.isF4Form ? <F4FormSection v={v} P={P} /> : null}
          {v.isF4Decl ? <F4DeclarationSection v={v} P={P} /> : null}
          {v.isC1 ? <C1ScheduleSection v={v} P={P} /> : null}
          {v.isNotif ? <NotificationsInboxSection v={v} P={P} /> : null}
          {v.isBI ? <BusinessInformationSection v={v} P={P} /> : null}
          {v.isMD ? <MandatoryDocumentsSection v={v} P={P} /> : null}
          {v.isCL ? <ContactLocationSection v={v} P={P} /> : null}
          {v.isPW ? <ChangePasswordSection v={v} P={P} /> : null}
          {v.isCRL ? <ChangeRequestsSection v={v} P={P} /> : null}
          {v.isCRF ? <NewChangeRequestSection v={v} P={P} /> : null}
          {v.isCRD ? <ChangeRequestDetailsSection v={v} P={P} /> : null}
          {v.notDash ? <ComingSoonSection v={v} P={P} /> : null}
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
