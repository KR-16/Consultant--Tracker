import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '../../api/jobs';
import { 
  Briefcase, MapPin, DollarSign, Building, 
  AlertCircle, Loader2, Users 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';

const PostJob = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    department: '',
    location: '',
    employment_type: 'Full-time',
    description: '',
    requirements: '',
    salary_range: '',
  });

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      navigate('/hiring/dashboard');
    },
    onError: (err) => {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        const errorMessages = detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ');
        setError(errorMessages);
      } else {
        setError(detail || 'Failed to post job. Please try again.');
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.company_name.trim() || !formData.description.trim()) {
      setError('Title, Company Name, and Description are mandatory.');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
        <p className="text-slate-500 mt-2">Reach the right candidates by providing detailed job info.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>All fields marked with * are required.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="title" name="title" placeholder="Software Engineer" className="pl-10" value={formData.title} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="company_name" name="company_name" placeholder="Talentra Inc" className="pl-10" value={formData.company_name} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="department" name="department" placeholder="Engineering" className="pl-10" value={formData.department} onChange={handleChange} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select onValueChange={(val) => setFormData(p => ({...p, employment_type: val}))} defaultValue="Full-time">
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="location" name="location" placeholder="Remote / New York" className="pl-10" value={formData.location} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_range">Salary Range</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="salary_range" name="salary_range" placeholder="$100k - $120k" className="pl-10" value={formData.salary_range} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea id="description" name="description" placeholder="Responsibilities..." className="min-h-[120px]" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/hiring/dashboard')}>Cancel</Button>
              <Button type="submit" className="bg-slate-900 text-white" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="animate-spin" /> : "Publish Job"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default PostJob;