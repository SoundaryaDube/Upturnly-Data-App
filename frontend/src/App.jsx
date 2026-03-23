import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Database, Search, Filter } from 'lucide-react';
import FileUpload from './components/FileUpload';
import FilterSidebar from './components/FilterSidebar';
import DataGrid from './components/DataGrid';

const API_URL = import.meta.env.VITE_API_URL || 'https://upturnly-data-app-529304626037.europe-west1.run.app';

function App() {
  const [activeTab, setActiveTab] = useState('data'); // 'upload' | 'data'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    countries: [],
    classifications: [],
    industries: [],
    min_employee_count: 0,
    max_employee_count: 10000
  });

  const [selectedFilters, setSelectedFilters] = useState({
    country: '',
    title: '',
    industry: '',
    min_employee_size: '',
    max_employee_size: '',
    has_phone: false
  });

  const [searchTerm, setSearchTerm] = useState('');

  const fetchFilters = async () => {
    try {
      const response = await axios.get(`${API_URL}/filters`);
      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        skip: 0,
        limit: 100,
        ...selectedFilters,
        search: searchTerm || undefined
      };

      // Clean undefined params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined || params[key] === null) {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_URL}/companies`, { params });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
    fetchData();
  }, []);

  useEffect(() => {
    // Debounce search slightly to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedFilters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    // Define columns to export (removed Classification per request)
    const headers = ['Company Name', 'Industry', 'Employee Size', 'Country', 'Website', 'Person Name', 'Title', 'Email', 'Corporate Phone', 'LinkedIn'];

    const rows = data.map(company => [
      `"${company.company_name || ''}"`,
      `"${company.industry || ''}"`,
      `"${company.employee_size || ''}"`,
      `"${company.country || ''}"`,
      `"${company.website || ''}"`,
      `"${(company.first_name || '') + ' ' + (company.last_name || '')}"`.trim(),
      `"${company.title || ''}"`,
      `"${company.email || ''}"`,
      `"${company.corporate_phone || ''}"`,
      `"${company.person_linkedin_link || ''}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'upturnly_data_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] text-slate-200 font-sans relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#E04818]/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Top Navigation */}
      <nav className="sticky top-0 w-full bg-[#1A1A1C]/80 backdrop-blur-md border-b border-[#2A2A2C] px-6 py-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder (can be replaced with actual image later) */}
            <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF5A2A"/>
                    <path d="M2 17L12 22L22 17" stroke="#FF5A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#FF5A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-2xl font-bold tracking-tight text-white">Upturnly</span>
            </div>
            
            <div className="hidden md:flex items-center ml-10 space-x-1">
                <button
                    onClick={() => setActiveTab('data')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'data'
                        ? 'text-primary bg-primary/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    Company Database
                </button>
            </div>
          </div>
          
          <div>
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-gradient-to-r from-primary to-[#FF7A5A] hover:from-[#E04818] hover:to-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-[0_0_15px_rgba(255,90,42,0.4)] transition-all"
            >
                Upload CSV
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-8 transition-all duration-300">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full relative mx-auto flex items-center justify-between gap-4">
            {activeTab === 'data' && (
              <>
                <div className="relative group flex gap-3 flex-1">
                  <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                      type="text"
                      className="block w-full pl-11 pr-4 py-3 border border-[#2A2A2C] rounded-xl bg-[#1A1A1C]/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-inner transition-all backdrop-blur-sm"
                      placeholder="Search companies, emails, or names..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <button
                      onClick={() => setIsFilterOpen(true)}
                      className="px-4 py-3 bg-[#1A1A1C]/80 border border-[#2A2A2C] text-slate-300 hover:text-white hover:border-primary/50 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
                  >
                      <Filter className="w-5 h-5" />
                      <span className="hidden sm:inline">Filters</span>
                  </button>
                </div>
                
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-black rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export CSV
                </button>
              </>
            )}
          </div>
        </header>

        {activeTab === 'upload' ? (
          <div className="max-w-2xl mx-auto mt-10 p-8 rounded-2xl bg-[#1A1A1C]/60 border border-[#2A2A2C] backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Upload CSV Data</h1>
            <p className="text-slate-400 text-center mb-8">Drag and drop your CSV file to import new company records.</p>
            <FileUpload onUploadSuccess={() => {
              fetchFilters();
              fetchData();
              // setActiveTab('data'); // Stay on page or switch?
            }} />
          </div>
        ) : (
          <div className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Companies</h2>
                <p className="text-sm text-slate-400 mt-1">{data.length} results found matching your criteria</p>
              </div>
            </div>

            <DataGrid data={data} loading={loading} />

            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />

            {/* Overlay for sidebar */}
            {isFilterOpen && (
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={() => setIsFilterOpen(false)}
              ></div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
