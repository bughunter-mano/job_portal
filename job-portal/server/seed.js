// Run once to create the first admin account and dummy content: npm run seed
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Client = require('./models/Client');
const Project = require('./models/Project');
const Team = require('./models/Team');
const Testimonial = require('./models/Testimonial');
const Job = require('./models/Job');
require('dotenv').config();

async function seedAdminAuto() {
  try {
    const email = 'admin@jobportal.com';
    const existing = await Admin.findOne({ email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await Admin.create({ name: 'Super Admin', email, password: hashedPassword });
      console.log('✅ Admin account seeded: admin@jobportal.com / Admin@123');
    } else {
      console.log('Admin already exists.');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

async function seedContent() {
  try {
    // 1. Clients
    const clientCount = await Client.countDocuments();
    if (clientCount === 0) {
      const clientsData = [
        {
          name: 'ApexCorp',
          logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
          about: 'ApexCorp is a global leader in high-performance cloud migration services and DevOps enablement.',
          order: 1
        },
        {
          name: 'Vertex Systems',
          logo: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=150&q=80',
          about: 'Vertex Systems builds decentralized database solutions and scalable microservices architectures.',
          order: 2
        },
        {
          name: 'NovaSoft',
          logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80',
          about: 'NovaSoft provides end-to-end enterprise CRM customized solutions and intelligence dashboards.',
          order: 3
        },
        {
          name: 'Stellar Tech',
          logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80',
          about: 'Stellar Tech develops next-generation AI agents and semantic search integrations for enterprise.',
          order: 4
        },
        {
          name: 'Summit Consulting',
          logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80',
          about: 'Summit Consulting advises top Fortune 500 tech companies on digital transformation strategies.',
          order: 5
        }
      ];
      await Client.insertMany(clientsData);
      console.log('✅ 5 Clients seeded successfully!');
    }

    // 2. Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projectsData = [
        {
          title: 'Enterprise Analytics Dashboard',
          description: 'A real-time data monitoring system visualizing system load, financial transactions, and user engagement metrics using D3.js and WebSockets.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
          techStack: 'React, Node.js, Express, Chart.js, Tailwind',
          link: 'https://github.com',
          order: 1
        },
        {
          title: 'Decentralized Data Broker',
          description: 'A high-throughput distributed system designed to securely broker IoT telemetry across private clouds with automated cryptographic verification.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80',
          techStack: 'Golang, gRPC, Kafka, Redis, Docker',
          link: 'https://github.com',
          order: 2
        },
        {
          title: 'Interactive Web UI Toolkit',
          description: 'A component library designed for rapid web app development focusing on clean aesthetic, strict accessibility (WCAG AA), and premium micro-interactions.',
          image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&q=80',
          techStack: 'TypeScript, React, Storybook, PostCSS',
          link: 'https://github.com',
          order: 3
        },
        {
          title: 'SaaS Mobile Companion App',
          description: 'Cross-platform mobile application allowing real-time project collaboration, workspace messaging, and push-notified task assignments.',
          image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=500&q=80',
          techStack: 'React Native, Redux, Node.js, Socket.io',
          link: 'https://github.com',
          order: 4
        },
        {
          title: 'E-commerce AI Search Platform',
          description: 'An AI-powered product recommendation and semantic search engine handling millions of queries per second with sub-10ms response latency.',
          image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=500&q=80',
          techStack: 'Python, PyTorch, FastAPI, Elasticsearch',
          link: 'https://github.com',
          order: 5
        }
      ];
      await Project.insertMany(projectsData);
      console.log('✅ 5 Projects seeded successfully!');
    }

    // 3. Team
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      const teamData = [
        {
          name: 'Sarah Jenkins',
          designation: 'Chief Technology Officer',
          experience: '12+',
          stack: 'Systems Architecture, Kubernetes, Cloud Strategy',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          order: 1
        },
        {
          name: 'David Chen',
          designation: 'Principal Engineer',
          experience: '8+',
          stack: 'Golang, Java, Distributed Databases, Kafka',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          order: 2
        },
        {
          name: 'Melissa Rodriguez',
          designation: 'Lead Product Manager',
          experience: '7',
          stack: 'Agile Strategy, User Research, Product Roadmap',
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          order: 3
        },
        {
          name: 'Alex Mercer',
          designation: 'Senior Frontend Developer',
          experience: '6',
          stack: 'React, Next.js, TailwindCSS, Web Performance',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          order: 4
        },
        {
          name: 'Emily Watson',
          designation: 'Senior UX Designer',
          experience: '5',
          stack: 'Figma, Wireframing, User Testing, Typography',
          photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
          order: 5
        }
      ];
      await Team.insertMany(teamData);
      console.log('✅ 5 Team members seeded successfully!');
    }

    // 4. Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const testimonialsData = [
        {
          name: 'Arthur Pendelton',
          role: 'CEO, ApexCorp',
          content: 'The team delivered an outstanding enterprise dashboard system. Their engineers are top-notch and completed the project on time.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
          rating: 5,
          order: 1
        },
        {
          name: 'Sarah Smith',
          role: 'VP of Engineering, Vertex Systems',
          content: 'Excellent collaboration on the decentralized data broker. Highly recommend their backend engineering expertise.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
          rating: 5,
          order: 2
        },
        {
          name: 'Michael Brown',
          role: 'Product Director, NovaSoft',
          content: 'Superb quality and customer support throughout the project. The UI toolkit is incredibly easy to customize.',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
          rating: 4,
          order: 3
        },
        {
          name: 'Emily Davis',
          role: 'Co-founder, Stellar Tech',
          content: 'The mobile companion app has helped increase our active users by 35%. Outstanding developers to work with.',
          avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80',
          rating: 5,
          order: 4
        },
        {
          name: 'David Wilson',
          role: 'Manager, Summit Consulting',
          content: 'Integrating semantic search has significantly optimized product matching times. A very professional service.',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
          rating: 5,
          order: 5
        }
      ];
      await Testimonial.insertMany(testimonialsData);
      console.log('✅ 5 Testimonials seeded successfully!');
    }

    // 5. Jobs
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      const jobsData = [
        {
          title: 'Senior React Developer',
          company: 'NovaSoft',
          location: 'Remote (US/Canada)',
          salary: '$110,000 - $130,000',
          job_type: 'Full-time',
          description: 'We are seeking a Senior React Developer to join our core product team. You will lead frontend architecture, optimize page load performance, and build interactive dashboards.',
          requirements: '5+ years of experience with React.js, TypeScript, and modern state management (Redux/Zustand). Strong CSS skills.',
          skills: 'React, TypeScript, Redux, TailwindCSS',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: 'active'
        },
        {
          title: 'DevOps Engineer',
          company: 'ApexCorp',
          location: 'New York, NY (Hybrid)',
          salary: '$120,000 - $145,000',
          job_type: 'Full-time',
          description: 'Join our cloud platform team to manage Kubernetes clusters, build CI/CD pipelines, and secure cloud environments.',
          requirements: 'Experience with AWS, Docker, Kubernetes, Terraform, and Github Actions. Strong scripting skills.',
          skills: 'AWS, Kubernetes, Terraform, CI/CD',
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'active'
        },
        {
          title: 'Backend Developer (Golang)',
          company: 'Vertex Systems',
          location: 'Remote (Worldwide)',
          salary: '$95,000 - $120,000',
          job_type: 'Full-time',
          description: 'Build robust, highly scalable microservices using Golang. You will work on database design, caching layers, and gRPC endpoints.',
          requirements: '3+ years experience writing production Golang. Solid database design principles (PostgreSQL, Redis).',
          skills: 'Golang, gRPC, PostgreSQL, Redis',
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: 'active'
        },
        {
          title: 'UX/UI Design Intern',
          company: 'Stellar Tech',
          location: 'San Francisco, CA',
          salary: '$25 - $35 / hour',
          job_type: 'Internship',
          description: 'Learn and work alongside senior designers to create mockups, conduct user testing, and maintain our product design system.',
          requirements: 'Figma proficiency, strong design portfolio, and basic understanding of user-centered design principles.',
          skills: 'Figma, UI Design, Prototyping',
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: 'active'
        },
        {
          title: 'Product Marketing Manager',
          company: 'Summit Consulting',
          location: 'Chicago, IL (On-site)',
          salary: '$90,000 - $110,000',
          job_type: 'Contract',
          description: 'Own the marketing launch of consulting frameworks and products. Conduct market analysis and collaborate with sales teams.',
          requirements: 'Experience in tech/SaaS product marketing. Strong communication and data-driven copywriting skills.',
          skills: 'Product Marketing, Copywriting, SEO',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'active'
        }
      ];
      await Job.insertMany(jobsData);
      console.log('✅ 5 Jobs seeded successfully!');
    }
  } catch (err) {
    console.error('Content seeding error:', err.message);
  }
}

async function seedAdmin() {
  try {
    await connectDB();
    await seedAdminAuto();
    await seedContent();
    console.log('Seeding fully completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedAdmin();
}

module.exports = { seedAdminAuto, seedContent };
