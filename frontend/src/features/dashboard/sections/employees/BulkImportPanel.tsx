/* Employee registration – Excel / CSV file import and API (pasted JSON) import, with a preview before saving. */
import { useRef, useState } from 'react';
import type { ViewProps } from '@/types/view';
import { jsonToRows, parseCsv, SAMPLE_ROWS, sampleCsv, sampleJson, tableToRows, TEMPLATE_COLUMNS, validateRows, type ParsedRow } from '../../logic/employeeImport';
import { ICONS } from './EmployeeRegistrationParts';

type Method = 'excel' | 'csv' | 'api';

const BTN = 'inline-flex items-center justify-center gap-2 min-h-[42px] px-4 rounded-lg border border-solid border-essi-green bg-white text-essi-green font-semibold text-[13px] cursor-pointer';
const BTN_SOLID = 'inline-flex items-center justify-center gap-2 min-h-[42px] px-5 rounded-lg border-0 bg-essi-dark text-white font-semibold text-[14px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
const MAX_BYTES = 5 * 1024 * 1024;

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
    <path d={d} />
  </svg>
);

export function BulkImportPanel({ method, v }: { method: Method; v: ViewProps['v'] }) {
  const [rows, setRows] = useState<ParsedRow[] | null>(null);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [json, setJson] = useState('');
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<{ created: number; failed: { name: string; message: string }[] } | null>(null);
  const picker = useRef<HTMLInputElement>(null);

  const reset = () => {
    setRows(null);
    setSource('');
    setError('');
    setResult(null);
  };
  const show = (raw: Record<string, unknown>[], from: string) => {
    if (!raw.length) return setError('No employee rows were found. Check that the first row has the column headings.');
    setError('');
    setResult(null);
    setSource(from);
    setRows(validateRows(raw, v.existingCnics as string[]));
  };

  const readFile = async (file: File | undefined) => {
    if (!file) return;
    reset();
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (method === 'excel' ? ext !== 'xlsx' : ext !== 'csv') return setError(method === 'excel' ? 'Choose an Excel file (.xlsx). Older .xls files must be saved as .xlsx first.' : 'Choose a .csv file.');
    if (file.size > MAX_BYTES) return setError('The file is larger than 5 MB.');
    try {
      if (method === 'csv') show(tableToRows(parseCsv(await file.text())), file.name);
      else {
        const { readSheet } = await import('read-excel-file/browser');
        show(tableToRows(await readSheet(file)), file.name);
      }
    } catch {
      setError('Could not read that file. Make sure it is a valid ' + (method === 'excel' ? 'Excel (.xlsx)' : 'CSV') + ' file.');
    }
  };

  const loadSample = () => {
    reset();
    if (method === 'api') {
      setJson(sampleJson());
      return;
    }
    show(tableToRows([TEMPLATE_COLUMNS, ...SAMPLE_ROWS]), 'sample data');
  };

  const validateJson = () => {
    reset();
    try {
      show(jsonToRows(json), 'pasted data');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read the pasted data.');
    }
  };

  const valid = (rows || []).filter((r) => r.input);
  const invalid = (rows || []).length - valid.length;

  const runImport = async () => {
    const res = await v.importEmployees(valid.map((r) => r.input!));
    setResult(res);
    if (!res.failed.length) setRows(null);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-4 rounded-[10px] border border-solid border-essi-line bg-[#eef9f1] py-4 px-5">
        <div className="flex items-start gap-4 flex-1 min-w-[260px]">
          <span className="text-essi-green mt-1">
            <Svg d={ICONS.upload} size={44} />
          </span>
          <div className="flex-1 min-w-0">
            {method === 'api' ? (
              <>
                <div className="font-bold text-[16px]">Paste API data</div>
                <div className="text-[13px] text-ink-soft mb-2">Paste the JSON your payroll or HR system sends: an array of employees, or an object with an "employees" array.</div>
                <textarea
                  aria-label="Employee data (JSON)"
                  value={json}
                  onChange={(e) => setJson(e.target.value)}
                  rows={8}
                  spellCheck={false}
                  placeholder={'{\n  "employees": [\n    { "cnic": "42101-5550001-1", "full_name": "…", … }\n  ]\n}'}
                  className="w-full box-border font-mono text-[12px] p-2.5 border border-solid border-essi-input rounded-md bg-white"
                />
                <div className="flex flex-wrap gap-2.5 mt-2.5">
                  <button type="button" className={BTN_SOLID} onClick={validateJson} disabled={!json.trim()}>
                    Validate &amp; preview
                  </button>
                  <button type="button" className={BTN} onClick={loadSample}>
                    Paste sample data
                  </button>
                  {json ? (
                    <button type="button" className={BTN} onClick={() => { setJson(''); reset(); }}>
                      Clear
                    </button>
                  ) : null}
                </div>
              </>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); void readFile(e.dataTransfer.files[0]); }}
                className={'rounded-lg border-2 border-dashed py-3 px-4 ' + (dragging ? 'border-essi-green bg-essi-tint' : 'border-transparent')}
              >
                <div className="font-bold text-[16px]">Upload {method === 'excel' ? 'Excel' : 'CSV'} File</div>
                <div className="text-[13px]">
                  Drag &amp; drop your file here or{' '}
                  <button type="button" onClick={() => picker.current?.click()} className="bg-transparent border-0 p-0 font-semibold text-essi-green underline cursor-pointer text-[13px]">
                    Browse File
                  </button>
                  <div className="text-[11px] text-ink-muted">Supported format: {method === 'excel' ? '.xlsx' : '.csv'} (Max size: 5MB)</div>
                </div>
                <input ref={picker} type="file" accept={method === 'excel' ? '.xlsx' : '.csv'} className="hidden" onChange={(e) => { void readFile(e.target.files?.[0]); e.target.value = ''; }} />
              </div>
            )}
          </div>
        </div>
        {method !== 'api' ? (
          <div className="flex flex-col gap-2.5">
            <button type="button" className={BTN} onClick={() => download('employee_template.csv', sampleCsv(), 'text/csv')}>
              <Svg d={ICONS.download} />
              Download Sample Template
            </button>
            <button type="button" className={BTN} onClick={loadSample}>
              <Svg d={ICONS.check} />
              Try with sample data
            </button>
            {method === 'excel' ? <span className="text-[11px] text-ink-muted max-w-[210px]">The template opens in Excel. Save it as .xlsx before uploading.</span> : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <div role="alert" className="mt-3 text-danger text-[14px] bg-danger-bg border border-solid border-[#f3b9b3] rounded-lg py-2.5 px-3.5">
          {error}
        </div>
      ) : null}

      {rows ? (
        <div className="mt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="text-[14px]">
              <b>Preview of {source}:</b> {rows.length} row(s) · <span className="text-essi-green font-semibold">{valid.length} ready</span>
              {invalid ? <span className="text-danger font-semibold"> · {invalid} with errors (skipped)</span> : null}
            </div>
            <div className="flex gap-2.5">
              <button type="button" className={BTN} onClick={reset}>
                Cancel
              </button>
              <button type="button" className={BTN_SOLID} disabled={!valid.length || !!v.busy} onClick={() => void runImport()}>
                {v.busy ? 'Importing…' : 'Import ' + valid.length + ' employee' + (valid.length === 1 ? '' : 's')}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-solid border-essi-line bg-white">
            <table className="w-full border-collapse text-[13px] min-w-[560px]">
              <thead>
                <tr className="bg-essi-mint text-left">
                  {['Row', 'Name', 'CNIC', 'Designation', 'Check'].map((h) => (
                    <th key={h} className="py-2 px-3 font-semibold border-b border-solid border-essi-line">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 100).map((r) => (
                  <tr key={r.line} className={r.errors.length ? 'bg-danger-bg' : ''}>
                    <td className="py-2 px-3 border-b border-solid border-essi-line">{r.line}</td>
                    <td className="py-2 px-3 border-b border-solid border-essi-line">{r.name || '—'}</td>
                    <td className="py-2 px-3 border-b border-solid border-essi-line whitespace-nowrap">{r.cnic || '—'}</td>
                    <td className="py-2 px-3 border-b border-solid border-essi-line">{r.designation || '—'}</td>
                    <td className="py-2 px-3 border-b border-solid border-essi-line">{r.errors.length ? <span className="text-danger">{r.errors.join('; ')}</span> : <span className="text-essi-green font-semibold">✓ Ready</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 100 ? <p className="text-[12px] text-ink-muted mt-1.5">Showing the first 100 rows; all rows are imported.</p> : null}
        </div>
      ) : null}

      {result ? (
        <div role="status" className={'mt-3.5 rounded-lg border border-solid py-3 px-4 text-[14px] ' + (result.failed.length ? 'border-[#f3b9b3] bg-danger-bg' : 'border-essi-line bg-[#eef9f1] text-essi-dark')}>
          <b>{result.created} employee(s) imported.</b>
          {result.failed.length ? (
            <ul className="m-0 mt-1.5 pl-5 text-danger">
              {result.failed.map((f, i) => (
                <li key={i}>
                  {f.name}: {f.message}
                </li>
              ))}
            </ul>
          ) : null}
          {result.created ? (
            <div className="mt-2">
              <button type="button" className={BTN} onClick={v.openEmployeeList}>
                View employee list
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
