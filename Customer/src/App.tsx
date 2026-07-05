import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { SolarCalculator } from './components/SolarCalculator';
import { OurProjects } from './components/OurProjects';
import { RequestSurveyForm } from './components/RequestSurveyForm';
import { ScrollReveal } from './components/ScrollReveal';
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
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
  Moon,
} from 'lucide-react';

const SLIDES = [
  {
    title: "SolarSite Roof: Residential Clean Energy",
    description: "Save up to 90% on electricity bills with PM Surya Ghar scheme benefits and custom tier-1 panel engineering.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&auto=format&fit=crop&q=80",
    badge: "PM Surya Ghar Approved",
    tagline: "Electricity Bill to Zero"
  },
  {
    title: "High-Efficiency Commercial & Industrial Systems",
    description: "Mitigate operational carbon offset and secure flat, predictable utility rates for corporate complexes and factories.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1600&auto=format&fit=crop&q=80",
    badge: "C&I Turnkey EPC",
    tagline: "Industrial Energy Security"
  },
  {
    title: "BloombergNEF Tier-1 Manufacturing Excellence",
    description: "Engineered with highest solar cell conversion efficiency, extreme load durability, and a 25-year structural warranty.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80",
    badge: "Manufacturing Edge",
    tagline: "Module & Cell Production"
  }
];

const SOLUTIONS = [
  {
    id: 'residential',
    title: 'Residential Solar Roofs',
    desc: 'Power your home with grid-interactive net metering solar systems. Reduces bills to near-zero.',
    features: ['Direct central subsidy up to ₹78,000', 'Net-metering credits for exporting energy', '25-year performance warranty'],
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'commercial',
    title: 'Commercial & Industrial Solar',
    desc: 'Maximize unused rooftop space on warehouses, corporate parks, and factories to save millions in operations.',
    features: ['Accelerated depreciation tax benefits', 'Zero-investment OPEX models available', 'Custom heavy-load structure design'],
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'pumps',
    title: 'Solar Water Pumps',
    desc: 'Retail rural water solutions offering grid-independent pumping for agricultural farms, dairies, and estates.',
    features: ['Off-grid standalone power operation', 'Highly reliable DC/AC solar pumps', 'Eligible for national state subsidies'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'large',
    title: 'Utility Scale Projects',
    desc: 'End-to-end solar park EPC (Engineering, Procurement & Construction) and Operation & Maintenance services.',
    features: ['MW-scale land optimization layout', 'Substation & grid line integration', 'Remote SCADA performance monitoring'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60'
  }
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMonochrome, setIsMonochrome] = useState(false);

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
      style={{ filter: isMonochrome ? 'grayscale(100%)' : 'none' }}
    >
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Pinned Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-yellow-500 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-yellow-500/20">
              ⚡
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Solar<span className="text-yellow-500">Site</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none">Our Solutions</button>
            <button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none">Our Projects</button>
            <button onClick={() => handleNavClick('#calculator')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none">ROI Calculator</button>
            <button onClick={() => handleNavClick('#benefits')} className="hover:text-yellow-500 transition-colors cursor-pointer bg-transparent border-none">Why Solar</button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Black and White Grayscale toggle */}
            <button
              onClick={() => setIsMonochrome(!isMonochrome)}
              className={`px-3 py-2 border rounded-xl text-xs font-black transition duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-1 ${
                isMonochrome 
                  ? 'bg-yellow-500 border-yellow-500 text-slate-950' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-yellow-500/50 hover:bg-slate-900'
              }`}
              title="Toggle Black & White filter"
            >
              <span>B&W</span>
            </button>

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
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-900 rounded-xl text-slate-200 transition duration-300 font-bold text-sm cursor-pointer shadow-lg shadow-slate-950/20"
            >
              <Menu className="h-4 w-4 text-yellow-500" />
              <span>Explore Menu</span>
            </button>

            <Link
              to="/request-survey"
              className="hidden sm:inline-block text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-slate-950 px-4 py-2.5 rounded-xl transition duration-200 shadow-md shadow-yellow-500/10 cursor-pointer"
            >
              Get Free Survey
            </Link>
          </div>
        </div>
      </header>

      {/* Floating Sidebar (Right Edge) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-35 flex flex-col bg-slate-950/90 border-l border-t border-b border-slate-800 rounded-l-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <a href="tel:+919876543210" className="p-3.5 hover:bg-yellow-500 hover:text-slate-950 text-slate-400 transition-colors group relative" title="Call Us">
          <PhoneCall className="h-5 w-5" />
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Call Expert
          </span>
        </a>
        <Link to="/request-survey" className="p-3.5 hover:bg-yellow-500 hover:text-slate-950 text-slate-400 transition-colors group relative border-t border-slate-900" title="Send Inquiry">
          <Mail className="h-5 w-5" />
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Send Inquiry
          </span>
        </Link>
        <button onClick={() => handleNavClick('#calculator')} className="p-3.5 hover:bg-yellow-500 hover:text-slate-950 text-slate-400 transition-colors group relative border-t border-slate-900 bg-transparent border-none cursor-pointer" title="ROI Calculator">
          <Landmark className="h-5 w-5" />
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 bg-slate-950 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Calculate Savings
          </span>
        </button>
      </div>

      {/* Main Pages Switcher */}
      <main className="flex-1 mt-[73px]">
        <Routes>
          <Route path="/" element={<Home handleNavClick={handleNavClick} />} />
          <Route path="/request-survey" element={<RequestSurveyPage />} />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-[11px] text-slate-400">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">About Us</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Our Heritage</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Vision, Mission & Values</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Company Milestones</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Awards</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Corporate Policies</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Learn About Solar</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Case Studies</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Leadership</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Sustainability</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Environmental Compliance</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Health, Safety and Environment</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- CSR</a></li>
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Solar Water Pumps</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Solar Pumps</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Retail Rural Solution</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Customized Solutions</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Rooftops</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- SolarSite Rooftop</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Residential</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Commercial & Industrial</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Institutions</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Financing</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Remote Monitoring</a></li>
                </ul>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Projects</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><span className="text-[11px] font-bold text-slate-300 block mt-2 mb-1">- Large Projects</span></li>
                  <li className="pl-3"><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-[11px]">- Solutions for Businesses</button></li>
                  <li className="pl-3"><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-[11px]">- Solutions for EPC</button></li>
                  <li className="pl-3"><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-[11px]">- Solutions for Producers</button></li>
                  <li className="pl-3"><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-[11px]">- Operation & Maintenance</button></li>
                  <li><span className="text-[11px] font-bold text-slate-300 block mt-3 mb-1">- International Projects</span></li>
                  <li className="pl-3"><a href="#" className="hover:text-yellow-500 transition-colors">Solar Modules</a></li>
                </ul>
              </div>
            </div>

            {/* Column 4 */}
            <div className="space-y-6">
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Manufacturing Edge</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Solar Modules and Cells</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Investors</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Financials</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Merger Scheme</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Compliances</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Media</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Industry Events</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Press Releases</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Media Coverage</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Media Kit</a></li>
                  <li><a href="#" className="hover:text-yellow-500 transition-colors">- Gallery</a></li>
                </ul>
              </div>
              <div>
                <a href="#" className="font-extrabold text-white text-[11px] uppercase tracking-wider hover:text-yellow-500 transition-colors block">
                  Working at SolarSite
                </a>
              </div>
            </div>

            {/* Column 5 */}
            <div className="space-y-6">
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Contact Us</h5>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/request-survey" className="hover:text-yellow-500 transition-colors">- General Enquiry</Link></li>
                  <li><Link to="/request-survey" className="hover:text-yellow-500 transition-colors">- Customer Complaint</Link></li>
                  <li><Link to="/request-survey" className="hover:text-yellow-500 transition-colors">- Warranty Registration</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-3">Follow Us</h5>
                <div className="flex items-center gap-3 mt-2 text-slate-400">
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Twitter className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Linkedin className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Facebook className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Youtube className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-yellow-500 transition-colors"><Instagram className="h-4 w-4" /></a>
                </div>
              </div>
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
              © SolarSite Systems Ltd. {new Date().getFullYear()}
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
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-yellow-500 flex items-center justify-center text-slate-950 font-extrabold">
              ⚡
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Solar<span className="text-yellow-500">Site</span>
            </span>
          </div>

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
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Column 1 */}
            <div className="space-y-10">
              {/* About Us */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&auto=format&fit=crop&q=60" 
                    alt="About" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      About Us <Info className="h-3.5 w-3.5 text-yellow-500" />
                    </h4>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Our Heritage <ChevronRight className="h-3 w-3" /></a></li>
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Vision, Mission & Values <ChevronRight className="h-3 w-3" /></a></li>
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Company Milestones <ChevronRight className="h-3 w-3" /></a></li>
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Awards & Recognition <ChevronRight className="h-3 w-3" /></a></li>
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
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      Sustainability <Globe className="h-3.5 w-3.5 text-yellow-500" />
                    </h4>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Environmental Compliance <ChevronRight className="h-3 w-3" /></a></li>
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Health & Safety Standards <ChevronRight className="h-3 w-3" /></a></li>
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">CSR Initiatives <ChevronRight className="h-3 w-3" /></a></li>
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-10">
              {/* Rooftops */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=200&auto=format&fit=crop&q=60" 
                    alt="Rooftops" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      Rooftops <Flame className="h-3.5 w-3.5 text-yellow-500" />
                    </h4>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                  <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Residential Solar Roof <ChevronRight className="h-3 w-3" /></button></li>
                  <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Commercial & Industrial <ChevronRight className="h-3 w-3" /></button></li>
                  <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Institutional Solar <ChevronRight className="h-3 w-3" /></button></li>
                  <li><button onClick={() => handleNavClick('#solutions')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Solar Financing Options <ChevronRight className="h-3 w-3" /></button></li>
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
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      Projects <Grid className="h-3.5 w-3.5 text-yellow-500" />
                    </h4>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                  <li><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Utility Scale EPC Solutions <ChevronRight className="h-3 w-3" /></button></li>
                  <li><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">Rooftop Project Portfolios <ChevronRight className="h-3 w-3" /></button></li>
                  <li><button onClick={() => handleNavClick('#projects')} className="hover:text-yellow-500 transition-colors flex items-center gap-1 bg-transparent border-none text-sm text-slate-400 cursor-pointer">International Deployments <ChevronRight className="h-3 w-3" /></button></li>
                </ul>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-10">
              {/* Manufacturing Edge */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=60" 
                    alt="Manufacturing" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      Manufacturing Edge <Award className="h-3.5 w-3.5 text-yellow-500" />
                    </h4>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400 pl-13">
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Solar Modules & Cells Factory <ChevronRight className="h-3 w-3" /></a></li>
                  <li><a href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500 transition-colors flex items-center gap-1">Quality Standards & Certifications <ChevronRight className="h-3 w-3" /></a></li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 pb-2 border-b border-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1423662055902-359430b35e7d?w=200&auto=format&fit=crop&q=60" 
                    alt="Contact" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      Contact Us <PhoneCall className="h-3.5 w-3.5 text-yellow-500" />
                    </h4>
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
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold rounded-xl transition duration-200 shadow-lg shadow-yellow-500/20"
                  >
                    Request Free Survey
                  </Link>
                  <button
                    onClick={() => handleNavClick('#solutions')}
                    className="px-6 py-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-white font-bold rounded-xl transition duration-200 cursor-pointer"
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

      {/* Interactive Savings Calculator Section (Task 2) */}
      <section id="calculator" className="py-20 px-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-slate-900">
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal direction="left">
            <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">
              Financial Analysis
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1.5">
              See How Much You Can Save Today
            </h2>
            <p className="text-slate-400 leading-relaxed mt-3">
              Use our smart system planner to find your ideal solar capacity, calculate government subsidies, analyze lifetime utility savings, and preview CO2 offsets instantly.
            </p>

            <ul className="space-y-3.5 text-sm text-slate-300 mt-5">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Up to ₹78,000 Direct Central Bank Subsidy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Earn money by exporting extra power to net meter</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Increase property value by 4.1% on average</span>
              </li>
            </ul>
          </ScrollReveal>
        </div>
        
        <div className="lg:col-span-7">
          <ScrollReveal direction="right" delay={200}>
            <SolarCalculator />
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl w-full mx-auto px-6 py-20 border-t border-slate-900">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Why SolarSite</span>
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
            <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl hover:border-slate-800 transition duration-300 space-y-4 h-full">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Tier-1 Equipment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We exclusively use BloombergNEF Tier-1 mono-PERC half-cut solar panels with highest conversion cell efficiencies.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl hover:border-slate-800 transition duration-300 space-y-4 h-full">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">25-Year Protection</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our installations come backed by a 10-year workmanship warranty and a 25-year linear performance warranty.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400}>
            <div className="p-6 bg-slate-900/30 border border-slate-900 rounded-2xl hover:border-slate-800 transition duration-300 space-y-4 h-full">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Subsidy Assistance</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We handle the entire PM Surya Ghar national portal filing, ensuring your subsidy reaches your bank account directly.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

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
    <section className="py-16 px-6 max-w-7xl w-full mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest block">
          SOLARSITE CLEAN ENERGY
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          REQUEST SURVEY & ENQUIRIES
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Please fill out the appropriate form below. Our support desks, surveyors, and engineers are online to evaluate and log your queries.
        </p>
      </div>

      <RequestSurveyForm />
    </section>
  );
}

export default App;
