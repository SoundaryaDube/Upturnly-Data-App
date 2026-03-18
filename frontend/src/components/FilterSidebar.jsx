import React from 'react';
import { Filter, X, Phone } from 'lucide-react';
import clsx from 'clsx';

const FilterSidebar = ({
    filters,
    selectedFilters,
    onFilterChange,
    isOpen,
    onClose
}) => {
    return (
        <div className={clsx(
            "fixed inset-y-0 right-0 w-80 bg-[#1A1A1C]/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-[#2A2A2C] overflow-y-auto",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Filter className="w-5 h-5 text-primary" />
                        Filters
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                        <input
                            type="text"
                            placeholder="e.g. CEO, Manager"
                            value={selectedFilters.title || ''}
                            onChange={(e) => onFilterChange('title', e.target.value)}
                            className="w-full bg-[#111113] border border-[#2A2A2C] rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
                        <select
                            value={selectedFilters.country || ''}
                            onChange={(e) => onFilterChange('country', e.target.value)}
                            className="w-full bg-[#111113] border border-[#2A2A2C] rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                        >
                            <option value="">All Countries</option>
                            {filters.countries.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
                        <select
                            value={selectedFilters.industry || ''}
                            onChange={(e) => onFilterChange('industry', e.target.value)}
                            className="w-full bg-[#111113] border border-[#2A2A2C] rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                        >
                            <option value="">All Industries</option>
                            {filters.industries.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Employee Size */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Employee Size</label>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="Min (e.g., 100)"
                                    value={selectedFilters.min_employee_size || ''}
                                    onChange={(e) => onFilterChange('min_employee_size', e.target.value)}
                                    className="w-full bg-[#111113] border border-[#2A2A2C] rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <span className="text-slate-500">-</span>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="Max (e.g., 1000)"
                                    value={selectedFilters.max_employee_size || ''}
                                    onChange={(e) => onFilterChange('max_employee_size', e.target.value)}
                                    className="w-full bg-[#111113] border border-[#2A2A2C] rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Corporate Phone Toggle */}
                    <div>
                        <label className="flex items-center gap-3 p-3 border border-[#2A2A2C] bg-[#111113]/50 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                            <input
                                type="checkbox"
                                checked={selectedFilters.has_phone || false}
                                onChange={(e) => onFilterChange('has_phone', e.target.checked)}
                                className="w-4 h-4 text-primary bg-[#111113] border-[#2A2A2C] rounded focus:ring-primary focus:ring-offset-[#1A1A1C]"
                            />
                            <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                Has Corporate Phone
                            </span>
                        </label>
                    </div>

                    {/* Reset Filters */}
                    <button
                        onClick={() => {
                            onFilterChange('country', '');
                            onFilterChange('title', '');
                            onFilterChange('industry', '');
                            onFilterChange('min_employee_size', '');
                            onFilterChange('max_employee_size', '');
                            onFilterChange('has_phone', false);
                        }}
                        className="w-full py-2.5 px-4 bg-white hover:bg-slate-200 text-black rounded-lg text-sm font-medium transition-colors"
                    >
                        Reset All Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
