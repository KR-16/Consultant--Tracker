import React, { useState } from 'react';
import { Search, Filter, Star} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';


const MOCK_CONSULTANTS = [
  {
    id: 1,
    name: "John Smith",
    exp: "8 years exp",
    status: "Available",
    tech: ["React", "Node.js", "TypeScript", "AWS"],
    visa: "H1B",
    rating: 5,
    initials: "JS",
    color: "bg-slate-100"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    exp: "6 years exp",
    status: "Unavailable",
    tech: ["Python", "AWS", "Docker", "Kubernetes"],
    visa: "Green Card",
    rating: 4,
    initials: "SJ",
    color: "bg-slate-100"
  },
  {
    id: 3,
    name: "Michael Chen",
    exp: "10 years exp",
    status: "Available",
    tech: ["Java", "Spring Boot", "PostgreSQL", "Azure"],
    visa: "Citizen",
    rating: 5,
    initials: "MC",
    color: "bg-slate-100"
  },
  {
    id: 4,
    name: "Emily Davis",
    exp: "4 years exp",
    status: "Unavailable",
    tech: ["Angular", "TypeScript", ".NET", "Azure"],
    visa: "OPT",
    rating: 4,
    initials: "ED",
    color: "bg-slate-100"
  },
  {
    id: 5,
    name: "David Wilson",
    exp: "7 years exp",
    status: "Available",
    tech: ["React", "Go", "MongoDB", "Docker"],
    visa: "H1B",
    rating: 4,
    initials: "DW",
    color: "bg-slate-100"
  }
];


const ToggleSwitch = ({ checked, onChange }) => (
  <div 
    onClick={onChange}
    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
      checked ? 'bg-slate-900' : 'bg-slate-200'
    }`}
  >
    <div 
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} 
    />
  </div>
);

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
      />
    ))}
  </div>
);

const Availability = () => {
  const [consultants, setConsultants] = useState(MOCK_CONSULTANTS);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleStatus = (id) => {
    setConsultants(consultants.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "Available" ? "Unavailable" : "Available" } 
        : c
    ));
  };

  const filtered = consultants.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Availability Management</h1>
        <p className="text-slate-500">Manage consultant availability status</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Available</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {consultants.filter(c => c.status === "Available").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">On Project</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {consultants.filter(c => c.status === "Unavailable").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">On Bench</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search consultants..." 
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2 text-slate-600">
            <Filter className="h-4 w-4" /> All Tech
          </Button>
          <Button variant="outline" className="text-slate-600">All Visa</Button>
          <Button variant="outline" className="text-slate-600">All</Button>
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((consultant) => (
          <Card key={consultant.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-6">
              
              {/* Top Row: Avatar + Name + Toggle */}
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-lg">
                    {consultant.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{consultant.name}</h3>
                    <p className="text-sm text-slate-500">{consultant.exp}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-medium ${consultant.status === 'Available' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {consultant.status}
                  </span>
                  <ToggleSwitch 
                    checked={consultant.status === "Available"} 
                    onChange={() => toggleStatus(consultant.id)} 
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {consultant.tech.map((t, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Visa + Rating */}
              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Visa Status</p>
                  <p className="text-sm font-medium text-slate-900">{consultant.visa}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 text-right">Rating</p>
                  <StarRating rating={consultant.rating} />
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Availability;