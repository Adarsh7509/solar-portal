import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface Project {
  id: string;
  name: string;
  category: 'commercial' | 'residential';
  capacity: string;
  image: string;
  description: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-1',
    name: 'Poonam Dhakad - 5kW PM Surya Ghar Roof',
    category: 'residential',
    capacity: '5 kW',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=60',
    description: 'Residential rooftop solar system under PM Surya Ghar Muft Bijli Yojana in Jaipur, Rajasthan. Saves over 90% on monthly electricity bill.'
  },
  {
    id: 'proj-2',
    name: 'Saurabh Kumawat - 10kW Commercial Array',
    category: 'commercial',
    capacity: '10 kW',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60',
    description: 'Commercial net-metered solar plant installed for retail facility, reducing operational costs and carbon footprint.'
  },
  {
    id: 'proj-3',
    name: 'Suman Bunker - 5kW PM Surya Ghar Roof',
    category: 'residential',
    capacity: '5 kW',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60',
    description: 'On-grid rooftop solar plant installed with high-efficiency mono PERC half-cut solar panels.'
  },
  {
    id: 'proj-4',
    name: 'Rajesh Sharma - 15kW Business Setup',
    category: 'commercial',
    capacity: '15 kW',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
    description: 'Heavy duty load optimized commercial rooftop structure for a manufacturing workshop.'
  },
  {
    id: 'proj-5',
    name: 'Sunita Patel - 3kW Residential System',
    category: 'residential',
    capacity: '3 kW',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=60',
    description: 'Compact high efficiency residential installation delivering zero-bill performance for small family.'
  },
  {
    id: 'proj-6',
    name: 'GreenTech Industries - 100kW Industrial Plant',
    category: 'commercial',
    capacity: '100 kW',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60',
    description: 'Massive utility scale rooftop installation on warehouse shed utilizing accelerated depreciation tax benefits.'
  }
];

export function OurProjects() {
  const [filter, setFilter] = useState<'all' | 'commercial' | 'residential'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS_DATA.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <section id="projects" className="py-20 px-6 bg-[#070b13] border-t border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto space-y-12">
        {/* Section Title */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block">
              PURE ENERGY, PURE FUTURE
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              OUR LATEST PROJECT
            </h2>
            <div className="h-1 w-12 bg-yellow-500 mx-auto rounded-full mt-2" />
          </div>
        </ScrollReveal>

        {/* Tab Filters */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 text-xs font-extrabold rounded-xl transition duration-300 cursor-pointer ${
                filter === 'all'
                  ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('commercial')}
              className={`px-6 py-2.5 text-xs font-extrabold rounded-xl transition duration-300 cursor-pointer ${
                filter === 'commercial'
                  ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Commercial Project
            </button>
            <button
              onClick={() => setFilter('residential')}
              className={`px-6 py-2.5 text-xs font-extrabold rounded-xl transition duration-300 cursor-pointer ${
                filter === 'residential'
                  ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Residential Project
            </button>
          </div>
        </ScrollReveal>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={idx * 50}>
              <div className="group bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl hover:border-slate-800 transition duration-300 flex flex-col h-full">
                {/* Project Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/10 transition-colors duration-300" />
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-slate-950/80 border border-slate-800 text-[10px] font-bold text-yellow-500 uppercase px-2.5 py-1 rounded-lg">
                    {project.category === 'commercial' ? 'Commercial' : 'Residential'}
                  </div>
                </div>

                {/* Info Orange Block */}
                <div className="bg-amber-500 p-5 flex flex-col justify-between flex-1 text-slate-950">
                  <div>
                    <h3 className="font-extrabold text-base text-white leading-snug line-clamp-2">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/20">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline cursor-pointer"
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-black text-white bg-slate-950/30 px-3 py-1 rounded-full">
                      {project.capacity}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in">
            <div className="relative h-64">
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-slate-950 hover:bg-slate-800 text-white rounded-full p-2 h-9 w-9 flex items-center justify-center cursor-pointer transition border border-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">
                  {selectedProject.category} Project
                </span>
                <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
                  Capacity: {selectedProject.capacity}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{selectedProject.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {selectedProject.description}
              </p>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
