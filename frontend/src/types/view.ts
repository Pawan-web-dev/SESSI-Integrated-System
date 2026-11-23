/**
 * Types shared by the registration wizard and the employer dashboard.
 *
 * Both screens follow the same pattern (taken from the design prototype):
 *  - a logic class builds a flat "view model" object in renderVals()
 *  - presentational components read values / handlers from that object (`v`)
 *  - account details and navigation come in through the environment (`P`)
 */

/** Loosely typed value from the view model (mirrors the design's bindings). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

/** The view model produced by renderVals(). */
export type ViewModel = Any;

/** Per-account values and callbacks available to every view component. */
export interface ViewEnv {
  /** company name of the signed-in employer */
  coName: string;
  /** Employer Identification Number, e.g. 101-10-000001 */
  empNo: string;
  /** contact person name */
  person: string;
  /** ESSI directorate */
  dir: string;
  /** true for a newly approved employer with no data yet */
  empty: boolean;
  /** navigate to another portal page, e.g. nav('login') */
  nav: (to: string) => void;
}

/** Props received by every dashboard section / registration step component. */
export interface ViewProps {
  v: ViewModel;
  P: ViewEnv;
}
