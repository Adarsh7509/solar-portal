import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { OurProjects } from './components/OurProjects';
import { RequestSurveyForm } from './components/RequestSurveyForm';
import { ScrollReveal } from './components/ScrollReveal';
import tnsLogoImg from './tns_logo.png';
import { 
  Sun, 
  Shield, 
  Award, 
  Landmark, 
  CheckCircle, 
  Menu, 
  X, 
  ChevronRight, 
  Info, 
  Flame, 
  Grid, 
  PhoneCall, 
  Globe,
  Mail,
  ArrowRight,
  Sparkles,
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
  Moon,
  MapPin,
  Star,
} from 'lucide-react';

const SLIDES = [
  {
    title: "TNS Roof: Solar Energy for Homes",
    description: "Save up to 90% on electricity bills with government benefits and high-quality solar panel setups.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&auto=format&fit=crop&q=80",
    badge: "PM Surya Ghar Approved",
    tagline: "Reduce Bills to Zero"
  },
  {
    title: "Solar Systems for Offices & Factories",
    description: "Lower your carbon footprint and get stable, cheaper electricity rates for your business.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1600&auto=format&fit=crop&q=80",
    badge: "Business Solar Setup",
    tagline: "Commercial Energy Security"
  }
];

const SOLUTIONS = [
  {
    id: 'residential',
    title: 'Residential Solar Roofs',
    desc: 'Power your home with smart solar setups. Keep your electricity bills near zero.',
    features: ['Get direct government subsidy up to ₹78,000', 'Sell extra power back to the grid', '25-year performance warranty'],
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'commercial',
    title: 'Commercial & Industrial Solar',
    desc: 'Use empty rooftop space on warehouses and factories to save massive amounts of money.',
    features: ['Special tax saving benefits', 'No-upfront-cost options available', 'Strong, high-wind resistant design'],
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'pumps',
    title: 'Solar Water Pumps',
    desc: 'Water pump systems for farms and rural areas that run completely on solar power without grid electricity.',
    features: ['Works without grid power connection', 'Long-lasting and highly reliable pumps', 'Eligible for government support'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'large',
    title: 'Large Solar Projects',
    desc: 'Complete setup and care for solar parks, from land planning to grid connection.',
    features: ['Smart layouts to fit maximum panels', 'Complete power grid connection support', '24/7 remote performance tracking'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60'
  }
];

function TNSLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <div className="flex items-baseline gap-0.5">
        <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-yellow-500 via-yellow-500 to-cyan-400 bg-clip-text text-transparent uppercase font-sans select-none">
          TNS
        </span>
        <span className="text-[9px] font-black text-cyan-400 self-start mt-0.5 ml-0.5 select-none">TM</span>
      </div>
      <svg className="w-16 h-2 mt-0.5" viewBox="0 0 60 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-wave-grad" x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <path 
          d="M1 4 C15 4, 20 6, 28 6 C33 6, 35 1, 38 1 C41 1, 43 7, 48 7 C53 7, 56 4, 59 4" 
          stroke="url(#logo-wave-grad)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const navigate = useNavigate();
  const location = useLocation();

  // Sync theme with HTML root document class for subcomponent v4 compatibility
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Prevent background scrolling when explore overlay is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle cross-page section navigation & smooth scroll
  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + sectionId);
      // Let home page scroll on mount
    } else {
      const el = document.querySelector(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Scroll to hash on page change (e.g. going from /request-survey back to /#solutions)
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const el = document.querySelector(location.hash);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  return (
    <div 
      className={`min-h-screen flex flex-col relative overflow-x-hidden selection:bg-yellow-500 selection:text-slate-950 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#070b13] text-slate-100 dark' : 'bg-white text-slate-900 light'
      }`}
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Pinned Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img 
              src={tnsLogoImg} 
              alt="TNS Logo" 
              className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-yellow-500/10 border border-slate-900/60 transition-transform duration-300 group-hover:scale-105"
            />
            <TNSLogo />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs xl:text-sm font-semibold text-slate-400">
            <Link to="/about" className="hover:text-yellow-500 transition-colors">About Us</Link>
            <button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none font-semibold font-sans text-xs xl:text-sm text-slate-400">Solutions</button>
            <button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none font-semibold font-sans text-xs xl:text-sm text-slate-400">Projects</button>
            <button onClick={() => handleNavClick('#benefits')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none font-semibold font-sans text-xs xl:text-sm text-slate-400">Why Solar</button>
            <button onClick={() => handleNavClick('#faq')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none font-semibold font-sans text-xs xl:text-sm text-slate-400">FAQs</button>
            <Link to="/request-survey" className="hover:text-yellow-500 transition-colors">Contact Us</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 bg-slate-950 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-900 rounded-xl text-yellow-500 transition duration-300 cursor-pointer shadow-lg flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile Menu Open */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 bg-slate-950 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-900 rounded-xl text-slate-200 transition duration-300 cursor-pointer shadow-lg shadow-slate-950/20 flex items-center justify-center"
              title="Open Menu"
            >
              <Menu className="h-4.5 w-4.5 text-yellow-500" />
            </button>

            <Link
              to="/request-survey"
              className="hidden sm:inline-block text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 shadow-md shadow-yellow-500/10 cursor-pointer glitter-border-btn-yellow"
            >
              Get Free Survey
            </Link>
          </div>
        </div>
      </header>

      {/* Floating Sidebar (Right Edge) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-35 flex flex-col bg-slate-950/90 border-l border-t border-b border-slate-800 rounded-l-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <a href="tel:+919509380380" className="p-3.5 hover:bg-yellow-500 hover:text-slate-950 text-slate-400 transition-colors group relative" title="Call Us">
          <PhoneCall className="h-5 w-5" />
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Call Himanshu (+91 95093 80380)
          </span>
        </a>
        <Link to="/request-survey" className="p-3.5 hover:bg-yellow-500 hover:text-slate-950 text-slate-400 transition-colors group relative border-t border-slate-900" title="Send Inquiry">
          <Mail className="h-5 w-5" />
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Send Inquiry
          </span>
        </Link>
      </div>

      {/* Main Pages Switcher */}
      <main className="flex-1 mt-[73px]">
        <Routes>
          <Route path="/" element={<Home handleNavClick={handleNavClick} />} />
          <Route path="/request-survey" element={<RequestSurveyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Shared Footer */}
      <footer className="relative border-t border-slate-900 overflow-hidden py-16 px-6 bg-slate-950">
        {/* Background Solar Farm Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#070b13]/93 backdrop-blur-[3px] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop&q=80" 
            alt="Solar Farm Background" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl w-full mx-auto relative z-10 space-y-12">
          {/* Main Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-[11px] text-slate-400">
            {/* Column 1: Brand info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 group">
                <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 shadow-lg group-hover:border-yellow-500/30 transition-all duration-300">
                  {/* Glowing background shape */}
                  <div className="absolute inset-0.5 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-20 blur-xs group-hover:opacity-40 transition-all duration-300" />
                  
                  {/* Lightning bolt logo */}
                  <svg className="h-5 w-5 text-yellow-500 relative z-10 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white tracking-wider font-serif">
                    TNS <span className="text-yellow-500 font-sans font-light">SYSTEMS</span>
                  </span>
                  <span className="text-[7px] text-slate-500 font-bold tracking-[0.25em] uppercase -mt-1 leading-none">
                    Clean Energy
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-xs">TNS Clean Energy Ltd</h4>
                <p className="text-[10px] text-slate-400 italic">Simplifying Solar</p>
              </div>
            </div>

            {/* Column 2: About TNS */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider">About TNS</h5>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/about" className="hover:text-yellow-500 transition-colors">Company</Link></li>
                <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-[11px]">Solar for Home</button></li>
                <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-[11px]">Solar for Business</button></li>
                <li><Link to="/request-survey" className="hover:text-yellow-500 transition-colors">Our Presence</Link></li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider">Quick Links</h5>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-[11px]">Our Portfolio</button></li>
                <li><Link to="/request-survey" className="hover:text-yellow-500 transition-colors">Partner with Us</Link></li>
                <li><Link to="/request-survey" className="hover:text-yellow-500 transition-colors">Service and Support</Link></li>
                <li><Link to="/about#milestones" className="hover:text-yellow-500 transition-colors">Milestones</Link></li>
                <li><Link to="/about#awards" className="hover:text-yellow-500 transition-colors">Awards</Link></li>
              </ul>
            </div>

            {/* Column 4: Let's Connect */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider">Let's Connect</h5>
              <ul className="space-y-2.5 text-slate-400">
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                  <a href="tel:+919509380380" className="hover:text-yellow-500 transition-colors font-semibold">+91 95093 80380</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                  <a href="mailto:himanshutikkar@gmail.com" className="hover:text-yellow-500 transition-colors font-medium">himanshutikkar@gmail.com</a>
                </li>
                <li className="pt-2 flex items-center gap-3 text-slate-400">
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Facebook className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Instagram className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Linkedin className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Youtube className="h-4 w-4" /></a>
                  <Link to="/request-survey" className="hover:text-yellow-500 transition-colors" title="Locate Us"><MapPin className="h-4 w-4" /></Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a href="#" className="hover:text-white transition-colors">Legal Disclaimer</a>
              <span className="text-slate-800">|</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-slate-800">|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
            <p className="text-center md:text-right">
              © TNS Systems Ltd. {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      {/* Explore Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl flex flex-col transition-all duration-500 ease-in-out ${
          isMenuOpen 
            ? 'opacity-100 pointer-events-auto translate-y-0' 
            : 'opacity-0 pointer-events-none -translate-y-8'
        }`}
      >
        {/* Menu Header */}
        <div className="border-b border-slate-900 px-6 py-4.5 flex items-center justify-between max-w-7xl w-full mx-auto">
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={(e) => {
              setIsMenuOpen(false);
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img 
              src={tnsLogoImg} 
              alt="TNS Logo" 
              className="h-10 w-10 rounded-xl object-cover border border-slate-900/60 transition-transform duration-300 group-hover:scale-105"
            />
            <TNSLogo />
          </Link>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 transition duration-300 font-bold text-sm cursor-pointer"
          >
            <X className="h-4 w-4 text-yellow-500" />
            <span>Close Menu</span>
          </button>
        </div>

        {/* Menu Columns Content */}
        <div className="flex-1 overflow-y-auto px-6 py-12">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            
            {/* About Us */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&auto=format&fit=crop&q=60" 
                  alt="About" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                />
                 <div>
                   <Link 
                     to="/about" 
                     onClick={() => setIsMenuOpen(false)}
                     className="text-sm font-extrabold text-white hover:text-yellow-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                   >
                     About Us <Info className="h-3.5 w-3.5 text-yellow-500" />
                   </Link>
                 </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                <li><Link to="/about#heritage" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Our Heritage <ChevronRight className="h-3 w-3" /></Link></li>
                <li><Link to="/about#vision" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Vision, Mission & Values <ChevronRight className="h-3 w-3" /></Link></li>
                <li><Link to="/about#milestones" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Company Milestones <ChevronRight className="h-3 w-3" /></Link></li>
                <li><Link to="/about#awards" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Awards & Recognition <ChevronRight className="h-3 w-3" /></Link></li>
              </ul>
            </div>

            {/* Rooftops */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=200&auto=format&fit=crop&q=60" 
                  alt="Rooftops" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                />
                 <div>
                   <button 
                     onClick={() => handleNavClick('#solutions')}
                     className="text-sm font-extrabold text-white hover:text-yellow-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 text-left font-sans"
                   >
                     Rooftops <Flame className="h-3.5 w-3.5 text-yellow-500" />
                   </button>
                 </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Residential Solar Roof <ChevronRight className="h-3 w-3" /></button></li>
                <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Commercial & Industrial <ChevronRight className="h-3 w-3" /></button></li>
                <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Institutional Solar <ChevronRight className="h-3 w-3" /></button></li>
                <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Solar Financing Options <ChevronRight className="h-3 w-3" /></button></li>
              </ul>
            </div>


            {/* Sustainability */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&auto=format&fit=crop&q=60" 
                  alt="Sustainability" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                />
                 <div>
                   <button 
                     onClick={() => handleNavClick('#benefits')}
                     className="text-sm font-extrabold text-white hover:text-yellow-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 text-left font-sans"
                   >
                     Sustainability <Globe className="h-3.5 w-3.5 text-yellow-500" />
                   </button>
                 </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Environmental Compliance <ChevronRight className="h-3 w-3" /></a></li>
                <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Health & Safety Standards <ChevronRight className="h-3 w-3" /></a></li>
                <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">CSR Initiatives <ChevronRight className="h-3 w-3" /></a></li>
              </ul>
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&auto=format&fit=crop&q=60" 
                  alt="Projects" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                />
                 <div>
                   <button 
                     onClick={() => handleNavClick('#projects')}
                     className="text-sm font-extrabold text-white hover:text-yellow-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 text-left font-sans"
                   >
                     Projects <Grid className="h-3.5 w-3.5 text-yellow-500" />
                   </button>
                 </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                <li><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Utility Scale EPC Solutions <ChevronRight className="h-3 w-3" /></button></li>
                <li><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Rooftop Project Portfolios <ChevronRight className="h-3 w-3" /></button></li>
                <li><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">International Deployments <ChevronRight className="h-3 w-3" /></button></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=200&auto=format&fit=crop&q=60" 
                  alt="Contact" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                />
                 <div>
                   <Link 
                     to="/request-survey" 
                     onClick={() => setIsMenuOpen(false)}
                     className="text-sm font-extrabold text-white hover:text-yellow-500 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                   >
                     Contact Us <PhoneCall className="h-3.5 w-3.5 text-yellow-500" />
                   </Link>
                 </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                <li><Link to="/request-survey" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Request Callback / Site Survey <ChevronRight className="h-3 w-3" /></Link></li>
                <li><Link to="/request-survey" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Regional Offices <ChevronRight className="h-3 w-3" /></Link></li>
                <li><Link to="/request-survey" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Registered Vendor Network <ChevronRight className="h-3 w-3" /></Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Homepage subcomponent
interface HomeProps {
  handleNavClick: (sectionId: string) => void;
}
function Home({ handleNavClick }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('residential');

  // Auto rotate hero slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Section Carousel */}
      <section className="relative w-full h-[650px] overflow-hidden border-b border-slate-900 hero-section">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-black/65 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms] ease-out"
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12 max-w-7xl mx-auto">
              <div className="max-w-3xl space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" /> {slide.badge}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                  {slide.tagline} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                    {slide.title}
                  </span>
                </h1>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/request-survey"
                    className="px-6 py-3 font-bold rounded-xl transition duration-200 shadow-lg shadow-yellow-500/20 glitter-border-btn-yellow"
                  >
                    Request Free Survey
                  </Link>
                  <button
                    onClick={() => handleNavClick('#solutions')}
                    className="px-6 py-3 font-bold rounded-xl transition duration-200 cursor-pointer glitter-border-btn"
                  >
                    Explore Solutions
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? 'w-8 bg-yellow-500' : 'w-2.5 bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Metrics & Feasibility Teaser Card */}
      <section className="max-w-7xl w-full mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <ScrollReveal direction="left">
            <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider block text-center lg:text-left">
              India's Reliable Vendor
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center lg:text-left mt-1.5">
              Transition Seamlessly to Green Energy
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-xl text-center lg:text-left mt-3">
              Get an expert structural assessment, shadow mapping layout, and billing ROI analysis completed by our tier-1 engineering partners.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900 max-w-md mx-auto lg:mx-0">
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-extrabold text-white">90%+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bill Cut</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-extrabold text-white">4.2 Yr</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Avg Payback</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-extrabold text-white">25 Yrs</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Warranty</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Instead of direct form, render a beautiful call-to-action teaser card */}
        <div className="lg:col-span-5 w-full">
          <ScrollReveal direction="right" delay={100}>
            <div className="w-full max-w-lg mx-auto bg-slate-950/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl text-left">
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                Feasibility Analysis
              </span>
              <h3 className="text-xl font-black text-white">Is your roof ready for solar power?</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Take the first step toward clean, zero-bill energy. Book a comprehensive physical site evaluation and shadow analysis with our expert engineering team today.
              </p>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Detailed satellite roof shadow assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Structural load calculation & layout planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>O&M and subsidy application support</span>
                </li>
              </ul>
              <Link
                to="/request-survey"
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-yellow-500/10 cursor-pointer text-center"
              >
                <span>Request Free Survey</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Solutions Tabs Section */}
      <section id="solutions" className="bg-[#0b0f19] border-t border-b border-slate-900 py-20 px-6">
        <div className="max-w-7xl w-full mx-auto space-y-12">
          
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Explore Solutions</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Solar Solutions for Every Need</h2>
              <p className="text-slate-400 text-sm">
                We engineer custom arrays for home roofs, commercial offices, rural farmlands, and utility grids.
              </p>
            </div>
          </ScrollReveal>

          {/* Tabs Selector Header */}
          <ScrollReveal direction="up" delay={150}>
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-900 pb-4">
              {SOLUTIONS.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setActiveTab(sol.id)}
                  className={`px-5 py-3 text-sm font-bold rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeTab === sol.id
                      ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-lg shadow-yellow-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  {sol.title}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Tab Content body */}
          {SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-500 ${
                activeTab === sol.id ? 'opacity-100 flex translate-y-0' : 'hidden opacity-0 translate-y-4'
              }`}
            >
              <div className="lg:col-span-6 space-y-6">
                <ScrollReveal direction="left" delay={250}>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">{sol.title}</h3>
                  <p className="text-slate-400 leading-relaxed mt-2">{sol.desc}</p>
                  <ul className="space-y-3.5 mt-5">
                    {sol.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Link
                      to="/request-survey"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-500 hover:text-yellow-400"
                    >
                      <span>Request Quotation</span> <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-slate-900 shadow-2xl relative h-[380px]">
                <ScrollReveal direction="right" delay={300}>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                  <img
                    src={sol.image}
                    alt={sol.title}
                    className="w-full h-full object-cover"
                  />
                </ScrollReveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Projects Section (Task 1) */}
      <OurProjects />

      {/* 4-Step Solar Journey */}
      <SolarJourney />



      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl w-full mx-auto px-6 py-20 border-t border-slate-900">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Why TNS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1.5">
              Engineered For Absolute Reliability
            </h2>
            <p className="text-slate-400">
              We handle everything from initial feasibility study to utility net-metering approvals and direct subsidy release.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal direction="up" delay={0}>
            <div className="p-6 bg-gradient-to-br from-slate-900/40 via-slate-950/30 to-slate-950/50 backdrop-blur-md border border-slate-900/60 rounded-2xl flex flex-col justify-between h-full hover:border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/5 hover:-translate-y-1 transition duration-300 relative group overflow-hidden space-y-4">
              <div className="absolute -inset-px bg-gradient-to-br from-yellow-500/0 via-transparent to-yellow-500/0 group-hover:from-yellow-500/[0.04] group-hover:to-yellow-500/[0.04] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 relative z-10 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">Tier-1 Equipment</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We exclusively use BloombergNEF Tier-1 mono-PERC half-cut solar panels with highest conversion cell efficiencies.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <div className="p-6 bg-gradient-to-br from-slate-900/40 via-slate-950/30 to-slate-950/50 backdrop-blur-md border border-slate-900/60 rounded-2xl flex flex-col justify-between h-full hover:border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/5 hover:-translate-y-1 transition duration-300 relative group overflow-hidden space-y-4">
              <div className="absolute -inset-px bg-gradient-to-br from-yellow-500/0 via-transparent to-yellow-500/0 group-hover:from-yellow-500/[0.04] group-hover:to-yellow-500/[0.04] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 relative z-10 shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">25-Year Protection</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our installations come backed by a 10-year workmanship warranty and a 25-year linear performance warranty.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400}>
            <div className="p-6 bg-gradient-to-br from-slate-900/40 via-slate-950/30 to-slate-950/50 backdrop-blur-md border border-slate-900/60 rounded-2xl flex flex-col justify-between h-full hover:border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/5 hover:-translate-y-1 transition duration-300 relative group overflow-hidden space-y-4">
              <div className="absolute -inset-px bg-gradient-to-br from-yellow-500/0 via-transparent to-yellow-500/0 group-hover:from-yellow-500/[0.04] group-hover:to-yellow-500/[0.04] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 relative z-10 shrink-0">
                <Landmark className="h-6 w-6" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">Subsidy Assistance</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We handle the entire PM Surya Ghar national portal filing, ensuring your subsidy reaches your bank account directly.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* FAQ Accordion Section */}
      <FAQSection />

      {/* Sky CTA Banner Section */}
      <section className="relative w-full py-20 px-6 overflow-hidden border-t border-slate-900 sky-banner-section">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-600/10 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1600&auto=format&fit=crop&q=80" 
            alt="Sky Background" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <ScrollReveal direction="left" className="max-w-2xl text-left sky-banner-text">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
              Want to know, which solar panel is made for you ? <br className="hidden sm:inline" />
              <span className="text-yellow-400">Ask our experts now</span>
            </h3>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <Link 
              to="/request-survey"
              className="h-16 w-16 rounded-full bg-white hover:bg-yellow-400 text-slate-950 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-yellow-400/20 group cursor-pointer"
              title="Ask Experts"
            >
              <Mail className="h-6 w-6 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

// Request Survey page component (Task 3)
function RequestSurveyPage() {
  return (
    <section className="py-16 px-6 max-w-7xl w-full mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
        <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block">
          TNS CLEAN ENERGY
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          CONTACT US & ENQUIRIES
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Reach out to our experts or fill out the form below. We are here to support your switch to solar.
        </p>
      </div>

      {/* Contact Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Main Office */}
        <div className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:border-yellow-500/30 hover:-translate-y-1">
          {/* Accent Line */}
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-cyan-500 to-yellow-500" />
          <div className="flex items-center gap-3.5 mb-4 mt-2">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-white text-base tracking-wide">Main Office</h3>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black text-yellow-500">Vaishali Nagar, Jaipur</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              49/4, Bajari Mandi Road, Vaishali Nagar, Jaipur, Rajasthan 302034
            </p>
          </div>
        </div>

        {/* Card 2: Make a Call */}
        <div className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:border-yellow-500/30 hover:-translate-y-1">
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-cyan-500 to-yellow-500" />
          <div className="flex items-center gap-3.5 mb-4 mt-2">
            <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-white text-base tracking-wide">Make a Call</h3>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black text-yellow-500">
              <a href="tel:+919509380380" className="hover:text-yellow-500 transition-colors">+91 95093 80380</a>
            </h4>
            <p className="text-slate-200 text-xs font-bold">Himanshu Tikkar</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Mon - Sat: 09am - 08pm
            </p>
          </div>
        </div>

        {/* Card 3: Send a Mail */}
        <div className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:border-yellow-500/30 hover:-translate-y-1">
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-cyan-500 to-yellow-500" />
          <div className="flex items-center gap-3.5 mb-4 mt-2">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-white text-base tracking-wide">Send a Mail</h3>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black text-yellow-500">
              <a href="mailto:himanshutikkar@gmail.com" className="hover:text-yellow-500 transition-colors">himanshutikkar@gmail.com</a>
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              himanshutikkar@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Form Switcher */}
      <RequestSurveyForm />

      {/* Map Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase">Our Location Map</h3>
        <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-slate-900 shadow-2xl relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.7347690623253!2d75.72798991502447!3d26.911833983126743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db406a4d7d13b%3A0xe54dcf9c4b7b2507!2sVaishali%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302021!5e0!3m2!1sen!2sin!4v1689123456789!5m2!1sen!2sin"
            className="w-full h-full border-0 filter invert-[0.9] hue-rotate-[180deg] opacity-80 hover:opacity-100 transition-opacity duration-300"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

// About Us Page Component
function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);

  return (
    <section className="py-16 px-6 max-w-7xl w-full mx-auto space-y-20">
      {/* About Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block">
          TNS Clean Energy
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          WHO WE ARE
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          We help families and businesses switch to solar energy. Our team makes it simple to save money and protect the planet.
        </p>
      </div>

      {/* Heritage Section */}
      <div id="heritage" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-slate-900 pt-16">
        <ScrollReveal direction="left">
          <div className="space-y-6">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block">Our Story</span>
            <h2 className="text-3xl font-extrabold text-white">Our Heritage</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              TNS was started with a simple idea: solar power should be easy and cheap for everyone. We began as a small team of engineers who wanted to change how people use energy.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Over the years, we have grown into a trusted solar helper. We have installed solar panels on hundreds of roofs, helping local homes and big factories run on clean energy.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60" 
              alt="Our Heritage" 
              className="w-full h-[320px] object-cover"
            />
          </div>
        </ScrollReveal>
      </div>

      {/* Vision, Mission & Values Section */}
      <div id="vision" className="border-t border-slate-900 pt-16 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block mb-2">Our Goal</span>
          <h2 className="text-3xl font-extrabold text-white">Vision, Mission & Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal direction="up" delay={0}>
            <div className="p-6 bg-slate-900/10 border border-slate-900 rounded-2xl space-y-4 h-full">
              <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Vision</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                To build a world where every building runs on clean, free power from the sun.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100}>
            <div className="p-6 bg-slate-900/10 border border-slate-900 rounded-2xl space-y-4 h-full">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Mission</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                To provide high-quality solar setups, simple customer support, and honest services.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="p-6 bg-slate-900/10 border border-slate-900 rounded-2xl space-y-4 h-full">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Values</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                We believe in trust, hard work, safety, and being kind to the environment.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Milestones Section */}
      <div id="milestones" className="border-t border-slate-900 pt-16 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block mb-2">Our Growth</span>
          <h2 className="text-3xl font-extrabold text-white">Company Milestones</h2>
        </div>
        <div className="relative border-l border-slate-900 max-w-3xl mx-auto pl-6 space-y-12">
          <ScrollReveal direction="left" delay={0}>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-yellow-500 border-4 border-slate-950" />
              <h3 className="text-lg font-bold text-white">2018 - Company Founded</h3>
              <p className="text-slate-400 text-xs mt-1">We started TNS Clean Energy with just 5 engineers and a dream to popularize solar roofs.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={100}>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-cyan-400 border-4 border-slate-950" />
              <h3 className="text-lg font-bold text-white">2020 - 500+ Homes Powered</h3>
              <p className="text-slate-400 text-xs mt-1">Helped hundreds of families switch to solar, saving them thousands of rupees in power bills.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={200}>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-emerald-400 border-4 border-slate-950" />
              <h3 className="text-lg font-bold text-white">2022 - Large Scale Solar Setup</h3>
              <p className="text-slate-400 text-xs mt-1">Began building large commercial setups and factory roofs to support business operations.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={300}>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-yellow-500 border-4 border-slate-950" />
              <h3 className="text-lg font-bold text-white">2025 - Government Partner status</h3>
              <p className="text-slate-400 text-xs mt-1">Officially approved to install solar under PM Surya Ghar government subsidy schemes.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Awards & Recognition Section */}
      <div id="awards" className="border-t border-slate-900 pt-16 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block mb-2">Our Achievements</span>
          <h2 className="text-3xl font-extrabold text-white">Awards & Recognition</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0}>
            <div className="p-6 bg-slate-900/10 border border-slate-900 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Top Solar Service Partner</h4>
                <p className="text-slate-400 text-xs">Awarded for high-quality setups and great support responses in the region.</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100}>
            <div className="p-6 bg-slate-900/10 border border-slate-900 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Certified Safe Installers</h4>
                <p className="text-slate-400 text-xs">100% clean safety record during roof structure setups and power grid connections.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

// Reviews Component
function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  const loadReviews = () => {
    const dummy = [
      {
        id: 1,
        name: "Aarav Mehta",
        city: "Jaipur",
        rating: 5,
        comment: "Amazing service! TNS helped us reduce our electricity bill to almost zero. The installation was very professional.",
        date: "12 May 2026"
      },
      {
        id: 2,
        name: "Priya Sharma",
        city: "Jaipur",
        rating: 5,
        comment: "Very happy with the solar water pump we installed on our farm. Extremely reliable and works without any grid power.",
        date: "28 Apr 2026"
      },
      {
        id: 3,
        name: "Amit Verma",
        city: "Jaipur",
        rating: 4,
        comment: "Excellent customer service and support team. They handled all the government subsidy paperwork for us.",
        date: "15 Apr 2026"
      },
      {
        id: 4,
        name: "Neha Gupta",
        city: "Jaipur",
        rating: 5,
        comment: "Top-notch panel quality. The structural setup is sturdy, and the power generation is very consistent.",
        date: "02 Apr 2026"
      },
      {
        id: 5,
        name: "Rahul Singh",
        city: "Jaipur",
        rating: 5,
        comment: "Installed a 5kW system for our home. The team was quick, clean, and extremely knowledgeable about net metering.",
        date: "20 Mar 2026"
      },
      {
        id: 6,
        name: "Divya Patel",
        city: "Jaipur",
        rating: 4,
        comment: "Highly recommend TNS Clean Energy. The savings are real and the system is very easy to monitor.",
        date: "05 Mar 2026"
      },
      {
        id: 7,
        name: "Sanjay Sharma",
        city: "Jaipur",
        rating: 5,
        comment: "Great experience from start to finish. Himanshu and the team resolved all queries instantly.",
        date: "18 Feb 2026"
      }
    ];

    const localReviews = JSON.parse(localStorage.getItem('tns_customer_reviews') || '[]');
    setReviews([...localReviews, ...dummy]);
  };

  useEffect(() => {
    loadReviews();
    window.addEventListener('tns_reviews_updated', loadReviews);
    return () => window.removeEventListener('tns_reviews_updated', loadReviews);
  }, []);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <section className="max-w-7xl w-full mx-auto px-6 py-20 border-t border-slate-900">
      <ScrollReveal direction="up">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1.5">
            What Our Customers Say
          </h2>
          <p className="text-slate-400">
            Real feedback from homeowners and businesses who switched to TNS Clean Energy.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleReviews.map((rev, index) => (
          <ScrollReveal key={rev.id} direction="up" delay={index * 50}>
            <div className="p-6 bg-gradient-to-br from-slate-900/40 via-slate-950/30 to-slate-950/50 backdrop-blur-md border border-slate-900/60 rounded-2xl flex flex-col justify-between h-full hover:border-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/5 hover:-translate-y-1 transition duration-300 relative group overflow-hidden">
              {/* Background gradient subtle glow */}
              <div className="absolute -inset-px bg-gradient-to-br from-yellow-500/0 via-transparent to-yellow-500/0 group-hover:from-yellow-500/[0.04] group-hover:to-yellow-500/[0.04] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Giant quote watermark */}
              <span className="absolute right-4 top-2 text-7xl font-serif text-yellow-500/[0.03] group-hover:text-yellow-500/[0.06] transition-colors duration-300 pointer-events-none select-none">“</span>
 
              <div className="space-y-4 relative z-10">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3.5 w-3.5 ${i < rev.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-800'}`} 
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-900/80 relative z-10">
                <div className="flex items-center gap-2.5">
                  {/* Initials Avatar */}
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 flex items-center justify-center text-yellow-400 font-extrabold text-[10px] uppercase shrink-0 shadow-inner">
                    {rev.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">{rev.name}</h4>
                    <span className="text-[9px] text-slate-500 font-medium">{rev.city}</span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500">{rev.date}</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {reviews.length > 6 && (
        <div className="text-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 text-xs font-bold rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:text-white transition duration-300 cursor-pointer"
          >
            {showAll ? 'Show Less' : 'Show All Reviews'}
          </button>
        </div>
      )}
    </section>
  );
}

// 4-Step Solar Journey
function SolarJourney() {
  const steps = [
    {
      no: "01",
      title: "Free Roof Audit",
      desc: "Our expert surveyors visit your site in Jaipur to conduct shade analysis, measure area, and check structural viability."
    },
    {
      no: "02",
      title: "Custom Engineering",
      desc: "Our design engineers create a customized 3D solar layout optimizing cell angles for maximum solar irradiance capture."
    },
    {
      no: "03",
      title: "Seamless Setup",
      desc: "We handle panel mounting, electrical safety cabling, inverter integration, and complete net-metering approvals."
    },
    {
      no: "04",
      title: "Subsidy Approval",
      desc: "We file the required paperwork on the national solar portal so the PM Surya Ghar subsidy is directly released to your account."
    }
  ];

  return (
    <section className="max-w-7xl w-full mx-auto px-6 py-20 border-t border-slate-900">
      <ScrollReveal direction="up">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Process Flow</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1.5">
            Your 4-Step Journey to Solar Power
          </h2>
          <p className="text-slate-400">
            How we guide you from initial rooftop consultation to system turn-on and government subsidy release.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {steps.map((step, idx) => (
          <ScrollReveal key={idx} direction="up" delay={idx * 100}>
            <div className="relative p-6 bg-gradient-to-br from-slate-900/20 via-slate-950/10 to-slate-950/30 border border-slate-900/60 rounded-2xl hover:border-slate-800 transition duration-300 h-full flex flex-col justify-between group overflow-hidden">
              {/* Step Line connector (only on medium screens and up, for first 3 items) */}
              {idx < 3 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-yellow-500/30 to-transparent z-0 pointer-events-none" />
              )}
              
              <div className="space-y-4 relative z-10">
                <span className="text-3xl font-black text-yellow-500/20 group-hover:text-yellow-500/40 transition-colors duration-300 block font-mono">{step.no}</span>
                <h3 className="text-base font-bold text-white group-hover:text-yellow-500 transition-colors duration-300">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

// FAQ Accordion Section
function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How much government subsidy is available for home solar?",
      a: "Under the PM Surya Ghar National Portal, residential rooftop solar systems receive ₹30,000 for 1 kW, ₹60,000 for 2 kW, and a maximum of ₹78,000 for 3 kW or higher capacities. TNS Clean Energy handles the entire registration and documentation to ensure the subsidy is credited directly to your bank account."
    },
    {
      q: "What is Net-Metering and how does it benefit me?",
      a: "Net-metering is a utility billing mechanism that monitors the solar energy you feed back into the government power grid (such as JVVNL in Rajasthan). When your system produces excess electricity (e.g., during peak afternoon sun), your meter runs backward, earning you energy credits that reduce your monthly power bill."
    },
    {
      q: "How much roof space is required for solar installation?",
      a: "On average, a 1 kW solar array requires approximately 100 square feet of shadow-free rooftop area. For a standard 3 kW residential setup, you will need around 300 square feet of clear, unshaded space."
    },
    {
      q: "What kind of maintenance does a solar system require?",
      a: "Solar PV systems are highly durable and have no moving parts, so maintenance is minimal. Regularly washing the panels with clean water to clear dust and bird droppings ensures they operate at peak efficiency. TNS also provides periodic system health audits."
    },
    {
      q: "Will my solar panels generate electricity on cloudy or rainy days?",
      a: "Yes, solar panels still generate power during cloudy or overcast conditions by capturing diffused daylight. However, the output will be lower (typically 10% to 25% of peak capacity) compared to bright sunny days."
    }
  ];

  return (
    <section id="faq" className="max-w-4xl w-full mx-auto px-6 py-20 border-t border-slate-900">
      <ScrollReveal direction="up">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white mt-1.5">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Find answers to common questions about PM Surya Ghar subsidies, installation, net-metering, and maintenance.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <ScrollReveal key={idx} direction="up" delay={idx * 50}>
            <div className="border border-slate-900 bg-slate-950/40 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-800">
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-bold text-sm md:text-base hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-0"
              >
                <span>{faq.q}</span>
                <span className={`text-yellow-500 font-sans text-xl transform transition-transform duration-300 ${activeIndex === idx ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === idx ? 'max-h-60 border-t border-slate-900/60' : 'max-h-0'
                }`}
              >
                <p className="px-6 py-4.5 text-xs md:text-sm text-slate-400 leading-relaxed bg-slate-900/10">
                  {faq.a}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default App;
