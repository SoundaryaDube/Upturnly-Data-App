import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = ({ filters, selectedFilters, onFilterChange, onSearchChange, searchTerm }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search companies or emails..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    <select
                        value={selectedFilters.country || ''}
                        onChange={(e) => onFilterChange('country', e.target.value)}
                        className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Countries</option>
                        {filters.countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        value={selectedFilters.classification || ''}
                        onChange={(e) => onFilterChange('classification', e.target.value)}
                        className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Classifications</option>
                        {filters.classifications.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        value={selectedFilters.industry || ''}
                        onChange={(e) => onFilterChange('industry', e.target.value)}
                        className="bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Industries</option>
                        {filters.industries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
