import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard.jsx';

export default function Home() {
  const [latestJobs, setLatestJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    // Load latest jobs
    api.get('/jobs?limit=6')
      .then((res) => setLatestJobs(res.data.jobs || []))
      .catch(() => {});

    // Load clients
    api.get('/clients')
      .then((res) => setClients(res.data.clients || []))
      .catch(() => {});

    // Load projects
    api.get('/projects')
      .then((res) => setProjects(res.data.projects || []))
      .catch(() => {});

    // Load testimonials
    api.get('/testimonials')
      .then((res) => setTestimonials(res.data.testimonials || []))
      .catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  }

  return (
    <div className="bg-paper min-h-screen text-ink overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-5 min-h-[calc(100vh-68px)] flex flex-col justify-center py-12 relative">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-4 animate-pulse">
          001 — ACCREDITED VERIFIED TALENT REGISTRY
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink max-w-3xl font-bold">
          Find top software work that <span className="italic text-teal font-semibold">fits</span> your skills.
        </h1>
        <p className="text-muted mt-4 max-w-xl text-sm md:text-base leading-relaxed">
          Connecting CodeClub engineering graduates with leading tech companies. Verify credentials and apply for developer opportunities.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mt-10 flex gap-0 rounded-full border-2 border-ink overflow-hidden bg-white shadow-md focus-within:ring-2 focus-within:ring-teal/30 transition-all duration-300">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Job title, skill, or company"
            className="flex-1 px-6 py-4 bg-transparent focus:outline-none text-ink placeholder:text-muted/60 text-sm"
          />
          <button className="bg-ink text-paper font-semibold px-8 hover:bg-teal hover:text-white transition-all duration-300">
            Search
          </button>
        </form>
      </section>

      {/* Clients Section */}
      {clients.length > 0 && (
        <section className="bg-teal-light/30 border-y border-hair py-16 px-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-teal text-center mb-8">
              Trusted by leading clients & partners
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-105 duration-300"
                >
                  {client.logo ? (
                    <img
                      src={client.logo.startsWith('http') ? client.logo : `${BASE_URL}${client.logo}`}
                      alt={client.name}
                      className="h-12 max-w-[150px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <span className="font-display text-lg font-bold text-muted group-hover:text-teal transition-colors">
                      {client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-paper border border-hair rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 text-muted hover:text-ink text-xl"
            >
              ✕
            </button>
            <div className="flex items-center gap-4 mb-4">
              {selectedClient.logo ? (
                <img
                  src={selectedClient.logo.startsWith('http') ? selectedClient.logo : `${BASE_URL}${selectedClient.logo}`}
                  alt={selectedClient.name}
                  className="h-12 w-24 object-contain bg-white p-1 border rounded"
                />
              ) : (
                <span className="font-display text-xl font-bold text-teal">{selectedClient.name}</span>
              )}
              <div>
                <h3 className="font-bold text-lg">{selectedClient.name}</h3>
                <p className="text-xs font-mono text-muted">Partner Client</p>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">{selectedClient.about || 'No information available.'}</p>
          </div>
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-2">Our Work</p>
              <h2 className="font-display text-2xl md:text-3xl text-ink font-semibold">Featured Projects</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-hair rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {project.image ? (
                  <div className="h-36 w-full overflow-hidden bg-teal-light/50 relative">
                    <img
                      src={project.image.startsWith('http') ? project.image : `${BASE_URL}${project.image}`}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-36 w-full bg-teal-light flex items-center justify-center font-display text-teal text-base font-bold">
                    {project.title}
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base text-ink font-semibold group-hover:text-teal transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted text-xs mt-1.5 leading-relaxed">{project.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-hair">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.techStack?.split(',').map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-teal-light text-teal text-[10px] font-mono">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-teal hover:text-ink font-semibold transition-colors"
                      >
                        View Project ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}



      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="border-t border-hair py-20 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-3">Feedback</p>
              <h2 className="font-display text-3xl text-ink font-semibold">What Clients Say</h2>
            </div>

            {/* Slider Container */}
            <div className="relative max-w-2xl mx-auto">
              {/* Card wrapper with padding to give arrows space */}
              <div className="px-12">
                <div
                  className="bg-paper border border-hair rounded-2xl p-8 flex flex-col justify-between shadow-sm relative min-h-[240px] transition-all duration-500 animate-in fade-in"
                  key={currentTestimonialIndex} // resets key on index change to trigger CSS animation
                >
                  <div>
                    <div className="flex gap-1 text-gold mb-6 text-base justify-center">
                      {'★'.repeat(testimonials[currentTestimonialIndex].rating)}{'☆'.repeat(5 - testimonials[currentTestimonialIndex].rating)}
                    </div>
                    <p className="text-muted italic text-center text-sm md:text-base leading-relaxed">
                      "{testimonials[currentTestimonialIndex].content}"
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-hair/50">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-teal-light border">
                      {testimonials[currentTestimonialIndex].avatar ? (
                        <img
                          src={testimonials[currentTestimonialIndex].avatar.startsWith('http') ? testimonials[currentTestimonialIndex].avatar : `${BASE_URL}${testimonials[currentTestimonialIndex].avatar}`}
                          alt={testimonials[currentTestimonialIndex].name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-display text-teal text-sm font-bold bg-teal-light">
                          {testimonials[currentTestimonialIndex].name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm text-ink">{testimonials[currentTestimonialIndex].name}</h4>
                      <p className="text-xs text-muted font-mono">{testimonials[currentTestimonialIndex].role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prev Button */}
              <button
                onClick={() =>
                  setCurrentTestimonialIndex((prev) =>
                    prev === 0 ? testimonials.length - 1 : prev - 1
                  )
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-hair w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-teal hover:text-white hover:border-teal transition-all shadow-sm focus:outline-none"
              >
                ←
              </button>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentTestimonialIndex((prev) =>
                    prev === testimonials.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-hair w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-teal hover:text-white hover:border-teal transition-all shadow-sm focus:outline-none"
              >
                →
              </button>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonialIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                    currentTestimonialIndex === idx ? 'bg-teal w-6' : 'bg-hair hover:bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Jobs / Careers Section */}
      <section className="max-w-6xl mx-auto px-5 py-24 border-t border-hair">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-3">Careers</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink font-semibold">Current Openings</h2>
          </div>
          <Link to="/jobs" className="font-mono text-xs uppercase tracking-wider text-teal hover:underline font-bold">
            View all jobs →
          </Link>
        </div>

        {latestJobs.length === 0 ? (
          <p className="text-muted">No jobs posted yet — check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* About strip */}
      <section className="bg-teal-light border-t border-hair py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-teal mb-4">About JobPortal</p>
          <h2 className="font-display text-3xl text-ink mb-4 font-semibold">
            We built this for people, not resumes.
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            JobPortal connects talented candidates with companies that are actually hiring —
            no dead listings, no guesswork. Post a role in minutes, apply in seconds.
          </p>
        </div>
      </section>
    </div>
  );
}
