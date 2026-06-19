-- Create contact_support_requests table
CREATE TABLE IF NOT EXISTS contact_support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'in-progress', 'resolved', 'closed'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_from_admin TEXT,
  resolved_at TIMESTAMP,
  INDEX(user_id),
  INDEX(status),
  INDEX(created_at)
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_contact_support_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contact_support_requests_updated_at ON contact_support_requests;
CREATE TRIGGER contact_support_requests_updated_at
BEFORE UPDATE ON contact_support_requests
FOR EACH ROW
EXECUTE FUNCTION update_contact_support_requests_updated_at();

-- Create RLS policies
ALTER TABLE contact_support_requests ENABLE ROW LEVEL SECURITY;

-- Users can see only their own requests
CREATE POLICY "Users can view their own support requests" ON contact_support_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own requests
CREATE POLICY "Users can create support requests" ON contact_support_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own requests
CREATE POLICY "Users can update their own support requests" ON contact_support_requests
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can see all requests (if you add admin role later)
CREATE POLICY "Admins can view all support requests" ON contact_support_requests
  FOR SELECT
  USING (true); -- Update this with proper admin role check
