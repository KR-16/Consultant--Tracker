import React, { useState } from 'react';
import { 
  Search, MoreVertical, Trash2, Shield, 
  CheckCircle, XCircle, Filter 
} from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '../../components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator 
} from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Users Data
  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", email: "admin@recruitops.com", role: "ADMIN", status: "Active", lastLogin: "2 mins ago" },
    { id: 2, name: "Sarah Recruiter", email: "sarah@recruitops.com", role: "TALENT_MANAGER", status: "Active", lastLogin: "1 hour ago" },
    { id: 3, name: "John Candidate", email: "john@gmail.com", role: "CANDIDATE", status: "Active", lastLogin: "2 days ago" },
    { id: 4, name: "Jane Smith", email: "jane@yahoo.com", role: "CANDIDATE", status: "Inactive", lastLogin: "1 month ago" },
    { id: 5, name: "Mike Manager", email: "mike@recruitops.com", role: "TALENT_MANAGER", status: "Active", lastLogin: "5 hours ago" },
  ]);

  // Handle Search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Delete
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter(u => u.id !== id));
      toast({
        title: "User Deleted",
        description: "The user has been permanently removed.",
        variant: "destructive"
      });
    }
  };

  // Handle Role Change
  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    toast({
      title: "Role Updated",
      description: `User role changed to ${newRole.replace('_', ' ')}.`,
      className: "bg-blue-50 border-blue-200"
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200';
      case 'TALENT_MANAGER': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage system access, update roles, and audit user activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 mr-2">Total Users: {users.length}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </CardContent>
      </Card>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-950">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.status === 'Active' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-sm">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'CANDIDATE')}>
                        Set as Candidate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'TALENT_MANAGER')}>
                        Set as Talent Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'ADMIN')}>
                        <Shield className="w-3 h-3 mr-2 text-red-500" /> Promote to Admin
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 focus:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;