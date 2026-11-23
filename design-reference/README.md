# Design reference

`employer-portal-design.html` is the approved, self-contained design prototype of the Employer Portal.
Open it in a browser to see the original screens. The React app in `frontend/` reproduces it
pixel-for-pixel; when in doubt about a screen's look, this file is the reference.

| Design URL    | Screen                                   | React code                        |
| ------------- | ---------------------------------------- | --------------------------------- |
| `#/login`     | Employer login                           | `frontend/src/features/auth`      |
| `#/register`  | Registration wizard                      | `frontend/src/features/registration` |
| `#/welcome`   | Application submitted / tracking         | `frontend/src/features/registration` |
| `#/inbox`     | Demo SMS / email inbox                   | `frontend/src/features/inbox`     |
| `#/admin`     | ESSI admin panel                         | `frontend/src/features/admin`     |
| `#/dashboard` | Employer dashboard                       | `frontend/src/features/dashboard` |

Features added after the design (not in this file): payment receipt, F-4 return, F-4 declaration,
C-1 schedule, printing, Industry Classification and the Employer Identification Number (EIN).
