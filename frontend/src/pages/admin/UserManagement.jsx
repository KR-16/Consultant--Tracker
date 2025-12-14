import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, deleteUser, updateUser, createUser } from '../../api/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. Fetch Users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });

  // 2. Mutations (Delete & Create)
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast({ title: "User deleted" });
    }
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setIsDialogOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'CANDIDATE' });
      toast({ title: "User created" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.detail || "Failed" });
    }
  });

  // Handle Create Submit
  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(newUser);
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
              <Input placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
              <Input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
              <select 
                className="w-full border rounded p-2" 
                value={newUser.role} 
                onChange={e => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="CANDIDATE">Candidate</option>
                <option value="TALENT_MANAGER">Talent Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search users..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    u.role === 'TALENT_MANAGER' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`h-2 w-2 rounded-full inline-block mr-2 ${u.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  {u.is_active ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteMutation.mutate(u.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
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