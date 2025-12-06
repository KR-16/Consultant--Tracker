import React, { useState } from 'react';
import { Briefcase, FileText, User } from 'lucide-react';
import ConsultantProfile from './ConsultantProfile';
import ConsultantJobs from './ConsultantJobs';
import ConsultantApplications from './ConsultantApplications';

const ConsultantDashboard = () => {
    const [activeTab, setActiveTab] = useState('jobs');

    const tabs = [
        { id: 'jobs', label: 'Open Jobs', icon: Briefcase },
        { id: 'applications', label: 'My Applications', icon: FileText },
        { id: 'profile', label: 'My Profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Consultant Dashboard</h1>
                    <p className="mt-2 text-slate-600">Manage your profile, browse jobs, and track applications</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
                    <div className="border-b border-slate-200">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                      flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                                                ? 'border-slate-900 text-slate-900'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                            }
                    `}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'jobs' && <ConsultantJobs />}
                        {activeTab === 'applications' && <ConsultantApplications />}
                        {activeTab === 'profile' && <ConsultantProfile />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultantDashboard;
