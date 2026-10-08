import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { generateToken } from './utils/generateToken.js';
import { protect } from './middleware/authMiddleware.js';
import { validateGoogleCloudConfig } from './config/googleCloud.js';
import { checkVertexAIHealth } from './services/vertexAI.js';
import { validateSupabaseConfig, SUPABASE_BUCKET } from './config/supabase.js';
import { cleanExtractedText, extractTextFromBuffer } from './services/resumeParser.js';
import { normalizeCandidateProfile } from './services/resumeAnalyzer.js';

process.env.JWT_SECRET = 'test-secret-key-for-careerlens-2026';

async function runVerificationTests() {
  console.log('🧪 Starting CareerLens Verification Tests (Auth, Profile, Vertex AI, Supabase, Parser & AI Intelligence)...\n');

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

  // Resume Storage Path formatting
  const expectedPath = `${SUPABASE_BUCKET}/${dummyUserId}/resume.pdf`;
  mockUserDoc.resumePath = expectedPath;
  assert(mockUserDoc.resumePath === 'resumes/65b1234567890abcdef12345/resume.pdf', 'Resume storage path correctly formats to resumes/{userId}/resume.pdf');

  // --- Resume Parser & Extraction Tests ---
  // Text cleaning
  const dirtyText = "  Software Engineer   \n\n\n\nReact, Node.js, MongoDB \t\t  ";
  const cleaned = cleanExtractedText(dirtyText);
  assert(cleaned === "Software Engineer\n\nReact, Node.js, MongoDB", 'cleanExtractedText normalizes excessive whitespace and newlines');

  // Reject non-PDF or corrupted buffer
  let corruptedRejected = false;
  try {
    await extractTextFromBuffer(Buffer.from('Not a PDF at all'));
  } catch (err) {
    corruptedRejected = err.code === 'INVALID_PDF_HEADER';
  }
  assert(corruptedRejected, 'extractTextFromBuffer rejects non-PDF buffer header');

  // Valid minimal PDF extraction
  const validPdfRaw = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length 75 >> stream
BT
/F1 12 Tf
72 712 Td
(Prashant Sharma - Full Stack Developer - React Node.js MongoDB) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000293 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
420
%%EOF`;

  const validPdfBuffer = Buffer.from(validPdfRaw, 'utf-8');
  const extraction = await extractTextFromBuffer(validPdfBuffer);
  assert(extraction.charCount > 20, 'extractTextFromBuffer extracts text from valid PDF');
  assert(extraction.text.includes('Full Stack Developer'), 'Extracted text content matches resume text');

  // --- Vertex AI Candidate Profile Normalization Tests ---
  const mockAiOutput = {
    summary: 'Aspiring Full Stack Engineer with project experience in React and Node.js.',
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    programmingLanguages: ['JavaScript', 'Python'],
    frameworks: ['React', 'Express.js'],
    databases: ['MongoDB', 'Supabase'],
    tools: ['Git', 'Docker', 'Postman'],
    projects: [
      {
        name: 'CareerLens',
        description: 'AI-powered job discovery platform',
        technologies: ['React', 'Node.js', 'Vertex AI']
      }
    ],
    experience: [],
    education: [
      {
        institution: 'Indian Institute of Technology',
        degree: 'B.Tech',
        major: 'Computer Science',
        graduationYear: '2026'
      }
    ],
    certifications: ['Google Cloud Certified Associate'],
    preferredRoles: ['Software Engineer Intern', 'Frontend Developer'],
    experienceLevel: 'Student'
  };

  const normalizedProfile = normalizeCandidateProfile(mockAiOutput);
  assert(normalizedProfile.summary.length > 10, 'Candidate summary normalized');
  assert(normalizedProfile.skills.length === 5, 'Skills array normalized');
  assert(normalizedProfile.programmingLanguages.includes('JavaScript'), 'Programming languages preserved');
  assert(normalizedProfile.projects[0].name === 'CareerLens', 'Projects mapped correctly');
  assert(normalizedProfile.experienceLevel === 'Student', 'Experience level normalized');
  assert(typeof normalizedProfile.analyzedAt === 'string', 'Timestamp attached to normalized profile');

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed.`);

  if (passed === total) {
    console.log('🎉 All Auth, Profile, Vertex AI, Supabase Storage, Parser & AI Intelligence checks passed cleanly!\n');
  } else {
    process.exit(1);
  }
}

runVerificationTests().catch((err) => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
