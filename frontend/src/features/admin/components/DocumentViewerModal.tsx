import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { COMPANY_DOCUMENTS, type Account, type StoredDocument } from '@/services/portal';

/** Turn a data URL into a temporary blob URL (browsers refuse to show large data: URLs in frames). */
function toBlobUrl(doc: StoredDocument): string | null {
  try {
    const [head, data] = doc.dataUrl.split(',');
    const mime = /:(.*?)[;,]/.exec(head)?.[1] || doc.type || 'application/octet-stream';
    const bin = atob(data);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return null;
  }
}

interface DocumentViewerModalProps {
  application: Account | null;
  /** key from COMPANY_DOCUMENTS; null = closed */
  docKey: string | null;
  onClose: () => void;
}

/** Shows one uploaded company document (image / PDF), or a placeholder for demo records. */
export function DocumentViewerModal({ application, docKey, onClose }: DocumentViewerModalProps) {
  const meta = COMPANY_DOCUMENTS.find((d) => d[0] === docKey);
  const doc = docKey ? application?.uploadedDocs?.[docKey] : undefined;
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!doc) return setUrl(null);
    const u = toBlobUrl(doc);
    setUrl(u);
    return () => {
      if (u) URL.revokeObjectURL(u);
    };
  }, [doc]);

  const open = !!application && !!meta;
  const type = (doc?.type || '').toLowerCase();
  const isPdf = !!doc && (type === 'application/pdf' || /\.pdf$/i.test(doc.name));

  return (
    <Modal open={open} onClose={onClose} labelledBy="dv-t" boxClassName="max-w-[820px] w-full">
      <h1 id="dv-t" className="text-[20px]">
        {meta?.[1] || 'Document'}
      </h1>
      <p className="sub mt-0.5 mb-3">{application ? application.co.employer + ' — ' + (doc ? doc.name : 'demo copy') : ''}</p>
      {doc && url ? (
        type.startsWith('image/') ? (
          <img alt={doc.name} src={url} className="max-w-full max-h-[70vh] block mx-auto border border-essi-line rounded-lg" />
        ) : isPdf ? (
          <iframe title={doc.name} src={url} className="w-full h-[70vh] border border-essi-line rounded-lg" />
        ) : (
          <p className="admin-muted">Preview is not available for this file type. Use Download to open it.</p>
        )
      ) : (
        <div className="border border-dashed border-[#9cc7aa] rounded-[10px] bg-[#f6fbf8] py-9 px-5 text-center">
          <div className="text-[40px]" aria-hidden="true">
            📄
          </div>
          <b className="text-[16px] text-[#10331d]">{meta?.[1]}</b>
          <p className="admin-muted mt-2 mb-0">
            Sample placeholder — no actual file is stored for this demo application.
            <br />
            Documents uploaded through the registration form will open here.
          </p>
        </div>
      )}
      <div className="row justify-end mt-4 gap-2">
        {doc && url ? (
          <a className="btn ghost no-underline" href={url} download={doc.name}>
            Download
          </a>
        ) : null}
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
