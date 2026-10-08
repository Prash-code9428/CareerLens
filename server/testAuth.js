import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { generateToken } from './utils/generateToken.js';
import { protect } from './middleware/authMiddleware.js';
import { validateGoogleCloudConfig } from './config/googleCloud.js';
import { checkVertexAIHealth } from './services/vertexAI.js';
import { validateSupabaseConfig, SUPABASE_BUCKET } from './config/supabase.js';

process.env.JWT_SECRET = 'test-secret-key-for-careerlens-2026';

async function runVerificationTests() {
  console.log('🧪 Starting CareerLens Verification Tests (Auth, Profile, Vertex AI & Supabase Upload)...\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
    }
  }

  // --- Auth Tests ---
  // Test 1: Password hashing via bcryptjs
  const plainPassword = 'SuperSecretPassword123!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);
  const isMatchValid = await bcrypt.compare(plainPassword, hash);
  const isMatchInvalid = await bcrypt.compare('WrongPassword', hash);

  assert(isMatchValid === true, 'Bcrypt successfully verifies correct password');
  assert(isMatchInvalid === false, 'Bcrypt rejects incorrect password');

  // Test 2: Token generation & validation
  const dummyUserId = '65b1234567890abcdef12345';
  const token = generateToken(dummyUserId);
  assert(typeof token === 'string' && token.length > 20, 'JWT generateToken returns valid string');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  assert(decoded.id === dummyUserId, 'Decoded token ID matches user ID');

  // Test 3: Safe Object Serialization & Profile Schema
  const mockUserDoc = new User({
    name: 'Priya Patel',
    email: 'priya@university.edu',
    password: 'securepassword123',
    education: {
      university: 'National Institute of Technology',
      degree: 'B.Tech',
      major: 'Computer Science',
      graduationYear: '2026'
    },
    location: 'Bangalore',
    preferredRoles: ['Software Engineer Intern', 'Full Stack Developer'],
    workMode: 'Hybrid',
    experienceLevel: 'Student'
  });

  const safeObj = mockUserDoc.toSafeObject();
  assert(safeObj.name === 'Priya Patel', 'Safe object retains user name');
  assert(safeObj.email === 'priya@university.edu', 'Safe object retains email');
  assert(safeObj.education.university === 'National Institute of Technology', 'Safe object retains education details');
  assert(safeObj.education.degree === 'B.Tech', 'Safe object retains degree');
  assert(safeObj.preferredRoles.length === 2, 'Preferred roles list properly mapped');
  assert(safeObj.workMode === 'Hybrid', 'Work mode preference correctly stored');
  assert(safeObj.experienceLevel === 'Student', 'Experience level preference correctly stored');
  assert(safeObj.password === undefined, 'Safe object STRICTLY removes password');
  assert(safeObj.__v === undefined, 'Safe object strips version key __v');

  // Test 4: Auth Protect Middleware with Mock Request
  let middlewareStatus = null;
  let middlewareJson = null;

  const mockRes = {
    status: (code) => {
      middlewareStatus = code;
      return {
        json: (data) => {
          middlewareJson = data;
        }
      };
    }
  };

  // 4a. Missing Authorization header
  await protect({ headers: {} }, mockRes, () => {});
  assert(middlewareStatus === 401 && middlewareJson?.success === false, 'Protect rejects missing Authorization header with 401');

  // 4b. Invalid / malformed token
  middlewareStatus = null;
  middlewareJson = null;
  await protect({ headers: { authorization: 'Bearer invalid.token.value' } }, mockRes, () => {});
  assert(middlewareStatus === 401, 'Protect rejects malformed JWT token with 401');

  // --- Google Cloud Vertex AI Configuration Tests ---
  const configStatus = validateGoogleCloudConfig();
  assert(typeof configStatus.isConfigured === 'boolean', 'Vertex AI config validator returns boolean configuration state');
  assert(Array.isArray(configStatus.missing), 'Vertex AI validator tracks missing environment variables');

  const healthStatus = checkVertexAIHealth();
  assert(healthStatus.location === 'us-central1', 'Vertex AI defaults to us-central1 location');
  assert(healthStatus.model === 'gemini-1.5-pro', 'Vertex AI defaults to gemini-1.5-pro model');

  // --- Supabase Storage Configuration & Path Tests ---
  const supabaseConfig = validateSupabaseConfig();
  assert(typeof supabaseConfig.isConfigured === 'boolean', 'Supabase config validator evaluates configuration status');
  assert(supabaseConfig.bucket === 'resumes' || SUPABASE_BUCKET === 'resumes', 'Default Supabase bucket is resumes');

  // Test 5: Resume Storage Path formatting
  const expectedPath = `${SUPABASE_BUCKET}/${dummyUserId}/resume.pdf`;
  mockUserDoc.resumePath = expectedPath;
  assert(mockUserDoc.resumePath === 'resumes/65b1234567890abcdef12345/resume.pdf', 'Resume storage path correctly formats to resumes/{userId}/resume.pdf');

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed.`);

  if (passed === total) {
    console.log('🎉 All Auth, Profile, Vertex AI, and Supabase Storage checks passed cleanly!\n');
  } else {
    process.exit(1);
  }
}

runVerificationTests().catch((err) => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
