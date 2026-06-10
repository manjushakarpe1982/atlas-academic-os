-- ATLAS Authentication Database Schema
-- PostgreSQL / Supabase

-- ============================================================================
-- Create users table
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  is_suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  last_login_at TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- ============================================================================
-- Create email_verifications table
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for email_verifications table
CREATE INDEX IF NOT EXISTS idx_email_verifications_code ON email_verifications(code);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verifications(expires_at);

-- ============================================================================
-- Create login_attempts table (for rate limiting)
-- ============================================================================

CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  success BOOLEAN DEFAULT FALSE,
  attempted_at TIMESTAMP DEFAULT now()
);

-- Create indexes for login_attempts table
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);

-- ============================================================================
-- Create verification_attempts table (for rate limiting)
-- ============================================================================

CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(10),
  success BOOLEAN DEFAULT FALSE,
  attempted_at TIMESTAMP DEFAULT now()
);

-- Create indexes for verification_attempts table
CREATE INDEX IF NOT EXISTS idx_verification_attempts_user_id ON verification_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_attempted_at ON verification_attempts(attempted_at);

-- ============================================================================
-- Enable Row Level Security (Supabase)
-- ============================================================================

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies (Uncomment if using Supabase with RLS)
-- ============================================================================

-- Users can only see their own data
-- CREATE POLICY "Users can view own data"
--   ON users
--   FOR SELECT
--   USING (auth.uid() = id);

-- Only system can insert/update users
-- CREATE POLICY "Only system can insert users"
--   ON users
--   FOR INSERT
--   WITH CHECK (true);  -- System-level insert only

-- ============================================================================
-- Sample Test Data (for development only - DELETE FOR PRODUCTION)
-- ============================================================================

-- INSERT INTO users (email, password_hash, email_verified, created_at)
-- VALUES (
--   'test@example.com',
--   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmmS46m', -- password: Password1
--   true,
--   now()
-- );

