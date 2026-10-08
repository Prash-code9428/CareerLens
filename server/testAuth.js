import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { generateToken } from './utils/generateToken.js';
import { protect } from './middleware/authMiddleware.js';

process.env.JWT_SECRET = 'test-secret-key-for-careerlens-2026';

async function runAuthTests() {
  console.log('🧪 Starting CareerLens Auth Unit & Logic Verification Tests...\n');

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

  // Test 3: Safe Object Serialization
  const mockUserDoc = new User({
    name: 'Priya Patel',
    email: 'priya@university.edu',
    password: 'securepassword123',
    location: 'Bangalore',
    preferredRoles: ['Frontend Engineer', 'Full Stack Developer'],
    workMode: 'hybrid',
    experienceLevel: 'internship'
  });

  const safeObj = mockUserDoc.toSafeObject();
  assert(safeObj.name === 'Priya Patel', 'Safe object retains user name');
  assert(safeObj.email === 'priya@university.edu', 'Safe object retains email');
  assert(safeObj.password === undefined, 'Safe object STRICTLY removes password');
  assert(safeObj.__v === undefined, 'Safe object strips version key __v');

  // Test 4: Auth Protect Middleware with Mock Request
  let middlewareNextCalled = false;
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
  await protect({ headers: {} }, mockRes, () => {
    middlewareNextCalled = true;
  });
  assert(middlewareStatus === 401 && middlewareJson?.success === false, 'Protect rejects missing Authorization header with 401');

  // 4b. Invalid / malformed token
  middlewareStatus = null;
  middlewareJson = null;
  await protect({ headers: { authorization: 'Bearer invalid.token.value' } }, mockRes, () => {});
  assert(middlewareStatus === 401, 'Protect rejects malformed JWT token with 401');

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed.`);

  if (passed === total) {
    console.log('🎉 All Auth unit and security checks passed cleanly!\n');
  } else {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
