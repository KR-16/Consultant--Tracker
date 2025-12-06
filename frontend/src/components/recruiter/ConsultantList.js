import React, { useState, useEffect } from 'react';
import { User, Briefcase, MapPin, Mail, Phone, Star, Loader2, Users as UsersIcon } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { consultantAPI } from '../../api';

const ConsultantList = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchConsultants();
    }, []);

    const fetchConsultants = async () => {
        try {
            const response = await consultantAPI.getAll();
            console.log('Consultants fetched:', response.data);
            setConsultants(response.data);
        } catch (error) {
            console.error('Error fetching consultants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (consultant) => {
        setSelectedConsultant(consultant);
        setDetailsOpen(true);
    };

    const getAvailabilityVariant = (available) => {
        return available ? 'success' : 'secondary';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Consultants</h2>
                <p className="text-slate-600 mt-1">{consultants.length} total consultants</p>
            </div>

            {consultants.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <UsersIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No consultants found</h3>
                        <p className="text-slate-600">Consultants will appear here once they create their profiles</p>
                    </div>
                </Card>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Experience
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Tech Stack
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Availability
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {consultants.map((consultant) => (
                                    <tr key={consultant.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-slate-400 mr-3" />
                                                <div className="text-sm font-medium text-slate-900">
                                                    {consultant.name || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Briefcase className="h-4 w-4 mr-2" />
                                                {consultant.experience_years || 0} Years
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {consultant.tech_stack && consultant.tech_stack.length > 0 ? (
                                                    <>
                                                        {consultant.tech_stack.slice(0, 3).map((tech, idx) => (
                                                            <Badge key={`${tech}-${idx}`} variant="secondary" className="text-xs">
                                                                {tech}
                                                            </Badge>
                                                        ))}
                                                        {consultant.tech_stack.length > 3 && (
                                                            <span className="text-xs text-slate-500">
                                                                +{consultant.tech_stack.length - 3}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600">
                                                {consultant.location ? (
                                                    <>
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        {consultant.location}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getAvailabilityVariant(consultant.available)}>
                                                {consultant.available ? 'Available' : 'Unavailable'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(consultant)}
                                            >
                                                View Profile
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Consultant Details Dialog */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Consultant Profile: {selectedConsultant?.name || 'N/A'}</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    {selectedConsultant && (
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Email</p>
                                        <div className="flex items-center text-sm text-slate-900">
                                            <Mail className="h-4 w-4 mr-2 text-slate-400" />
                                            {selectedConsultant.email || '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Phone</p>
                                        <div className="flex items-center text-sm text-slate-900">
                                            <Phone className="h-4 w-4 mr-2 text-slate-400" />
                                            {selectedConsultant.phone || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Professional Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Experience</p>
                                        <p className="text-sm text-slate-900">{selectedConsultant.experience_years || 0} Years</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Availability</p>
                                        <Badge variant={getAvailabilityVariant(selectedConsultant.available)}>
                                            {selectedConsultant.available ? 'Available' : 'Unavailable'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Location</p>
                                        <p className="text-sm text-slate-900">{selectedConsultant.location || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Visa Status</p>
                                        <p className="text-sm text-slate-900">{selectedConsultant.visa_status || '-'}</p>
                                    </div>
                                    {selectedConsultant.rating && (
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Rating</p>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                                <span className="text-sm text-slate-900">{selectedConsultant.rating}/5.0</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Technical Skills */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedConsultant.tech_stack && selectedConsultant.tech_stack.length > 0 ? (
                                        selectedConsultant.tech_stack.map((tech, idx) => (
                                            <Badge key={`${tech}-${idx}`} variant="secondary">
                                                {tech}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">No skills listed</p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedConsultant.notes && (
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Notes</h3>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                            {selectedConsultant.notes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogFooter>
                    <Button onClick={() => setDetailsOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ConsultantList;