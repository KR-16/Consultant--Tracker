import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/auth";
import { Plus, Search, MoreVertical, User as UserIcon, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]); // List of managers for dropdown
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "password123",
    role: "CANDIDATE",
    assignedManager: "" 
  });

  // Fetch Users & Filter Managers
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users'); 
      setUsers(res.data);
      // Filter out just the managers for the dropdown
      setManagers(res.data.filter(u => u.role === 'TALENT_MANAGER'));
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      // 1. Create the User Account
      const userRes = await api.post('/users', {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      });

      // 2. If it's a Candidate AND a manager is selected, create their profile immediately with assignment
      if (newUser.role === 'CANDIDATE' && newUser.assignedManager) {
        
        // Here we simulate creating the profile with the assignment:
        await api.post('/candidates/profile', {
           experience_years: 0, // defaults
           assigned_manager_id: newUser.assignedManager
        }); 
      }

      fetchUsers();
      setIsDialogOpen(false);
      setNewUser({ name: "", email: "", password: "password123", role: "CANDIDATE", assignedManager: "" });
      alert("User created successfully");
    } catch (error) {
      alert("Failed: " + (error.response?.data?.detail || error.message));
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="TALENT_MANAGER">Talent Manager</option>
                  <option value="CANDIDATE">Candidate</option>
                </select>
              </div>

              {/* 👈 ASSIGN MANAGER DROPDOWN (Only if role is Candidate) */}
              {newUser.role === 'CANDIDATE' && (
                <div className="space-y-2">
                  <Label>Assign to Manager</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={newUser.assignedManager}
                    onChange={(e) => setNewUser({ ...newUser, assignedManager: e.target.value })}
                  >
                    <option value="">-- Select Manager --</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <Button onClick={handleAddUser} className="w-full bg-slate-900 text-white">Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List Display (Simplified for brevity) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">{user.role}</span></td>
                <td className="px-6 py-4 text-right"><MoreVertical className="w-4 h-4 ml-auto text-slate-400" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;