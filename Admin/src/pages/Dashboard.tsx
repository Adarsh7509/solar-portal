import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Eye,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface QueryLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  monthlyElectricityBill: number;
  solarCapacityInterested: string;
  message: string;
  status: 'PENDING' | 'CONTACTED' | 'QUOTED' | 'CLOSED';
  createdAt: string;
  adminNotes: string;
}

const MOCK_LEADS: QueryLead[] = [
  {
    id: 'mock-1',
    name: 'Adarsh Sharma',
    email: 'adarsh@example.com',
    phone: '9876543210',
    city: 'Indore',
    address: '742, Saket Nagar, near Temple',
    monthlyElectricityBill: 4500,
    solarCapacityInterested: '3 kW - 5 kW System',
    message: 'Looking for a south-facing roof terrace installation. Need info on government subsidies.',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    adminNotes: 'Spoke briefly. Scheduled site survey for next Monday.',
  },
  {
    id: 'mock-2',
    name: 'Rajesh Patel',
    email: 'rajesh@patel.com',
    phone: '9123456789',
    city: 'Bhopal',
    address: 'A-21, Arera Colony',
    monthlyElectricityBill: 9000,
    solarCapacityInterested: '10+ kW Commercial / Industrial Setup',
    message: 'Factory rooftop installation. Roof space is around 2500 sq ft.',
    status: 'CONTACTED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    adminNotes: 'Emailed commercial quotation. Waiting for architect drawings.',
  },
  {
    id: 'mock-3',
    name: 'Pooja Gupta',
    email: 'pooja.g@gmail.com',
    phone: '9893012345',
    city: 'Ujjain',
    address: '12, Freeganj main road',
    monthlyElectricityBill: 2000,
    solarCapacityInterested: '1 kW - 2 kW System',
    message: 'Small residential requirement. Need quick estimate.',
    status: 'QUOTED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    adminNotes: 'Standard residential quote sent. Subsidies included.',
  },
  {
    id: 'mock-4',
    name: 'Amit Verma',
    email: 'amit.verma@outlook.com',
    phone: '9988776655',
    city: 'Dewas',
    address: 'Shalimar Township, Block C',
    monthlyElectricityBill: 6200,
    solarCapacityInterested: '5 kW - 8 kW System',
    message: 'Need hybrid system with battery backup because of power cuts.',
    status: 'CLOSED',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    adminNotes: 'Contract signed. Advanced payment received. Net-metering application submitted.',
  }
];

export default function Dashboard() {
  const [queries, setQueries] = useState<QueryLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<QueryLead | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchQueries();
  }, [navigate]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token === 'mock-token-solar-bypass') {
        setQueries(MOCK_LEADS);
        setLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/admin/queries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueries(response.data.data);
    } catch (err: any) {
      console.warn('Error fetching admin queries from API, falling back to mock leads database.', err);
      setQueries(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(true);
    const token = localStorage.getItem('token');

    if (token === 'mock-token-solar-bypass' || leadId.startsWith('mock-')) {
      setQueries((prev) =>
        prev.map((q) =>
          q.id === leadId
            ? { ...q, status: newStatus as any, adminNotes: notesInput }
            : q
        )
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({
          ...selectedLead,
          status: newStatus as any,
          adminNotes: notesInput,
        });
      }
      setUpdatingStatus(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.patch(
        `${apiUrl}/api/admin/queries/${leadId}`,
        {
          status: newStatus,
          adminNotes: notesInput,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQueries((prev) =>
        prev.map((q) =>
          q.id === leadId
            ? { ...q, status: newStatus as any, adminNotes: notesInput }
            : q
        )
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({
          ...selectedLead,
          status: newStatus as any,
          adminNotes: notesInput,
        });
      }
    } catch (err) {
      console.warn('API status change failed, updating locally for client view.', err);
      setQueries((prev) =>
        prev.map((q) =>
          q.id === leadId
            ? { ...q, status: newStatus as any, adminNotes: notesInput }
            : q
        )
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({
          ...selectedLead,
          status: newStatus as any,
          adminNotes: notesInput,
        });
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Filter queries based on search term and status selector
  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate high level metrics
  const totalLeads = queries.length;
  const pendingLeads = queries.filter((q) => q.status === 'PENDING').length;
  const closedLeads = queries.filter((q) => q.status === 'CLOSED').length;
  const totalProjectedRevenue = queries.reduce(
    (acc, q) => acc + parseFloat(q.monthlyElectricityBill as any) * 12 * 5, // rough 5-year projection
    0
  );

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col selection:bg-yellow-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-[#070b13]/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-yellow-500 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-yellow-500/20">
              ⚡
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Solar<span className="text-yellow-500">Admin</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8 relative">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Solar Lead Operations</h1>
            <p className="text-slate-400 text-sm mt-1">
              Track feasibility pipeline, estimate customer metrics and manage status workflows.
            </p>
          </div>
          <button
            onClick={fetchQueries}
            className="self-start md:self-auto text-xs font-semibold bg-yellow-500 hover:bg-yellow-600 text-slate-950 px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer"
          >
            Refresh Database
          </button>
        </div>

        {/* Metric Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Leads</p>
              <h4 className="text-3xl font-black mt-1 text-white">{totalLeads}</h4>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
              <Clock className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Review</p>
              <h4 className="text-3xl font-black mt-1 text-white">{pendingLeads}</h4>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Closed Deals</p>
              <h4 className="text-3xl font-black mt-1 text-white">{closedLeads}</h4>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Est. 5Yr Savings</p>
              <h4 className="text-3xl font-black mt-1 text-white font-mono">
                ₹{Math.round(totalProjectedRevenue).toLocaleString('en-IN')}
              </h4>
            </div>
          </div>
        </section>

        {/* Lead Table Container */}
        <section className="bg-slate-950/40 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
          {/* Filter Bar */}
          <div className="p-6 border-b border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search leads by name, city, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 text-slate-200 transition placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <SlidersHorizontal className="text-slate-500 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500 text-slate-300 transition cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUOTED">Quote Provided</option>
                <option value="CLOSED">Closed/Finished</option>
              </select>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-900 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4.5">Customer</th>
                  <th className="px-6 py-4.5">City</th>
                  <th className="px-6 py-4.5">Electricity Bill</th>
                  <th className="px-6 py-4.5">System Capacity</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5">Submitted At</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      Loading lead database...
                    </td>
                  </tr>
                ) : filteredQueries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      No matching solar leads found.
                    </td>
                  </tr>
                ) : (
                  filteredQueries.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-900/10 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{lead.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {lead.phone} | {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-300">{lead.city}</td>
                      <td className="px-6 py-4 font-mono text-slate-300">
                        ₹{parseFloat(lead.monthlyElectricityBill as any).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs bg-blue-950/40 text-blue-400 border border-blue-900/30 rounded-lg font-semibold">
                          {lead.solarCapacityInterested || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${
                            lead.status === 'PENDING'
                              ? 'bg-orange-950/30 text-orange-400 border-orange-900/30'
                              : lead.status === 'CONTACTED'
                              ? 'bg-blue-950/30 text-blue-400 border-blue-900/30'
                              : lead.status === 'QUOTED'
                              ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/30'
                              : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setNotesInput(lead.adminNotes || '');
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition duration-150 inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Slide-over Detail Drawer Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-lg bg-[#0b0f19] border-l border-slate-900 h-full shadow-2xl flex flex-col p-6 animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h3 className="font-extrabold text-white text-lg">Lead Details</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="h-8 w-8 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Customer Name
                </span>
                <p className="text-xl font-extrabold text-white">{selectedLead.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Phone
                  </span>
                  <p className="font-bold text-slate-300">{selectedLead.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Email
                  </span>
                  <p className="font-bold text-slate-300 break-all">{selectedLead.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Site Installation Address
                </span>
                <p className="text-sm bg-slate-950 p-4 rounded-2xl border border-slate-900 text-slate-300 leading-relaxed">
                  {selectedLead.address}, {selectedLead.city}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Monthly Bill
                  </span>
                  <p className="text-lg font-black text-white font-mono">
                    ₹{parseFloat(selectedLead.monthlyElectricityBill as any).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Suggested Capacity
                  </span>
                  <p className="text-lg font-black text-blue-400">
                    {selectedLead.solarCapacityInterested}
                  </p>
                </div>
              </div>

              {selectedLead.message && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    Customer Message
                  </span>
                  <p className="text-sm italic bg-slate-950 p-4 rounded-2xl border border-slate-900 text-slate-400">
                    "{selectedLead.message}"
                  </p>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="border-t border-slate-900 pt-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                    Update Pipeline Stage
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['PENDING', 'CONTACTED', 'QUOTED', 'CLOSED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedLead.id, st)}
                        disabled={updatingStatus}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          selectedLead.status === st
                            ? 'bg-yellow-500 text-slate-950 border-yellow-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Internal Operator Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Enter customer site notes, solar survey details, quotes sent..."
                    className="w-full p-4 text-sm bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500 text-slate-200 resize-none placeholder-slate-600"
                  />
                  <button
                    onClick={() => handleStatusChange(selectedLead.id, selectedLead.status)}
                    disabled={updatingStatus}
                    className="w-full mt-2.5 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold text-sm rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20"
                  >
                    Save Notes Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
