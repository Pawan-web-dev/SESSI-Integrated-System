import { useEffect, useId } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { taskFinished, taskStarted } from './loaderSlice';

/**
 * Show the global loader while `active` is true. Use it for work that is not an API call:
 *
 *   useGlobalLoader(isReadingFile, 'Reading the file…');
 *
 * API calls do not need this, the loader follows them automatically.
 */
export function useGlobalLoader(active: boolean, label = 'Please wait…'): void {
  const id = useId();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!active) return;
    dispatch(taskStarted({ id, label }));
    return () => {
      dispatch(taskFinished(id));
    };
  }, [active, label, id, dispatch]);
}
