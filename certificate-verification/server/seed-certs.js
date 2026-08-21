const BACKEND_URL = 'http://localhost:5000/api';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer() {
  console.log('⏳ Waiting for backend server and in-memory database to be ready...');
  while (true) {
    try {
      const res = await fetch('http://localhost:5000/health');
      if (res.ok) {
        // Now check if login endpoint works (which checks DB status)
        const checkDb = await fetch(`${BACKEND_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@check.com', password: 'wrong' })
        });
        const status = checkDb.status;
        // If status is 401, it means the database is connected and authenticating (since we get a proper 401 instead of a 500 timeout)
        if (status === 401) {
          console.log('✅ Backend Server and Database are connected and ready!');
          break;
        }
      }
    } catch (err) {
      // Server is not up yet
    }
    await delay(2000);
  }
}

async function seedData() {
  await waitForServer();

  console.log('\n🔐 Authenticating Admin...');
  const loginRes = await fetch(`${BACKEND_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@codeclub.com',
      password: 'Admin@CodeClub2026'
    })
  });

  if (!loginRes.ok) {
    console.error('❌ Admin authentication failed. Check if server auto-seeding completed.');
    process.exit(1);
  }

  const { token } = await loginRes.json();
  console.log('✅ Admin Authenticated successfully.');

  const sampleCertificates = [
    {
      studentName: 'Ahmad Ali',
      courseName: 'Full-Stack Web Development (MERN)',
      instructorName: 'Haris Ali',
      issueDate: new Date('2026-07-15').toISOString()
    },
    {
      studentName: 'Saba Fatima',
      courseName: 'Advanced UI/UX Product Design',
      instructorName: 'Ayesha Khan',
      issueDate: new Date('2026-07-28').toISOString()
    },
    {
      studentName: 'Zainab Malik',
      courseName: 'Python & Data Science Bootcamp',
      instructorName: 'Zeeshan Ahmed',
      issueDate: new Date('2026-08-05').toISOString()
    }
  ];

  console.log('\n📄 Seeding 3 sample certificates...');

  for (const cert of sampleCertificates) {
    const res = await fetch(`${BACKEND_URL}/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cert)
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`\n======================================================`);
      console.log(`✅ Certificate Issued for: ${data.certificate.studentName}`);
      console.log(`   Course:         ${data.certificate.courseName}`);
      console.log(`   Instructor:     ${data.certificate.instructorName}`);
      console.log(`   Certificate ID: ${data.certificate.certificateId}`);
      console.log(`   Verify Link:    ${data.verifyUrl}`);
      console.log(`======================================================`);
    } else {
      console.error(`❌ Failed to seed certificate for ${cert.studentName}:`, await res.text());
    }
  }

  console.log('\n🎉 Seeding completed successfully! You can copy any verification link above and open it in your browser.');
  process.exit(0);
}

seedData().catch(err => {
  console.error('Seeding process failed:', err);
  process.exit(1);
});
