"use client";

import {
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Building2,
  Smartphone,
  ShieldCheck,
  Users,
  Filter,
  ArrowUpRight,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { http } from '@/lib/http';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/ui/Heading';
import { Separator } from '@/components/ui/separator';
import { Button, buttonVariants } from '@/components/ui/button';
import { Status } from '@prisma/client';

interface UserData {
  id: string;
  name: string;
  email: string;
  organizationName: string | null;
  phoneNumber: string | null;
  createdAt: string;
  accountType?: string;
  status: Status
}

interface ApiResponse {
  users: UserData[];
  stats: {
    totalUsers: number;
    totalApproved: number;
    totalOrganizations: number;
  };
}

const VendorUserListPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [mount, setMount] = useState(false);

  const { data, isLoading, isError, error } = useQuery < ApiResponse > ({
    queryKey: ['vendor-users'],
    queryFn: async () => {
      const response = await http.get('/api/vendor/users');

      if (response.status === 200 && !response.data.error) {
        return response.data;
      }

      throw new Error(response.data.message || 'Something went wrong');
    },
    staleTime: 1000 * 60 * 5, // 5 min
    refetchInterval: 1000 * 60 * 5, // 5 min
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];

    if (searchTerm.trim() == '') {
      return data.users;
    }

    const search = searchTerm.toLowerCase();

    return data.users.filter((user: UserData) =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.organizationName?.toLowerCase().includes(search)
    );
  }, [data?.users, searchTerm]);

  
  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;


  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Heading
          title="User Management"
          description="Manage your vendor accounts, monitor registrations, and verify organization details."
        />
        <Link
          href={'/vendor/users/register'}
          className={cn(
            buttonVariants({ variant: 'default' }),
            "bg-primary hover:opacity-90 transition-all shadow-md cursor-pointer"
          )}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Link>
      </div>

      <Separator className="bg-gray-200" />

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {[
          { label: "Total Users", value: data?.stats.totalUsers || "0", icon: Users, color: "text-blue-600" },
          { label: "Organizations", value: data?.stats.totalOrganizations || "0", icon: Building2, color: "text-purple-600" },
          { label: "Approved Users", value: data?.stats.totalApproved || "0", icon: ShieldCheck, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-100 animate-pulse rounded mt-1" />
              ) : (
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              )}
            </div>
            <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or organization..."
            className="pl-10 bg-gray-50/50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading user data...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-red-600 font-medium">Failed to load users</p>
          <p className="text-red-400 text-sm">{(error as any)?.message || "Check your connection"}</p>
          <Button variant="outline" className="mt-4 border-red-200 text-red-600 hover:bg-red-100" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={false}
          animate="visible"
          className="grid gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full md:w-1/3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2">
                        {user.name}
                        {user.organizationName && (
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-100">
                            Corp
                          </Badge>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3" /> {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:flex md:items-center gap-8 w-full md:w-auto">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Organization</p>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                        {user.organizationName || "N/A"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Phone</p>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                        {user.phoneNumber || "No Phone"}
                      </p>
                    </div>

                    <div className="space-y-1 hidden lg:block">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Joined</p>
                      <p className="text-sm font-medium text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Badge
                      variant="outline"
                      className={cn(
                        "relative h-6 px-2.5 text-[10px] font-bold uppercase tracking-widest border rounded-full transition-all",
                        user.status === "APPROVED" && "bg-green-50 text-green-700 border-green-100",
                        user.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-100",
                        (user.status === "BANNED" || user.status === "REJECTED") && "bg-red-50 text-red-700 border-red-100"
                      )}
                    >
                      <span className="relative flex h-1.5 w-1.5 mr-1.5">
                        {user.status === "APPROVED" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        )}
                        <span className={cn(
                          "relative inline-flex rounded-full h-1.5 w-1.5",
                          user.status === "APPROVED" ? "bg-green-500" :
                            user.status === "PENDING" ? "bg-amber-500" :
                              "bg-red-500" 
                        )}></span>
                      </span>

                      {user.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Separator className="my-1" />
                        <DropdownMenuItem
                          onClick={() => router.push('/vendor/users/' + user.id)}
                          className='cursor-pointer'
                        >View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Devices</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
                <p className="text-muted-foreground">No users matching your search.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination Footer */}
      {!isLoading && !isError && (
        <div className="flex items-center justify-between pb-8">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{data?.stats.totalUsers || 0}</strong> users
          </p>
          <div className="flex gap-2">
            {/* <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorUserListPage;

