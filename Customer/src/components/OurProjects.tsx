import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin, Zap, Eye, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  category: 'commercial' | 'residential';
  capacity: string;
  image: string;
  location: string;
  description: string;
  isFeatured?: boolean;
}

export const ALL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Nihal Chand Commercial Solar Plant',
    client: 'Nihal Chand',
    category: 'commercial',
    capacity: '25 kW',
    image: '/projects/project_03_nihal_chand_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Commercial rooftop net-metered solar plant with high-efficiency mono PERC half-cut solar panels and galvanized structure.',
    isFeatured: true
  },
  {
    id: 'proj-2',
    name: 'Sarbai High-Capacity Commercial Array',
    client: 'Sarbai Industrial',
    category: 'commercial',
    capacity: '50 kW',
    image: '/projects/project_26_sarbai_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Large commercial rooftop solar installation with high-wind resistance mounting system for business energy cost reduction.',
    isFeatured: true
  },
  {
    id: 'proj-3',
    name: 'Ravi Rooftop Solar Plant',
    client: 'Ravi Sharma',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_06_planht_photo_ravi.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Residential rooftop solar system under PM Surya Ghar Muft Bijli Yojana, cutting monthly grid power bills by over 90%.',
    isFeatured: true
  },
  {
    id: 'proj-4',
    name: 'Commercial Solar Facility - Plant 04',
    client: 'Commercial Enterprise',
    category: 'commercial',
    capacity: '30 kW',
    image: '/projects/project_04_p0lant_photo.jpg',
    location: 'Rajasthan',
    description: 'Heavy duty commercial rooftop setup optimized for daytime industrial power demand and net-metering credits.',
    isFeatured: true
  },
  {
    id: 'proj-5',
    name: 'Usha Devi Solar Installation',
    client: 'Usha Devi',
    category: 'residential',
    capacity: '6 kW',
    image: '/projects/project_29_usha_devi_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'High-yield residential solar roof with smart micro-inverter monitoring and 25-year performance warranty.',
    isFeatured: true
  },
  {
    id: 'proj-6',
    name: 'Gopal Lal Mahawar Commercial Solar',
    client: 'Gopal Lal Mahawar',
    category: 'commercial',
    capacity: '15 kW',
    image: '/projects/project_02_gopal_lal_mahawar_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'On-grid rooftop solar system for commercial facility ensuring round-the-clock clean electricity generation.',
    isFeatured: true
  },
  {
    id: 'proj-7',
    name: 'Dhuri Lal Solar System',
    client: 'Dhuri Lal',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_01_dhuri_lal_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Compact rooftop solar PV system installed with PM Surya Ghar government subsidy release.'
  },
  {
    id: 'proj-8',
    name: 'Sunil Israni Commercial Solar Plant',
    client: 'Sunil Israni',
    category: 'commercial',
    capacity: '20 kW',
    image: '/projects/project_28_sunil_israni_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Custom engineered commercial rooftop array with elevated structural height to maximize shade-free solar exposure.'
  },
  {
    id: 'proj-9',
    name: 'Saroj Devi Rooftop Solar',
    client: 'Saroj Devi',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_27_saroj_devi_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Residential solar setup delivering clean energy and zero grid dependency during peak daylight hours.'
  },
  {
    id: 'proj-10',
    name: 'Sambhu Singh Solar Project',
    client: 'Sambhu Singh',
    category: 'residential',
    capacity: '7 kW',
    image: '/projects/project_25_sambhu_singh_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'On-grid rooftop solar plant with bidirectional net meter integration and automated surge protection.'
  },
  {
    id: 'proj-11',
    name: 'Bharat Lal Solar Installation',
    client: 'Bharat Lal',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_14_plant_photo_bharatlal.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Rooftop solar installation designed for harsh weather durability and long term reliability.'
  },
  {
    id: 'proj-12',
    name: 'Rajesh Solar Setup',
    client: 'Rajesh',
    category: 'residential',
    capacity: '4 kW',
    image: '/projects/project_15_plant_photo_rajesh.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Efficient home solar system operating seamlessly under Rajasthan state power grid DISCOM regulations.'
  },
  {
    id: 'proj-13',
    name: 'Commercial Solar Facility - Plant 05',
    client: 'TNS Industrial Partner',
    category: 'commercial',
    capacity: '40 kW',
    image: '/projects/project_05_plaknt_photo.jpg',
    location: 'Rajasthan',
    description: 'Industrial warehouse rooftop solar array lowering peak tariff demand charges.'
  },
  {
    id: 'proj-14',
    name: 'Solar Array - Plant 07',
    client: 'TNS Client',
    category: 'residential',
    capacity: '6 kW',
    image: '/projects/project_07_plant_dphoto.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'High-performance solar roof providing continuous energy yield throughout seasons.'
  },
  {
    id: 'proj-15',
    name: 'Rooftop Plant 08',
    client: 'TNS Client',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_08_plant_lphoto.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Residential clean power installation with fast payback period and minimal maintenance overhead.'
  },
  {
    id: 'proj-16',
    name: 'Solar System - Plant 09',
    client: 'TNS Client',
    category: 'residential',
    capacity: '8 kW',
    image: '/projects/project_09_plant_pgoto.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Enhanced capacity residential solar plant configured with digital mobile app performance monitoring.'
  },
  {
    id: 'proj-17',
    name: 'Solar Plant 10',
    client: 'TNS Client',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_10_plant_phojto.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Rooftop solar setup equipped with IP67 rated string inverters and lightning arrestors.'
  },
  {
    id: 'proj-18',
    name: 'Commercial Plant 11',
    client: 'TNS Commercial Client',
    category: 'commercial',
    capacity: '35 kW',
    image: '/projects/project_11_plant_photdo.jpg',
    location: 'Rajasthan',
    description: 'Large commercial rooftop solar system optimizing idle roof space for green energy generation.'
  },
  {
    id: 'proj-19',
    name: 'Rooftop Solar Plant 12',
    client: 'TNS Client',
    category: 'residential',
    capacity: '3 kW',
    image: '/projects/project_12_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'PM Surya Ghar residential installation delivering direct bill relief for urban family residence.'
  },
  {
    id: 'proj-20',
    name: 'Rooftop Solar Plant 13',
    client: 'TNS Client',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_13_plant_photo_2.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Sleek solar panel installation with rust-proof anodized aluminum structures.'
  },
  {
    id: 'proj-21',
    name: 'Solar Plant 17',
    client: 'Commercial Facility',
    category: 'commercial',
    capacity: '18 kW',
    image: '/projects/project_17_plant_photo4.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Commercial building rooftop power plant designed for heavy daytime air-conditioning loads.'
  },
  {
    id: 'proj-22',
    name: 'Solar Roof Plant 18',
    client: 'TNS Client',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_18_plant_photo6.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Residential rooftop solar plant configured with dual-axis structural tilts for optimal sun capture.'
  },
  {
    id: 'proj-23',
    name: 'Solar Roof Plant 19',
    client: 'TNS Client',
    category: 'residential',
    capacity: '6 kW',
    image: '/projects/project_19_plant_photoc.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Net-metered residential rooftop installation ensuring maximum export energy credits.'
  },
  {
    id: 'proj-24',
    name: 'Commercial Plant 20',
    client: 'Industrial Partner',
    category: 'commercial',
    capacity: '45 kW',
    image: '/projects/project_20_plant_phrroto.jpg',
    location: 'Rajasthan',
    description: 'High-output commercial rooftop solar array lowering corporate carbon footprint.'
  },
  {
    id: 'proj-25',
    name: 'Solar System 21',
    client: 'TNS Client',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_21_plantd_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Rooftop solar setup designed to operate reliably under extreme summer heat conditions.'
  },
  {
    id: 'proj-26',
    name: 'Solar System 22',
    client: 'TNS Client',
    category: 'residential',
    capacity: '4 kW',
    image: '/projects/project_22_plapnt_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Clean residential solar PV installation providing quiet, sustainable power.'
  },
  {
    id: 'proj-27',
    name: 'Solar System 23',
    client: 'TNS Client',
    category: 'residential',
    capacity: '5 kW',
    image: '/projects/project_23_plasnt_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'High durability residential solar setup with full net meter integration approval.'
  },
  {
    id: 'proj-28',
    name: 'Solar System 24',
    client: 'Commercial Complex',
    category: 'commercial',
    capacity: '12 kW',
    image: '/projects/project_24_plgant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Commercial rooftop system engineered for commercial complex building operations.'
  },
  {
    id: 'proj-29',
    name: 'Rooftop System 16',
    client: 'TNS Client',
    category: 'residential',
    capacity: '3 kW',
    image: '/projects/project_16_plant_photo.jpg',
    location: 'Jaipur, Rajasthan',
    description: 'Compact 3kW residential rooftop system approved for government subsidy under PM Surya Ghar.'
  }
];

interface OurProjectsProps {
  featuredOnly?: boolean;
}

export function OurProjects({ featuredOnly = false }: OurProjectsProps) {
  const [filter, setFilter] = useState<'all' | 'commercial' | 'residential'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const navigate = useNavigate();

  // Filter projects logic
  const filteredProjects = useMemo(() => {
    let list = featuredOnly ? ALL_PROJECTS.filter(p => p.isFeatured) : ALL_PROJECTS;
    
    if (filter !== 'all') {
      list = list.filter(p => p.category === filter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.client.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.capacity.toLowerCase().includes(term)
      );
    }

    return list;
  }, [featuredOnly, filter, searchTerm]);

  return (
    <section id="projects" className="py-20 px-6 bg-[#070b13] border-t border-slate-900 transition-colors duration-300 relative">
      <div className="max-w-7xl w-full mx-auto space-y-12">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-extrabold text-[11px] uppercase tracking-widest shadow-sm">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span>Real Customer Installations</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              OUR INSTALLED PROJECTS
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-amber-400 mx-auto rounded-full" />
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Explore our verified rooftop solar installations across Rajasthan, powering homes, commercial complexes, and industrial sites.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Controls & Search (Full Page View) */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            
            {/* Filter Tabs */}
            <div className="flex items-center justify-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setFilter('all')}
                className="px-5 py-2.5 text-xs font-extrabold rounded-xl transition duration-300 cursor-pointer bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/20"
              >
                <span>All Installed Projects</span>
              </button>
            </div>

            {/* Search Input (Only when viewing full page or searching) */}
            {!featuredOnly && (
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search project or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={idx * 40}>
              <div className="group bg-gradient-to-b from-slate-900/60 to-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 flex flex-col h-full relative">
                
                {/* Image Box */}
                <div 
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-slate-950"
                  onClick={() => setSelectedProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full backdrop-blur-md border shadow-md ${
                      project.category === 'commercial' 
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                        : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    }`}>
                      {project.category === 'commercial' ? 'Commercial & Industrial' : 'PM Surya Ghar Residential'}
                    </span>
                    <span className="bg-slate-950/80 border border-slate-800 text-[10px] font-black text-yellow-400 px-2.5 py-1 rounded-full backdrop-blur-md">
                      {project.capacity}
                    </span>
                  </div>

                  {/* Eye icon zoom preview badge on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-[2px]">
                    <span className="px-4 py-2 bg-yellow-500 text-slate-950 font-bold text-xs rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="h-4 w-4" /> View Installation
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                      <span>{project.location}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-yellow-400 transition-colors leading-snug">
                      {project.name}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:text-yellow-300 cursor-pointer bg-transparent border-none p-0"
                    >
                      <span>Project Specs</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      to="/request-survey"
                      className="text-[10px] font-extrabold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition"
                    >
                      Get Similar Setup
                    </Link>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Homepage "Show All Projects" Button */}
        {featuredOnly && (
          <ScrollReveal direction="up">
            <div className="text-center pt-8">
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-yellow-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group uppercase tracking-wider"
              >
                <span>SHOW ALL PROJECTS</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>
        )}

      </div>

      {/* Lightbox / Modal for Project Details */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Header Image */}
            <div className="relative h-72 sm:h-96 w-full bg-slate-950 shrink-0">
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/60" />
              
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-yellow-500 hover:text-slate-950 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center cursor-pointer transition border border-slate-800 backdrop-blur-md shadow-lg"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-slate-950/90 border border-yellow-500/40 text-yellow-400 font-extrabold text-xs tracking-wide uppercase backdrop-blur-md">
                  {selectedProject.category === 'commercial' ? 'Commercial & Industrial' : 'Residential PM Surya Ghar'}
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-500 text-slate-950 font-black text-xs shadow-md">
                  Capacity: {selectedProject.capacity}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-yellow-500 uppercase tracking-widest">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{selectedProject.location}</span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedProject.name}</h3>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-500 shrink-0" />
                  <span>Net-Metering Approved</span>
                </div>
                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-500 shrink-0" />
                  <span>25-Yr Performance Guarantee</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-3 text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  Close Preview
                </button>
                <Link
                  to="/request-survey"
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-yellow-500/20 transition flex items-center gap-2"
                >
                  <span>Book On-Call Consultation</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
