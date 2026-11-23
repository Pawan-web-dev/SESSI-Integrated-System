import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { submitRegistration } from '@/services/portal';
import { RegistrationWizard } from '../wizard/RegistrationWizard';

/** Employer registration (#/register). */
export function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Employer Registration | ESSI Sindh';
    window.scrollTo(0, 0);
  }, []);

  return (
    <RegistrationWizard
      nav={(to) => navigate('/' + to)}
      onRegistered={(form) => {
        submitRegistration(form);
        navigate(ROUTES.applicationSubmitted);
      }}
    />
  );
}
