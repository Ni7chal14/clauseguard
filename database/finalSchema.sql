-- ============================================================
-- CLAUSEGUARD
-- PostgreSQL Database Schema
-- ============================================================
--
-- PostgreSQL = Source of truth for application/business data
-- Qdrant    = Policy embeddings and vector search
--
-- This schema contains:
--   Company / HR Workspace
--   Personal Workspace
--   Employee career data
--   AI review data
--   Human approval data
--   Audit data
--
-- Vector embeddings are NOT stored in PostgreSQL.
-- Qdrant is handled separately by the AI/RAG team.
-- ============================================================


-- ============================================================
-- 1. ORGANIZATIONS
-- ============================================================
-- Companies using ClauseGuard.
-- ============================================================

CREATE TABLE organizations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. USERS
-- ============================================================
-- Stores both HR and employees.
--
-- organization_id represents the user's CURRENT organization.
-- It is nullable because an employee may leave an organization
-- while retaining their Personal Workspace.
--
-- manager_id allows manager relationships between users.
-- ============================================================

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organization_id BIGINT,

    manager_id BIGINT,

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_users_manager
        FOREIGN KEY (manager_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT uq_users_org_email
        UNIQUE (organization_id, email),

    CONSTRAINT chk_users_role
        CHECK (role IN ('HR', 'EMPLOYEE'))
);


-- ============================================================
-- 3. POLICIES
-- ============================================================
-- Stores metadata about company policy documents.
--
-- Actual policy embeddings/chunks are handled by Qdrant.
-- ============================================================

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


-- ============================================================
-- 4. TASKS
-- ============================================================
-- Employee tasks.
--
-- Dashboard statistics can be calculated from this table.
-- ============================================================

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


-- ============================================================
-- 5. SUBMISSIONS
-- ============================================================
-- Employee document submissions.
--
-- Examples:
--   Leave requests
--   Expense claims
--   Other compliance submissions
--
-- submission_data uses JSONB because different submission
-- types can contain different fields.
-- ============================================================

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


-- ============================================================
-- 6. REVIEWS
-- ============================================================
-- Stores every AI review performed on a submission.
--
-- review_number preserves re-review history.
--
-- Example:
--   Review 1 → NEEDS_REVIEW
--   Review 2 → APPROVED
-- ============================================================

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
            severity IS NULL
            OR severity IN ('LOW', 'MEDIUM', 'HIGH')
        ),

    CONSTRAINT uq_submission_review_number
        UNIQUE (submission_id, review_number)
);


-- ============================================================
-- 7. REVIEW CITATIONS
-- ============================================================
-- Stores policy evidence used by an AI review.
--
-- The actual vector search happens in Qdrant.
-- PostgreSQL stores the resulting citation/evidence so that
-- reviews remain traceable and auditable.
-- ============================================================

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


-- ============================================================
-- 8. APPROVALS
-- ============================================================
-- Human approval is separate from AI review.
--
-- Example:
--   AI Review → NEEDS_REVIEW
--             ↓
--   Manager Approval → APPROVED
--
-- Approval types:
--   MANAGER
--   HR
-- ============================================================

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


-- ============================================================
-- 9. AUDIT LOGS
-- ============================================================
-- Records important actions performed in the system.
--
-- Examples:
--   Policy uploaded
--   Submission created
--   AI review completed
--   Submission resubmitted
--   Approval requested
--   Manager approved
--   HR reviewed submission
-- ============================================================

CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organization_id BIGINT,

    user_id BIGINT,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(100) NOT NULL,

    entity_id BIGINT,

    details JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- PERSONAL WORKSPACE
-- ============================================================


-- ============================================================
-- 10. EMPLOYMENT RECORDS
-- ============================================================
-- Stores an employee's employment history.
--
-- Example:
--
--   Company A → 2024-2026 → ENDED
--   Company B → 2026-Present → CURRENT
--
-- This allows Personal Workspace data to remain with the
-- employee after leaving an organization.
-- ============================================================

CREATE TABLE employment_records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    organization_id BIGINT NOT NULL,

    job_title VARCHAR(255) NOT NULL,

    joined_at DATE NOT NULL,

    left_at DATE,

    status VARCHAR(20) NOT NULL DEFAULT 'CURRENT',

    is_shareable BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employment_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_employment_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_employment_status
        CHECK (
            status IN ('CURRENT', 'ENDED')
        ),

    CONSTRAINT chk_employment_dates
        CHECK (
            left_at IS NULL
            OR left_at >= joined_at
        )
);


-- A user can have many previous jobs,
-- but only one current employment.
CREATE UNIQUE INDEX uq_current_employment
ON employment_records(user_id)
WHERE status = 'CURRENT';


-- ============================================================
-- 11. PERSONAL PROFILES
-- ============================================================
-- Employee-owned personal profile.
--
-- This is separate from company-specific employee information.
-- ============================================================

CREATE TABLE personal_profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    headline VARCHAR(255),

    bio TEXT,

    profile_photo_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_personal_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 12. SKILLS
-- ============================================================
-- Master list of skills.
--
-- Examples:
--   Python
--   SQL
--   Machine Learning
--   FastAPI
-- ============================================================

CREATE TABLE skills (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 13. USER SKILLS
-- ============================================================
-- Connects a user to a skill.
--
-- A skill can be:
--   Self-added
--   Verified by an organization
--
-- is_shareable controls whether the skill can appear
-- in the user's shareable professional profile.
-- ============================================================

CREATE TABLE user_skills (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    skill_id BIGINT NOT NULL,

    organization_id BIGINT,

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    verified_by BIGINT,

    verified_at TIMESTAMPTZ,

    is_shareable BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_skill_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_skill_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_skill_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_user_skill_verified_by
        FOREIGN KEY (verified_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT uq_user_skill
        UNIQUE (user_id, skill_id)
);


-- ============================================================
-- 14. ACHIEVEMENTS
-- ============================================================
-- Career achievements.
--
-- Examples:
--   Major project contribution
--   Award
--   Certification
--   Employee recognition
-- ============================================================

CREATE TABLE achievements (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    achievement_type VARCHAR(100),

    organization_id BIGINT,

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    verified_by BIGINT,

    verified_at TIMESTAMPTZ,

    is_shareable BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_achievement_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_achievement_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_achievement_verified_by
        FOREIGN KEY (verified_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 15. PROMOTIONS
-- ============================================================
-- Stores career progression within an organization.
--
-- Example:
--
--   Junior Developer → Developer
--   Developer → Senior Developer
-- ============================================================

CREATE TABLE promotions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    organization_id BIGINT NOT NULL,

    from_title VARCHAR(255),

    to_title VARCHAR(255) NOT NULL,

    promotion_date DATE NOT NULL,

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    verified_by BIGINT,

    verified_at TIMESTAMPTZ,

    is_shareable BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_promotion_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_promotion_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_promotion_verified_by
        FOREIGN KEY (verified_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 16. PROFILE SHARES
-- ============================================================
-- Stores shareable professional profile links.
--
-- The profile itself is generated from the user's
-- explicitly shareable records.
-- ============================================================

CREATE TABLE profile_shares (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    share_token VARCHAR(255) NOT NULL UNIQUE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_profile_share_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================
-- These help common application queries.
-- ============================================================


CREATE INDEX idx_users_organization
ON users(organization_id);


CREATE INDEX idx_users_manager
ON users(manager_id);


CREATE INDEX idx_policies_organization
ON policies(organization_id);


CREATE INDEX idx_tasks_employee
ON tasks(employee_id);


CREATE INDEX idx_tasks_status
ON tasks(status);


CREATE INDEX idx_submissions_employee
ON submissions(employee_id);


CREATE INDEX idx_submissions_status
ON submissions(status);


CREATE INDEX idx_reviews_submission
ON reviews(submission_id);


CREATE INDEX idx_reviews_status
ON reviews(status);


CREATE INDEX idx_approvals_submission
ON approvals(submission_id);


CREATE INDEX idx_approvals_approver
ON approvals(approver_id);


CREATE INDEX idx_audit_logs_organization
ON audit_logs(organization_id);


CREATE INDEX idx_audit_logs_user
ON audit_logs(user_id);


CREATE INDEX idx_audit_logs_entity
ON audit_logs(entity_type, entity_id);


CREATE INDEX idx_employment_user
ON employment_records(user_id);


CREATE INDEX idx_employment_organization
ON employment_records(organization_id);


CREATE INDEX idx_user_skills_user
ON user_skills(user_id);


CREATE INDEX idx_user_skills_organization
ON user_skills(organization_id);


CREATE INDEX idx_achievements_user
ON achievements(user_id);


CREATE INDEX idx_achievements_organization
ON achievements(organization_id);


CREATE INDEX idx_promotions_user
ON promotions(user_id);


CREATE INDEX idx_promotions_organization
ON promotions(organization_id);


CREATE INDEX idx_profile_shares_user
ON profile_shares(user_id);


-- ============================================================
-- END OF CLAUSEGUARD SCHEMA
-- ============================================================