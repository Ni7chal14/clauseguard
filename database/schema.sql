CREATE TABLE organizations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organization_id BIGINT NOT NULL,

    manager_id BIGINT,

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_users_manager
        FOREIGN KEY (manager_id)
        REFERENCES users(id),

    CONSTRAINT uq_users_org_email
        UNIQUE (organization_id, email),

    CONSTRAINT chk_users_role
        CHECK (role IN ('HR', 'EMPLOYEE'))
);


CREATE TABLE policies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organization_id BIGINT NOT NULL,

    name VARCHAR(255) NOT NULL,

    document_type VARCHAR(100) NOT NULL,

    version VARCHAR(50) NOT NULL,

    file_url TEXT NOT NULL,

    uploaded_by BIGINT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_policies_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_policies_uploader
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id),

    CONSTRAINT uq_policy_version
        UNIQUE (organization_id, name, version)
);


CREATE TABLE tasks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organization_id BIGINT NOT NULL,

    employee_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    due_date DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_employee
        FOREIGN KEY (employee_id)
        REFERENCES users(id),

    CONSTRAINT chk_task_status
        CHECK (
            status IN (
                'PENDING',
                'IN_PROGRESS',
                'COMPLETED'
            )
        )
);


CREATE TABLE submissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organization_id BIGINT NOT NULL,

    employee_id BIGINT NOT NULL,

    document_type VARCHAR(100) NOT NULL,

    file_url TEXT NOT NULL,

    submission_data JSONB,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_submissions_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_submissions_employee
        FOREIGN KEY (employee_id)
        REFERENCES users(id),

    CONSTRAINT chk_submission_status
        CHECK (
            status IN (
                'PENDING',
                'IN_REVIEW',
                'APPROVED',
                'FLAGGED',
                'NEEDS_REVIEW'
            )
        )
);


CREATE TABLE reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    submission_id BIGINT NOT NULL,

    review_number INTEGER NOT NULL,

    status VARCHAR(30) NOT NULL,

    explanation TEXT,

    severity VARCHAR(30),

    recommended_action TEXT,

    ai_output JSONB,

    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_submission
        FOREIGN KEY (submission_id)
        REFERENCES submissions(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_review_status
        CHECK (
            status IN (
                'APPROVED',
                'FLAGGED',
                'NEEDS_REVIEW'
            )
        ),

    CONSTRAINT chk_review_severity
        CHECK (
            severity IS NULL OR
            severity IN ('LOW', 'MEDIUM', 'HIGH')
        ),

    CONSTRAINT uq_submission_review_number
        UNIQUE (submission_id, review_number)
);


CREATE TABLE review_citations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    review_id BIGINT NOT NULL,

    policy_id BIGINT NOT NULL,

    policy_version VARCHAR(50) NOT NULL,

    section VARCHAR(255),

    citation_text TEXT NOT NULL,

    CONSTRAINT fk_citations_review
        FOREIGN KEY (review_id)
        REFERENCES reviews(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_citations_policy
        FOREIGN KEY (policy_id)
        REFERENCES policies(id)
);


CREATE TABLE approvals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    submission_id BIGINT NOT NULL,

    approver_id BIGINT NOT NULL,

    approval_type VARCHAR(30) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    comments TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    acted_at TIMESTAMPTZ,

    CONSTRAINT fk_approvals_submission
        FOREIGN KEY (submission_id)
        REFERENCES submissions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_approvals_approver
        FOREIGN KEY (approver_id)
        REFERENCES users(id),

    CONSTRAINT chk_approval_type
        CHECK (
            approval_type IN ('MANAGER', 'HR')
        ),

    CONSTRAINT chk_approval_status
        CHECK (
            status IN ('PENDING', 'APPROVED', 'REJECTED')
        )
);


CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organization_id BIGINT NOT NULL,

    user_id BIGINT,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(100) NOT NULL,

    entity_id BIGINT,

    details JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

INSERT INTO organizations(name)
VALUES('Clauseguard Demo Company');

SELECT * FROM organizations;
