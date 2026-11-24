import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PortalFooter } from '@/components/layout/PortalFooter';
import { PortalHeader } from '@/components/layout/PortalHeader';
import { PortalPage } from '@/components/layout/PortalPage';
import { errorMessage } from '@/services/api/errors';
import { useGetOutboxQuery } from '../inboxApi';
import { MessageCard } from '../components/MessageCard';

/**
 * SMS / e-mail inbox for testing (#/inbox): messages the server would send, filterable by mobile or e-mail.
 * Works only while the backend runs with DEMO_MODE=true (until an SMS gateway and SMTP are connected).
 */
export function InboxPage() {
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'Demo inbox | ESSI Sindh';
  }, []);

  const q = query.trim().toLowerCase();
  const { data: messages = [], error, isFetching } = useGetOutboxQuery(q, { pollingInterval: 10000 });

  return (
    <PortalPage label="Demo inbox">
      <PortalHeader subtitle="Demo SMS & Email Inbox">
        <Link to={ROUTES.login}>Back to login</Link>
      </PortalHeader>
      <div className="wrap">
        <div className="card">
          <h1>Messages sent by ESSI</h1>
          <p className="sub">This portal cannot send real SMS or email, so every message ESSI would send is shown here. Enter your mobile number or email to see only your messages.</p>
          <div className="f max-w-[420px]">
            <label htmlFor="in-q">Mobile number or email</label>
            <input className="inp" id="in-q" placeholder="e.g. 0333-1112223 or name@company.com" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div id="in-list">{error ? <p className="text-danger">{errorMessage(error)}</p> : messages.length ? messages.map((m, i) => <MessageCard key={i} message={m} />) : <p className="text-ink-muted">{isFetching ? 'Loading…' : 'No messages yet.'}</p>}</div>
        </div>
      </div>
      <PortalFooter />
    </PortalPage>
  );
}
