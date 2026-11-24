/* Shows an uploaded document (PDF or image) over the current page. State: features/documents/documentViewerSlice.ts */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeDocument } from '@/features/documents/documentViewerSlice';

const LINK = 'inline-flex items-center min-h-[38px] px-3.5 rounded-md border border-solid border-white/60 text-white no-underline text-[14px] font-semibold';

export function DocumentViewer() {
  const dispatch = useAppDispatch();
  const { open, loading, name, url, contentType, error } = useAppSelector((s) => s.documentViewer);

  useEffect(() => {
    if (!open) return;
    // capture phase on window: Escape closes only the viewer, not a dialog underneath it
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      void dispatch(closeDocument());
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, dispatch]);

  if (!open) return null;
  const close = () => void dispatch(closeDocument());
  const isImage = contentType.startsWith('image/');

  return (
    <div role="dialog" aria-modal="true" aria-label={'Document: ' + name} className="fixed inset-0 z-[2000] flex flex-col bg-black/80 font-[Arial,sans-serif]" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="flex flex-wrap items-center gap-2.5 px-4 py-2.5 bg-[#0b4d24] text-white">
        <b className="flex-1 min-w-0 truncate text-[15px]">{name}</b>
        {url ? (
          <>
            <a className={LINK} href={url} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
            <a className={LINK} href={url} download={name}>
              Download
            </a>
          </>
        ) : null}
        <button type="button" onClick={close} className="min-h-[38px] px-4 rounded-md border-0 bg-white text-[#0b4d24] font-bold text-[14px] cursor-pointer">
          Close
        </button>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-3" onClick={(e) => e.target === e.currentTarget && close()}>
        {loading ? <p className="text-white text-[15px]">Opening document…</p> : null}
        {error ? <p role="alert" className="max-w-[520px] bg-white text-[#b00020] rounded-lg p-4 text-[15px]">{error}</p> : null}
        {url && isImage ? <img src={url} alt={name} className="max-w-full max-h-full object-contain bg-white" /> : null}
        {url && !isImage ? <iframe src={url} title={name} className="w-full h-full max-w-[1100px] border-0 bg-white rounded" /> : null}
      </div>
    </div>
  );
}
