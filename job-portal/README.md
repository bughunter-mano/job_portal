# Job Portal - Setup Guide (MongoDB Version)

Database ke liye ab **MongoDB Atlas** (free cloud MongoDB) use kar rahe hain. Pehli
dafa MongoDB use kar rahe ho, to koi tension nahi — neeche har cheez detail se hai.

## Zaroorat (Prerequisites)
1. **Node.js** (v18+) — check karo: `node -v`
2. Free **MongoDB Atlas account** — https://www.mongodb.com/cloud/atlas/register

---

## STEP 1: MongoDB Atlas account aur cluster banao

1. https://www.mongodb.com/cloud/atlas/register pe jao, Google se ya email se sign up
   kar lo (free hai, credit card nahi chahiye)
2. Sign up ke baad ek form aayega ("Deploy your database") — usme:
   - **"M0 FREE"** wala tier select karo (yeh hamesha free rehta hai)
   - Provider: **AWS** rehne do (default)
   - Region: apne qareeb wala choose karo
   - Cluster Name: `Cluster0` rehne do ya kuch bhi rakh do
   - **"Create Deployment"** pe click karo (1-3 min lagega ban ne mein)

3. Ban jaane ke baad ek popup aayega **"Security Quickstart"**:
   - **Username/Password** wala option select karo
   - Username daal do (e.g. `jobportal`)
   - Password ke liye **"Autogenerate Secure Password"** pe click karo, aur usay
     **kahin copy/save kar lo** (aage chahiye hoga) — ya khud simple password type kar do
     (sirf letters + numbers, koi `@ # % /` jaisi special character mat rakhna, warna
     connection string tootegi)
   - **"Create Database User"** pe click karo

4. Neeche "Where would you like to connect from?" mein:
   - **"My Local Environment"** choose karo
   - **"Add My Current IP Address"** pe click karo
   - **Zaroori:** iske neeche ek aur entry manually add karo taake koi bhi jagah se
     (jaise deploy karte waqt) connect ho sake: IP Address box mein `0.0.0.0/0` type
     karo, description mein "Allow all" likh do, **"Add Entry"** dabao
   - **"Finish and Close"** pe click karo

## STEP 2: Connection string copy karo

1. Left sidebar mein **"Database"** pe click karo (ya "Overview")
2. Apne cluster ke sath **"Connect"** button pe click karo
3. **"Drivers"** option choose karo
4. Driver: **Node.js**, Version: latest — neeche ek connection string dikhegi, kuch
   aisi:
   ```
   mongodb+srv://jobportal:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Yeh poori string copy kar lo. `<password>` ki jagah apna asal password daal dena
   (angle brackets `< >` hata ke). Aur `mongodb.net/` ke baad database ka naam bhi daal
   do, e.g. `mongodb.net/job_portal?retryWrites...` — isse "job_portal" naam ka database
   apne aap ban jayega jab tum data save karoge:
   ```
   mongodb+srv://jobportal:apnapassword@cluster0.xxxxx.mongodb.net/job_portal?retryWrites=true&w=majority
   ```

Yeh string agle step mein `.env` file mein daalni hai.

---

## STEP 3: Project folder extract karo aur backend setup karo

```
cd job-portal/server
npm install
```

`.env` file banao:

```
cp .env.example .env
```

`.env` file kholo (VS Code mein) aur values bharo:
- `MONGODB_URI` = Step 2 wali connection string (poori, password ke sath)
- `JWT_SECRET` = koi bhi random lambi string (e.g. `myjobportal2026secret`)
- `EMAIL_USER` / `EMAIL_PASS` = abhi ke liye blank chhod do

Save karo (`Ctrl+S`). Ab admin account banao:

```
npm run seed
```

Yeh dikhna chahiye:
```
MongoDB connected successfully
✅ Admin created successfully!
   Email: admin@jobportal.com
   Password: Admin@123
```

**Note:** MongoDB mein Supabase/MySQL ki tarah pehle se "table banane" ki zaroorat nahi
hoti — jaise hi pehla data save hota hai (yeh seed command), collections apne aap ban
jaati hain.

Ab server chalao:

```
npm run dev
```

Yeh dikhna chahiye: `Server running on http://localhost:5000`

**Is terminal ko band mat karo.**

---

## STEP 4: Frontend setup (naya terminal tab kholo)

```
cd job-portal/client
npm install
cp .env.example .env
npm run dev
```

Terminal mein link milega, usually: `http://localhost:5173`

---

## STEP 5: Test karo

1. Browser mein `http://localhost:5173/admin/login` kholo
2. Login: `admin@jobportal.com` / `Admin@123`
3. "Create Job" pe ek job daalo
4. `http://localhost:5173/jobs` pe jaake dekho
5. Job pe click → "Apply Now" → form bharo → PDF resume upload karo → Submit
6. Admin panel → Applications → Accept/Reject try karo

---

## Data dekhna ho to (MongoDB Atlas mein)
Atlas dashboard mein apne cluster ke paas **"Browse Collections"** button hota hai —
usse click kar ke `job_portal` database ke andar `admins`, `jobs`, `applications`,
`notifications` collections dikh jayengi, jaise Excel sheet ki tarah.

---

## Folder Structure
```
job-portal/
├── server/          → Backend (Node + Express + MongoDB/Mongoose)
│   ├── config/       → db.js (MongoDB connection)
│   ├── models/        → Admin.js, Job.js, Application.js, Notification.js (Mongoose schemas)
│   ├── controllers/  → business logic
│   ├── routes/       → API endpoints
│   ├── middleware/   → auth check, file upload
│   ├── utils/        → email service
│   ├── uploads/       → uploaded resumes stored here (still on your local disk)
│   ├── seed.js        → creates first admin
│   └── server.js      → entry point
│
└── client/          → Frontend (React + Vite + Tailwind)
    └── src/
        ├── pages/        → Home, Jobs, JobDetails, ApplyJob, About, Contact
        ├── pages/admin/  → Login, Dashboard, Jobs, CreateJob, EditJob, Applications
        ├── components/   → Navbar, Footer, AdminSidebar, JobForm
        ├── context/      → AuthContext (admin login state)
        └── services/     → api.js (axios)
```

## Common Errors

**`MongooseServerSelectionError` ya connection timeout**
- Atlas mein Network Access check karo — `0.0.0.0/0` add kiya tha ya nahi (Step 1.4)
- `.env` mein `MONGODB_URI` sahi hai ya nahi, password mein special character to nahi

**`ECONNREFUSED 127.0.0.1`**
- Matlab `.env` load hi nahi ho rahi — file `.env` naam ki hai (`.env.txt` nahi), aur
  `server` folder ke andar hi hai, aur `npm run dev`/`npm run seed` restart kiya hai
  `.env` save karne ke baad

## Agla kadam
- Deploy: backend → Render/Railway, frontend → Vercel/Netlify (MongoDB Atlas already
  cloud pe hai, deploy ke liye alag se kuch nahi karna)
- Admin password change page
- Resume upload progress bar

**Koi error aaye to poora error message paste kar dena — theek kar dunga.**
