-- SESSI Employer Portal – PostgreSQL schema (generated from backend/alembic, revision 0003).
-- Do not edit by hand: change the models in backend/app/models, add an Alembic migration, then regenerate:
--   cd backend; $env:DATABASE_URL="postgresql+psycopg://user:pass@host/db"; alembic upgrade head --sql > ../database/schema.sql

BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 0001

CREATE TABLE admin_users (
    id SERIAL NOT NULL, 
    username VARCHAR(60) NOT NULL, 
    full_name VARCHAR(120) NOT NULL, 
    password_hash VARCHAR(100) NOT NULL, 
    role VARCHAR(20) NOT NULL, 
    active BOOLEAN NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_admin_users PRIMARY KEY (id), 
    CONSTRAINT uq_admin_users_username UNIQUE (username)
);

CREATE TABLE audit_log (
    id SERIAL NOT NULL, 
    actor VARCHAR(120) NOT NULL, 
    action VARCHAR(60) NOT NULL, 
    entity VARCHAR(40) NOT NULL, 
    entity_id VARCHAR(40) NOT NULL, 
    details JSON, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_audit_log PRIMARY KEY (id)
);

CREATE INDEX ix_audit_log_action ON audit_log (action);

CREATE INDEX ix_audit_log_entity_id ON audit_log (entity_id);

CREATE TABLE directorates (
    code VARCHAR(3) NOT NULL, 
    name VARCHAR(120) NOT NULL, 
    active BOOLEAN NOT NULL, 
    CONSTRAINT pk_directorates PRIMARY KEY (code), 
    CONSTRAINT uq_directorates_name UNIQUE (name)
);

CREATE TABLE industry_classifications (
    code VARCHAR(2) NOT NULL, 
    name VARCHAR(120) NOT NULL, 
    approval_required BOOLEAN NOT NULL, 
    active BOOLEAN NOT NULL, 
    CONSTRAINT pk_industry_classifications PRIMARY KEY (code), 
    CONSTRAINT uq_industry_classifications_name UNIQUE (name)
);

CREATE TABLE one_time_codes (
    id SERIAL NOT NULL, 
    purpose VARCHAR(20) NOT NULL, 
    target VARCHAR(160) NOT NULL, 
    code_hash VARCHAR(100) NOT NULL, 
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    used_at TIMESTAMP WITH TIME ZONE, 
    note TEXT, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_one_time_codes PRIMARY KEY (id)
);

CREATE INDEX ix_one_time_codes_purpose ON one_time_codes (purpose);

CREATE INDEX ix_one_time_codes_target ON one_time_codes (target);

CREATE TABLE directorate_districts (
    district VARCHAR(80) NOT NULL, 
    directorate_code VARCHAR(3) NOT NULL, 
    CONSTRAINT pk_directorate_districts PRIMARY KEY (district), 
    CONSTRAINT fk_directorate_districts_directorate_code_directorates FOREIGN KEY(directorate_code) REFERENCES directorates (code)
);

CREATE INDEX ix_directorate_districts_directorate_code ON directorate_districts (directorate_code);

CREATE TABLE ein_sequences (
    id SERIAL NOT NULL, 
    directorate_code VARCHAR(3) NOT NULL, 
    industry_code VARCHAR(2) NOT NULL, 
    last_serial INTEGER NOT NULL, 
    CONSTRAINT pk_ein_sequences PRIMARY KEY (id), 
    CONSTRAINT fk_ein_sequences_directorate_code_directorates FOREIGN KEY(directorate_code) REFERENCES directorates (code), 
    CONSTRAINT fk_ein_sequences_industry_code_industry_classifications FOREIGN KEY(industry_code) REFERENCES industry_classifications (code), 
    CONSTRAINT uq_ein_sequences_directorate_code UNIQUE (directorate_code, industry_code)
);

CREATE TABLE employers (
    id SERIAL NOT NULL, 
    ein VARCHAR(16), 
    status VARCHAR(12) NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    business_type VARCHAR(60) NOT NULL, 
    industry_code VARCHAR(2) NOT NULL, 
    directorate_code VARCHAR(3) NOT NULL, 
    secp_no VARCHAR(40) NOT NULL, 
    ntn VARCHAR(20) NOT NULL, 
    srb_no VARCHAR(40) NOT NULL, 
    address VARCHAR(300) NOT NULL, 
    district VARCHAR(80) NOT NULL, 
    province VARCHAR(40) NOT NULL, 
    gps VARCHAR(80), 
    contact_person VARCHAR(120) NOT NULL, 
    designation VARCHAR(80), 
    contact_mobile VARCHAR(20) NOT NULL, 
    contact_email VARCHAR(160) NOT NULL, 
    office_phone VARCHAR(20), 
    expected_workers INTEGER, 
    operations_started DATE, 
    approved_at TIMESTAMP WITH TIME ZONE, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_employers PRIMARY KEY (id), 
    CONSTRAINT fk_employers_directorate_code_directorates FOREIGN KEY(directorate_code) REFERENCES directorates (code), 
    CONSTRAINT fk_employers_industry_code_industry_classifications FOREIGN KEY(industry_code) REFERENCES industry_classifications (code)
);

CREATE INDEX ix_employers_directorate_code ON employers (directorate_code);

CREATE UNIQUE INDEX ix_employers_ein ON employers (ein);

CREATE INDEX ix_employers_industry_code ON employers (industry_code);

CREATE INDEX ix_employers_status ON employers (status);

CREATE TABLE change_requests (
    id SERIAL NOT NULL, 
    ref VARCHAR(20) NOT NULL, 
    employer_id INTEGER NOT NULL, 
    field VARCHAR(30) NOT NULL, 
    old_value VARCHAR(300), 
    new_value VARCHAR(300) NOT NULL, 
    reason TEXT NOT NULL, 
    document VARCHAR(200), 
    status VARCHAR(20) NOT NULL, 
    remarks TEXT, 
    submitted_by VARCHAR(120) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_change_requests PRIMARY KEY (id), 
    CONSTRAINT fk_change_requests_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id), 
    CONSTRAINT uq_change_requests_ref UNIQUE (ref)
);

CREATE INDEX ix_change_requests_employer_id ON change_requests (employer_id);

CREATE INDEX ix_change_requests_status ON change_requests (status);

CREATE TABLE contributions (
    id SERIAL NOT NULL, 
    ref VARCHAR(20) NOT NULL, 
    employer_id INTEGER NOT NULL, 
    month DATE NOT NULL, 
    workers INTEGER NOT NULL, 
    total_wages INTEGER NOT NULL, 
    amount INTEGER NOT NULL, 
    status VARCHAR(12) NOT NULL, 
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_contributions PRIMARY KEY (id), 
    CONSTRAINT fk_contributions_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id), 
    CONSTRAINT uq_contributions_employer_id UNIQUE (employer_id, month), 
    CONSTRAINT uq_contributions_ref UNIQUE (ref)
);

CREATE INDEX ix_contributions_employer_id ON contributions (employer_id);

CREATE TABLE ein_registry (
    ein VARCHAR(16) NOT NULL, 
    employer_id INTEGER NOT NULL, 
    issued_by VARCHAR(80), 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_ein_registry PRIMARY KEY (ein), 
    CONSTRAINT fk_ein_registry_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id), 
    CONSTRAINT uq_ein_registry_employer_id UNIQUE (employer_id)
);

CREATE TABLE employees (
    id SERIAL NOT NULL, 
    employer_id INTEGER NOT NULL, 
    full_name VARCHAR(120) NOT NULL, 
    father_name VARCHAR(120) NOT NULL, 
    gender VARCHAR(12) NOT NULL, 
    cnic VARCHAR(15) NOT NULL, 
    date_of_birth DATE, 
    mobile VARCHAR(20) NOT NULL, 
    designation VARCHAR(80) NOT NULL, 
    skill_level VARCHAR(30), 
    employment_type VARCHAR(20) NOT NULL, 
    wage_type VARCHAR(20), 
    payment_frequency VARCHAR(20), 
    date_joined DATE, 
    monthly_wage INTEGER, 
    bank_account VARCHAR(40), 
    status VARCHAR(12) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_employees PRIMARY KEY (id), 
    CONSTRAINT fk_employees_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id), 
    CONSTRAINT uq_employees_employer_id UNIQUE (employer_id, cnic)
);

CREATE INDEX ix_employees_cnic ON employees (cnic);

CREATE INDEX ix_employees_employer_id ON employees (employer_id);

CREATE INDEX ix_employees_status ON employees (status);

CREATE TABLE employer_users (
    id SERIAL NOT NULL, 
    employer_id INTEGER NOT NULL, 
    full_name VARCHAR(120) NOT NULL, 
    cnic VARCHAR(15) NOT NULL, 
    mobile VARCHAR(20) NOT NULL, 
    email VARCHAR(160) NOT NULL, 
    password_hash VARCHAR(100) NOT NULL, 
    failed_logins INTEGER NOT NULL, 
    locked_until TIMESTAMP WITH TIME ZONE, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_employer_users PRIMARY KEY (id), 
    CONSTRAINT fk_employer_users_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id), 
    CONSTRAINT uq_employer_users_cnic UNIQUE (cnic), 
    CONSTRAINT uq_employer_users_email UNIQUE (email)
);

CREATE INDEX ix_employer_users_employer_id ON employer_users (employer_id);

CREATE INDEX ix_employer_users_mobile ON employer_users (mobile);

CREATE TABLE outbox_messages (
    id SERIAL NOT NULL, 
    employer_id INTEGER, 
    mobile VARCHAR(20), 
    email VARCHAR(160), 
    subject VARCHAR(200) NOT NULL, 
    body TEXT NOT NULL, 
    sent BOOLEAN NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_outbox_messages PRIMARY KEY (id), 
    CONSTRAINT fk_outbox_messages_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id)
);

CREATE INDEX ix_outbox_messages_email ON outbox_messages (email);

CREATE INDEX ix_outbox_messages_employer_id ON outbox_messages (employer_id);

CREATE INDEX ix_outbox_messages_mobile ON outbox_messages (mobile);

CREATE TABLE registration_applications (
    id SERIAL NOT NULL, 
    app_no VARCHAR(20) NOT NULL, 
    employer_id INTEGER NOT NULL, 
    status VARCHAR(12) NOT NULL, 
    stage INTEGER NOT NULL, 
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    decided_at TIMESTAMP WITH TIME ZONE, 
    decided_by VARCHAR(80), 
    rejection_reason TEXT, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_registration_applications PRIMARY KEY (id), 
    CONSTRAINT fk_registration_applications_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id)
);

CREATE UNIQUE INDEX ix_registration_applications_app_no ON registration_applications (app_no);

CREATE INDEX ix_registration_applications_employer_id ON registration_applications (employer_id);

CREATE INDEX ix_registration_applications_status ON registration_applications (status);

CREATE TABLE application_documents (
    id SERIAL NOT NULL, 
    application_id INTEGER NOT NULL, 
    doc_type VARCHAR(20) NOT NULL, 
    file_name VARCHAR(200) NOT NULL, 
    required BOOLEAN NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_application_documents PRIMARY KEY (id), 
    CONSTRAINT fk_application_documents_application_id_registration_ap_f103 FOREIGN KEY(application_id) REFERENCES registration_applications (id)
);

CREATE INDEX ix_application_documents_application_id ON application_documents (application_id);

CREATE TABLE application_events (
    id SERIAL NOT NULL, 
    application_id INTEGER NOT NULL, 
    code VARCHAR(12) NOT NULL, 
    note TEXT, 
    actor VARCHAR(80), 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_application_events PRIMARY KEY (id), 
    CONSTRAINT fk_application_events_application_id_registration_applications FOREIGN KEY(application_id) REFERENCES registration_applications (id)
);

CREATE INDEX ix_application_events_application_id ON application_events (application_id);

CREATE TABLE challans (
    id SERIAL NOT NULL, 
    challan_no VARCHAR(20) NOT NULL, 
    employer_id INTEGER NOT NULL, 
    contribution_id INTEGER NOT NULL, 
    amount INTEGER NOT NULL, 
    service_charges INTEGER NOT NULL, 
    due_date DATE NOT NULL, 
    status VARCHAR(10) NOT NULL, 
    paid_at TIMESTAMP WITH TIME ZONE, 
    days_late INTEGER, 
    late_increase INTEGER, 
    total_paid INTEGER, 
    receipt_no VARCHAR(20), 
    payment_channel VARCHAR(20), 
    transaction_ref VARCHAR(40), 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_challans PRIMARY KEY (id), 
    CONSTRAINT fk_challans_contribution_id_contributions FOREIGN KEY(contribution_id) REFERENCES contributions (id), 
    CONSTRAINT fk_challans_employer_id_employers FOREIGN KEY(employer_id) REFERENCES employers (id), 
    CONSTRAINT uq_challans_contribution_id UNIQUE (contribution_id), 
    CONSTRAINT uq_challans_receipt_no UNIQUE (receipt_no)
);

CREATE UNIQUE INDEX ix_challans_challan_no ON challans (challan_no);

CREATE INDEX ix_challans_employer_id ON challans (employer_id);

CREATE INDEX ix_challans_status ON challans (status);

CREATE TABLE change_request_events (
    id SERIAL NOT NULL, 
    request_id INTEGER NOT NULL, 
    text TEXT NOT NULL, 
    actor VARCHAR(20) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_change_request_events PRIMARY KEY (id), 
    CONSTRAINT fk_change_request_events_request_id_change_requests FOREIGN KEY(request_id) REFERENCES change_requests (id)
);

CREATE INDEX ix_change_request_events_request_id ON change_request_events (request_id);

CREATE TABLE contribution_lines (
    id SERIAL NOT NULL, 
    contribution_id INTEGER NOT NULL, 
    employee_id INTEGER, 
    worker_name VARCHAR(120) NOT NULL, 
    cnic VARCHAR(15) NOT NULL, 
    mobile VARCHAR(20), 
    employment_type VARCHAR(20) NOT NULL, 
    wage INTEGER NOT NULL, 
    days INTEGER NOT NULL, 
    amount INTEGER NOT NULL, 
    CONSTRAINT pk_contribution_lines PRIMARY KEY (id), 
    CONSTRAINT fk_contribution_lines_contribution_id_contributions FOREIGN KEY(contribution_id) REFERENCES contributions (id), 
    CONSTRAINT fk_contribution_lines_employee_id_employees FOREIGN KEY(employee_id) REFERENCES employees (id)
);

CREATE INDEX ix_contribution_lines_contribution_id ON contribution_lines (contribution_id);

INSERT INTO alembic_version (version_num) VALUES ('0001') RETURNING alembic_version.version_num;

-- Running upgrade 0001 -> 0002

ALTER TABLE employees ADD COLUMN photo TEXT;

UPDATE alembic_version SET version_num='0002' WHERE alembic_version.version_num = '0001';

-- Running upgrade 0002 -> 0003

CREATE TABLE stored_files (
    id VARCHAR(36) NOT NULL, 
    original_name VARCHAR(200) NOT NULL, 
    content_type VARCHAR(60) NOT NULL, 
    size INTEGER NOT NULL, 
    storage_path VARCHAR(300) NOT NULL, 
    uploaded_by VARCHAR(40) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    CONSTRAINT pk_stored_files PRIMARY KEY (id)
);

CREATE INDEX ix_stored_files_uploaded_by ON stored_files (uploaded_by);

ALTER TABLE application_documents ADD COLUMN file_id VARCHAR(36);

ALTER TABLE application_documents ADD CONSTRAINT fk_application_documents_file_id_stored_files FOREIGN KEY(file_id) REFERENCES stored_files (id);

ALTER TABLE outbox_messages ADD COLUMN sms_status VARCHAR(12);

ALTER TABLE outbox_messages ADD COLUMN email_status VARCHAR(12);

ALTER TABLE outbox_messages ADD COLUMN attempts INTEGER DEFAULT '0' NOT NULL;

ALTER TABLE outbox_messages ADD COLUMN last_error VARCHAR(300);

ALTER TABLE outbox_messages ADD COLUMN sent_at TIMESTAMP WITH TIME ZONE;

UPDATE alembic_version SET version_num='0003' WHERE alembic_version.version_num = '0002';

COMMIT;

