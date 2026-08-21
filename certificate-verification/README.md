# CodeClub Certificate Verification Registry

A secure, modern, and cryptographically signed full-stack Certificate Verification System built using the MERN stack (MongoDB, Express, React, Node.js). 

This system validates certificate records and verifies integrity against database tampering using **HMAC-SHA256 signatures** signed by a server-side secret key.

---

## Key Features
- **Cryptographic Tamper-Checking**: Utilizes HMAC-SHA256 with a unique server secret to detect unauthorized direct database changes.
- **Dynamic QR Code Generation**: Generates verification URLs and embeds scannable QR codes onto certificates.
- **On-Demand PDF Generation**: Standard landscape PDF certificate downloads built programmatically using `pdfkit`.
- **Administrative Control**: Secure JWT admin login (1-day expiry) to create and revoke certificates.
- **Audit Trails**: Logs creation and revocation operations (`issuedBy`, `revokedBy`, `revokedAt`).
- **Enhanced UI (Tailwind CSS)**: Sleek dark-mode glassmorphic interface with client-side regex routing, registry search, and pagination.
- **API Security**: Implements `express-rate-limit` on verification attempts and restrictions on production CORS origins.

---

## Folder Structure
```
certificate-verification/
├── README.md
├── server/               # Backend (Express, Node, MongoDB)
│   ├── config/           # Database configurations
│   ├── middleware/       # JWT Auth & Rate limiting
│   ├── models/           # Mongoose schemas (Admin, Certificate)
│   ├── routes/           # REST endpoints
│   ├── utils/            # Hashing & PDF Generation engines
│   └── seed.js           # Admin database seeder
└── client/               # Frontend (React, Vite, Tailwind CSS)
    ├── src/
    │   ├── components/   # Layout elements (Navbar, ProtectedRoute)
    │   └── pages/        # Views (Home, Verification, Dashboard, Login)
    └── tailwind.config.js
```

---

## Setup & Running Locally

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** running locally on default port `27017` (or a MongoDB Atlas cloud URI)

### STEP 1: Backend Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
4. Open the newly created `.env` file and configure your values (the defaults are preconfigured for local MongoDB):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/certificate_verification
   JWT_SECRET=your_jwt_secret_key_here
   HASH_SECRET=your_hmac_sha256_secret_key_here_at_least_64_characters_long
   FRONTEND_URL=http://localhost:5173
   ADMIN_EMAIL=admin@codeclub.com
   ADMIN_PASSWORD=Admin@CodeClub2026
   ```

### STEP 2: Seeding the Admin User
To create the administrator account in your database:
```bash
npm run seed
```
> [!WARNING]
> This command will print a security notice instructing you to change your credentials on the first login. Make sure to update the credentials in production!

### STEP 3: Starting the Backend
Run the Express development server:
```bash
npm run dev
```
The server will boot up on `http://localhost:5000`.

---

### STEP 4: Frontend Setup (New Terminal Window)
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install client dependencies (uses `--legacy-peer-deps` due to React 19 / Lucide dependency constraints):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create the client `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Verify it points to your backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
5. Start the React development client:
   ```bash
   npm run dev
   ```
The development environment will start on `http://localhost:5173`.

---

## Verification & Testing Workflows

1. **Dashboard Login**:
   - Access `http://localhost:5173/admin/login` and use the credentials seeded in Step 2.
2. **Issue Certificate**:
   - Enter student, course, and instructor names in the form.
   - Click **Generate Cryptographic Certificate** to obtain a Certificate ID and scan the verification QR code.
3. **Audit Listing**:
   - Locate the issued record in the **Certificate Registry** table. Verify it shows the correct issuer, search for the student name, and test table pagination.
4. **Verification Validation**:
   - Paste the ID into `http://localhost:5173/verify` or click the link. You will see the green **Verified ✅** badge.
5. **PDF Generation**:
   - Click the **Download PDF Certificate** button to test local rendering and layout of the landscape certificate.
6. **Certificate Revocation**:
   - From the Admin Dashboard registry table, click **Revoke** on the active certificate and confirm.
   - Re-visit the public URL or recheck the ID. The page will render a yellow **Revoked ⚠️** warning badge.
