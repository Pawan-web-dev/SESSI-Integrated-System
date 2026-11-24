# Entity Relationship Diagram

GitHub and VS Code (with a Mermaid extension) render this diagram.

```mermaid
erDiagram
    directorates ||--o{ directorate_districts : serves
    directorates ||--o{ employers : "registered in"
    industry_classifications ||--o{ employers : "classified as"
    directorates ||--o{ ein_sequences : ""
    industry_classifications ||--o{ ein_sequences : ""

    employers ||--o{ employer_users : "signs in as"
    employers ||--o| ein_registry : "has EIN"
    employers ||--o{ registration_applications : applies
    registration_applications ||--o{ application_events : "activity log"
    registration_applications ||--o{ application_documents : documents

    employers ||--o{ employees : employs
    employers ||--o{ contributions : files
    contributions ||--o{ contribution_lines : "C-1 schedule"
    employees ||--o{ contribution_lines : "included in"
    contributions ||--|| challans : "paid with"

    employers ||--o{ change_requests : requests
    change_requests ||--o{ change_request_events : history
    employers ||--o{ outbox_messages : notified

    employers {
        int id PK
        string ein UK "DDD-II-NNNNNN"
        string status
        string industry_code FK
        string directorate_code FK
    }
    ein_registry {
        string ein PK
        int employer_id FK
    }
    contributions {
        int id PK
        date month
        int workers
        int amount
    }
    challans {
        int id PK
        string challan_no UK
        date due_date
        string status
        string receipt_no UK
    }
```

Not linked by foreign key: `admin_users`, `audit_log` (refers to any entity by name + id), `one_time_codes`.
