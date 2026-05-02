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
  User
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/ui/Heading';
import { Separator } from '@/components/ui/separator';
import { Button, buttonVariants } from '@/components/ui/button';

const DUMMY_USERS = [
  {
    id: "65a1b2c3d4e5f6g7h8i9j0",
    name: "Aarav Sharma",
    email: "aarav.s@industrial.co",
    phoneNumber: "+91 98765 43210",
    accountType: "ORGANIZATION",
    organizationName: "Astra Manufacturing",
    gstNumber: "27AAACA1234A1Z5",
    authProvider: "LOCAL",
    createdAt: "2024-03-15T10:30:00Z"
  },
  {
    id: "65b2c3d4e5f6g7h8i9j0k1",
    name: "Sarah Jenkins",
    email: "s.jenkins@gmail.com",
    phoneNumber: "+1 415 555 0123",
    accountType: "PERSONAL",
    organizationName: null,
    gstNumber: null,
    authProvider: "GOOGLE",
    createdAt: "2024-04-02T14:20:00Z"
  },
  {
    id: "65c3d4e5f6g7h8i9j0k1l2",
    name: "TechFlow Systems",
    email: "admin@techflow.io",
    phoneNumber: "+44 20 7946 0958",
    accountType: "ORGANIZATION",
    organizationName: "TechFlow Solutions Ltd",
    gstNumber: "GB123456789",
    authProvider: "LOCAL",
    createdAt: "2024-05-10T09:00:00Z"
  }
];

const VendorUserListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mount, setMount] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) {
    return null;
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8  min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Heading
          title="User Management"
          description="Manage your vendor accounts, monitor registrations, and verify organization details."
          Icon={User}
        />
        <Link
          href={'/vendor/users/register'}
          className={cn(
            buttonVariants({
              variant: 'default'
            }),
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
          { label: "Total Users", value: "1,284", icon: Users, color: "text-blue-600" },
          { label: "Organizations", value: "432", icon: Building2, color: "text-purple-600" },
          { label: "Active Nodes", value: "892", icon: ShieldCheck, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
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
          <Button variant="outline" className="flex-1 md:flex-none">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table/List View for Webiste/Mobiles*/}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4"
      >
        {DUMMY_USERS.map((user) => (
          <motion.div
            key={user.id}
            variants={itemVariants}
            className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2">
                  {user.name}
                  {user.accountType === "ORGANIZATION" && (
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
              <Button
                variant="ghost"
                size="sm"
                className="group/btn text-xs font-semibold cursor-pointer hover:bg-primary/5 transition-all"
              >
                View Profile
                <ArrowUpRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Separator className="my-1" />
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>View Devices</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pb-8">
        <p className="text-sm text-muted-foreground">
          Showing <strong>3</strong> of <strong>1,284</strong> users
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default VendorUserListPage;