# Public APIs Documentation — CodeClub

This document contains the 4 essential Public REST APIs:

1. **News API** (`GET /api/news`)
2. **Send Message API** (`POST /api/messages`)
3. **Our Clients API** (`GET /api/clients`)
4. **Case Studies / Projects API** (`GET /api/projects`)

---

## 🌐 Base URL

- **Local:** `http://localhost:5000/api` *(or `http://localhost:5000`)*
- **Vercel Production:** `https://<your-domain>.vercel.app/api`

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
