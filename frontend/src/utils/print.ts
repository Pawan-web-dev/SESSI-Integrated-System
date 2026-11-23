/**
 * Print the document shown on screen (receipt, F-4 return, F-5 voucher).
 *
 * The element with class "print-area" is copied into a separate top-level container and only that
 * container is printed (see styles/print.css), so the dashboard header, menu and buttons are left out
 * and no blank pages are added. Elements with class "no-print" inside the document are skipped.
 */
export function printDocument(): void {
  const source = document.querySelector('.print-area');
  if (!source) {
    window.print();
    return;
  }

  const root = document.createElement('div');
  root.id = 'print-root';
  // keep the dashboard style scope so the copied document looks the same as on screen
  const scope = document.createElement('div');
  scope.className = 'workspace';
  scope.appendChild(source.cloneNode(true));
  root.appendChild(scope);
  document.body.appendChild(root);
  document.body.classList.add('printing');

  const cleanup = () => {
    document.body.classList.remove('printing');
    root.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
  // some browsers do not fire "afterprint" when print() returns synchronously
  setTimeout(() => {
    if (root.isConnected) cleanup();
  }, 1000);
}
