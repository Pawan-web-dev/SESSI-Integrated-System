import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { errorMessage } from '@/services/api/errors';
import { useGetDirectoratesQuery, useGetIndustriesQuery } from '@/services/api/masterApi';
import { saveLastApplication } from '../registrationApi';
import { RegistrationWizard } from '../wizard/RegistrationWizard';

/** Employer registration (#/register). Loads the master data; the wizard keeps its state in Redux. */
export function RegisterPage() {
  const navigate = useNavigate();
  const industries = useGetIndustriesQuery();
  const directorates = useGetDirectoratesQuery();

  useEffect(() => {
    document.title = 'Employer Registration | ESSI Sindh';
    window.scrollTo(0, 0);
  }, []);

  if (industries.isError || directorates.isError) {
    return (
      <div className="portal">
        <div className="wrap">
          <div className="card mt-10">
            <h1>Registration is not available right now</h1>
            <p className="sub">{errorMessage(industries.error || directorates.error)}</p>
            <button className="btn" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RegistrationWizard
      industries={industries.data ?? []}
      directorates={directorates.data ?? []}
      nav={(to) => navigate('/' + to)}
      onSubmitted={(app, cnic) => {
        saveLastApplication({ app_no: app.app_no, cnic });
        navigate(ROUTES.applicationSubmitted);
      }}
    />
  );
}
