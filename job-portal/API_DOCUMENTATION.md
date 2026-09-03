# Backend REST APIs Documentation — Job Portal & CodeClub

## 🌐 Production Base URL

- **Production Live URL:** `https://job-portal-eq5r50wh6-malaika4.vercel.app/api`
- **Local Dev URL:** `http://localhost:5000/api`

---

## 📑 Quick Navigation

1. [Job Details API (`GET /api/jobs/:id`)](#-1-job-details-api-get)
2. [Job Apply API (`POST /api/applications`)](#-2-job-apply--submit-resume-api-post)
3. [Get All Active Jobs API (`GET /api/jobs`)](#-3-get-all-active-jobs-api-get)
4. [Get All News API (`GET /api/news`)](#4-📰-get-all-news-api)
5. [Send Message / Contact API (`POST /api/messages`)](#5-✉️-send-message--contact-post-api)
6. [Our Clients API (`GET /api/clients`)](#6-🏢-get-our-clients-api)
7. [Case Studies / Projects API (`GET /api/projects`)](#7-🚀-get-case-studies--projects-api)

---

## 💼 1. Job Details API (GET)

Fetch complete details of a single job posting by ID.

- **Method:** `GET`
- **Endpoint:** `/api/jobs/:id` *(fallback: `/jobs/:id`)*
- **Access:** Public (No Authentication Required)
- **Full URL Example:** `https://job-portal-eq5r50wh6-malaika4.vercel.app/api/jobs/65e9b8f2a1b2c3d4e5f6a7b8`
- **Headers:**
  ```http
  Content-Type: application/json
  ```
- **URL Parameters:**
  - `id` *(required, string)*: The MongoDB `_id` of the job.

### ✅ Success Response (`200 OK`):
```json
{
  "success": true,
  "job": {
    "_id": "65e9b8f2a1b2c3d4e5f6a7b8",
    "title": "Full Stack Developer",
    "company": "CodeClub IT Solutions",
    "location": "Peshawar, Pakistan",
    "job_type": "Full-Time",
    "salary": "PKR 100,000 - 150,000 / month",
    "description": "We are seeking a talented Full Stack Developer to build and maintain web applications.",
    "requirements": [
      "2+ years experience with React and Node.js",
      "Proficient in MongoDB and REST API design",
      "Experience with Git version control"
    ],
    "skills": [
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB"
    ],
    "deadline": "2026-10-31T00:00:00.000Z",
    "status": "active",
    "created_at": "2026-09-01T10:00:00.000Z"
  }
}
```

### ❌ Error Response (`404 Not Found`):
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

## 📝 2. Job Apply / Submit Resume API (POST)

Submit a job application with candidate information and CV/Resume file (PDF).

- **Method:** `POST`
- **Endpoint:** `/api/applications` *(fallback: `/applications`)*
- **Access:** Public (No Authentication Required)
- **Full URL:** `https://job-portal-eq5r50wh6-malaika4.vercel.app/api/applications`
- **Headers:**
  ```http
  Content-Type: multipart/form-data
  ```

### 📥 Request Body Fields (`multipart/form-data`):

| Field Name | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `job_id` | String | **Yes** | MongoDB `_id` of the job being applied for | `65e9b8f2a1b2c3d4e5f6a7b8` |
| `name` | String | **Yes** | Full name of the candidate | `Ahmed Khan` |
| `email` | String | **Yes** | Valid email address | `ahmed@gmail.com` |
| `phone` | String | **Yes** | Contact phone / WhatsApp number | `+92 300 1234567` |
| `linkedin` | String | **Yes** | Valid LinkedIn profile URL | `https://linkedin.com/in/ahmedkhan` |
| `resume` | File (PDF) | **Yes** | Resume / CV file (Max 10MB) | `resume.pdf` |
| `address` | String | No | City / Address | `Peshawar, Pakistan` |
| `education` | String | No | Degree / University | `BS Computer Science, IMSciences` |
| `experience` | String | No | Years or brief experience | `2 Years in MERN Stack` |
| `skills` | String | No | Relevant skills list | `React, Node, MongoDB, Express` |
| `github` | String | No | GitHub profile URL | `https://github.com/ahmedkhan` |
| `cover_letter`| String | No | Message or cover letter | `I am excited to apply for this position...` |

### ✅ Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": "65e9c011a1b2c3d4e5f6a7c9",
  "resume": "/uploads/resumes/resume-1725380000000-123456789.pdf"
}
```

### ❌ Error Responses:
- **400 Bad Request (Missing required fields):**
  ```json
  {
    "success": false,
    "message": "job_id, name, email, phone, and linkedin are required"
  }
  ```
- **400 Bad Request (Invalid LinkedIn format):**
  ```json
  {
    "success": false,
    "message": "Please provide a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)"
  }
  ```
- **400 Bad Request (Missing Resume):**
  ```json
  {
    "success": false,
    "message": "Resume (PDF) is required"
  }
  ```
- **400 Bad Request (Deadline Passed):**
  ```json
  {
    "success": false,
    "message": "The application deadline for this job has passed"
  }
  ```
- **404 Not Found (Invalid Job):**
  ```json
  {
    "success": false,
    "message": "Job not found"
  }
  ```

---

## 💼 3. Get All Active Jobs API (GET)

Fetch list of all active jobs with optional search and filter parameters.

- **Method:** `GET`
- **Endpoint:** `/api/jobs`
- **Full URL:** `https://job-portal-eq5r50wh6-malaika4.vercel.app/api/jobs`
- **Optional Query Parameters:**
  - `search`: Search in title, company, skills (e.g. `/api/jobs?search=Developer`)
  - `location`: Filter by location (e.g. `/api/jobs?location=Peshawar`)
  - `job_type`: Filter by type (e.g. `Full-Time`, `Part-Time`, `Remote`, `Internship`)
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `10`)

### ✅ Success Response (`200 OK`):
```json
{
  "success": true,
  "jobs": [
    {
      "_id": "65e9b8f2a1b2c3d4e5f6a7b8",
      "title": "Full Stack Developer",
      "company": "CodeClub IT Solutions",
      "location": "Peshawar, Pakistan",
      "job_type": "Full-Time",
      "salary": "PKR 100,000 - 150,000",
      "skills": ["React", "Node.js", "MongoDB"],
      "status": "active",
      "deadline": "2026-10-31T00:00:00.000Z",
      "created_at": "2026-09-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 1. 📰 Get All News API

- **Method:** `GET`
- **URL:** `/api/news`
- **Access:** Public (No Token Required)
- **Optional Query Parameters:**
  - `search`: Search by keyword in title/description (e.g. `/api/news?search=Partnership`)
  - `limit`: Limit results count (e.g. `/api/news?limit=3`)

### Success Response (`200 OK`):
```json
{
  "success": true,
  "count": 6,
  "news": [
    {
      "id": "6a95b9794d77e14923e7092a",
      "title": "Code Club and Peshawar Services Club Partnership",
      "description": "Code Club and Peshawar Services Club have officially signed a partnership agreement aimed at strengthening collaboration between innovation and leadership. The agreement was formalized by Major Suhail Afzal, Secretary of Peshawar Services Club, along with Mr. Abdullah Qureshi, CEO of Code Club, and Mr. Muhammad Affan, CTO of Code Club. This partnership marks a significant step toward promoting technology-driven initiatives and fostering opportunities for young innovators in the region.",
      "image": "/uploads/images/news5.jpeg",
      "date": "October 16, 2025",
      "order": 1,
      "created_at": "2026-08-31T17:21:40.000Z"
    },
    {
      "id": "6a95b9794d77e14923e7092b",
      "title": "Innovation Session at Lincoln Corners Pakistan",
      "description": "Mr. Abdullah Qureshi and Mr. Muhammad Affan, students of BCS 7th Semester and founding team members of Code Club, proudly represented their startup at the Pakistan One event organized by the Ministry of Planning, Development and Special Initiatives. Their participation highlighted the spirit of youth-led innovation and the potential of Code Club to contribute to Pakistan's tech future.",
      "image": "/uploads/images/news6.jpeg",
      "date": "October 1, 2025",
      "order": 2,
      "created_at": "2026-08-31T17:21:40.000Z"
    }
  ]
}
```

---

## 2. ✉️ Send Message / Contact POST API

- **Method:** `POST`
- **URL:** `/api/messages` *(fallback: `/api/contact`)*
- **Access:** Public (No Token Required)
- **Content-Type:** `application/json`

### Request Body (JSON Payload):
```json
{
  "name": "Ahmed Khan",
  "email": "ahmed@apexcorp.com",
  "phone": "+92 300 9876543",
  "companyNo": "+92 91 5849302",
  "message": "We want to hire software engineers and inquire about corporate training."
}
```

### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Message sent successfully! Our team will get back to you shortly.",
  "data": {
    "id": "6a95bb179433766339178ea0",
    "name": "Ahmed Khan",
    "email": "ahmed@apexcorp.com",
    "phone": "+92 300 9876543",
    "companyNo": "+92 91 5849302",
    "message": "We want to hire software engineers and inquire about corporate training.",
    "status": "unread",
    "created_at": "2026-08-31T17:34:10.000Z"
  }
}
```

---

## 3. 🏢 Get Our Clients API

- **Method:** `GET`
- **URL:** `/api/clients`
- **Access:** Public (No Token Required)

### Success Response (`200 OK`):
```json
{
  "success": true,
  "count": 27,
  "clients": [
    {
      "id": "6a95c1a29433766339178ea1",
      "name": "Peshawar Services Club",
      "service": "App & management system",
      "description": "We built an app and management system that brings member services, internal coordination, and daily reporting into one place.",
      "logo": "/assets/clients/Peshawar Service Club.jpeg",
      "order": 1
    },
    {
      "id": "6a95c1a29433766339178ea2",
      "name": "Memaar Pvt Ltd.",
      "service": "WhatsApp automation & leads",
      "description": "We set up WhatsApp automation and a lead flow that responds quickly, captures interest, and keeps follow-ups organized.",
      "logo": "/assets/clients/Memaar Pvt Ltd.jpeg",
      "order": 2
    },
    {
      "id": "6a95c1a29433766339178ea3",
      "name": "IMSciences",
      "service": "Recruiter portal",
      "description": "We created a recruiter portal that gives hiring teams a cleaner way to publish openings, review applications, and stay on top of candidates.",
      "logo": "/assets/clients/IMSciences.jpeg",
      "order": 3
    }
  ]
}
```

---

## 4. 🚀 Get Case Studies / Projects API

- **Method:** `GET`
- **URL:** `/api/projects` *(or `/api/casestudies`)*
- **Access:** Public (No Token Required)

### Success Response (`200 OK`):
```json
{
  "success": true,
  "count": 15,
  "projects": [
    {
      "id": "6a95c2b39433766339178ea2",
      "title": "Haasil - Multi vendor E-commerce Platform",
      "projectType": "E-Commerce",
      "description": "A comprehensive e-commerce platform supporting multiple vendors with features like product management, order tracking, and analytics.",
      "image": "/uploads/images/web-hassil.jpg",
      "tags": ["Full-Stack", "E-Commerce", "CMS"],
      "techStack": "Full-Stack, E-Commerce, CMS",
      "link": "https://haasil.store/",
      "liveLink": "https://haasil.store/",
      "order": 1
    },
    {
      "id": "6a95c2b39433766339178ea3",
      "title": "Peshawar Services Club",
      "projectType": "Mobile App",
      "description": "Complete solution with product management, orders, insights, and a sleek admin panel—fast and scalable.",
      "image": "/uploads/images/psc-app.jpeg",
      "tags": ["Full-Stack", "Mobile App", "CMS"],
      "techStack": "Full-Stack, Mobile App, CMS",
      "link": "",
      "liveLink": "",
      "order": 2
    },
    {
      "id": "6a95c2b39433766339178ea4",
      "title": "SEIZURE SENSE",
      "projectType": "AI/ML",
      "description": "An AI/ML-based system that analyzes brain signals (EEG DATA) to predict epileptic seizures in advance.",
      "image": "/uploads/images/ai_project.png",
      "tags": ["AI/ML", "Healthcare", "Python"],
      "techStack": "AI/ML, Healthcare, Python",
      "link": "",
      "liveLink": "",
      "order": 3
    }
  ]
}
```
