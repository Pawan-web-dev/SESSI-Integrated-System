interface AlertProps {
  /** "error" = red box, "success" = green box */
  kind: 'error' | 'success';
  /** message; the box is hidden when empty */
  message: string;
  id?: string;
}

/** Inline error / success message box. */
export function Alert({ kind, message, id }: AlertProps) {
  const cls = kind === 'error' ? 'err' : 'ok';
  return (
    <div id={id} className={cls + (message ? ' on' : '')} role={kind === 'error' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}
