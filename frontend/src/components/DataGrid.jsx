import React from 'react';
import { ExternalLink, Building2, MapPin, Mail, Phone, User, Linkedin, Globe } from 'lucide-react';
import clsx from 'clsx';

const DataGrid = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm">
                No companies found matching your criteria.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[#2A2A2C] bg-[#1A1A1C]/80 backdrop-blur-sm shadow-xl relative z-10">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-[#111113] text-xs uppercase text-slate-500 font-semibold border-b border-[#2A2A2C]">
                        <tr>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Contact Details</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Classification</th>
                            <th className="px-6 py-4">Size</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2C]">
                        {data.map((company) => (
                            <tr key={company.id} className="hover:bg-white/5 transition-colors">
                                {/* Company Info */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl shadow-[0_0_10px_rgba(255,90,42,0.2)]">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-base">{company.company_name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{company.industry}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact Info */}
                                <td className="px-6 py-4 align-top">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <User className="w-3.5 h-3.5 text-slate-400" />
                                            {company.first_name || company.last_name ? `${company.first_name || ''} ${company.last_name || ''}` : 'N/A'}
                                        </div>
                                        <div className="text-xs text-slate-400 pl-5.5">{company.title}</div>

                                        {company.email && (
                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="truncate max-w-[180px]" title={company.email}>{company.email}</span>
                                            </div>
                                        )}

                                        {company.corporate_phone && (
                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{company.corporate_phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Location */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{company.country || 'Unknown'}</span>
                                    </div>
                                </td>

                                {/* Classification */}
                                <td className="px-6 py-4 align-top">
                                    <span className={clsx(
                                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                                        company.classification === 'Product'
                                            ? "bg-purple-900/30 text-purple-400 border-purple-800"
                                            : "bg-blue-900/30 text-blue-400 border-blue-800"
                                    )}>
                                        {company.classification || 'Unknown'}
                                    </span>
                                </td>

                                {/* Employee Size */}
                                <td className="px-6 py-4 align-top">
                                    <div className="text-slate-300">{company.employee_size || 'N/A'}</div>
                                    {company.employee_count > 0 && (
                                        <div className="text-xs text-slate-500 mt-0.5">Est. {company.employee_count}</div>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex justify-center gap-2">
                                        {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                title="Website"
                                            >
                                                <Globe className="w-4.5 h-4.5" />
                                            </a>
                                        ) : (
                                            <span className="p-2 text-slate-600 cursor-not-allowed"><Globe className="w-4.5 h-4.5" /></span>
                                        )}

                                        {company.person_linkedin_link ? (
                                            <a
                                                href={company.person_linkedin_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-[#0077b5]/10 rounded-lg transition-all"
                                                title="Person LinkedIn"
                                            >
                                                <Linkedin className="w-4.5 h-4.5" />
                                            </a>
                                        ) : (
                                            <span className="p-2 text-slate-600 cursor-not-allowed"><Linkedin className="w-4.5 h-4.5" /></span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataGrid;
