"use client"

import {
  User as UserIcon,
  Building2,
  ShieldCheck,
  Calendar,
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"


interface VendorData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  gstNumber: string | null;
  status: string;
  createdAt: string;
}

const VendorProfilePage = () => {
  const { data: vendor, isLoading, isError, error, refetch } = useQuery < VendorData > ({
    queryKey: ["vendor-profile"],
    queryFn: async () => {
      const response = await http.get("/api/vendor/profile");
      if (response.status == 200) {
        return response.data;
      }
      throw new Error(response.data.message || 'Something went wrong');
    },
  });

  //  Loading State
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  //  Error State
  if (isError) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center p-8">
        <Card className="max-w-md border-destructive/50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
            <h3 className="text-lg font-bold">Failed to load profile</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              {error instanceof Error ? error.message : "An unexpected error occurred while fetching your data."}
            </p>
            <Button onClick={() => refetch()} variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and business information.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" disabled>Reset Password</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" disabled>Edit Profile</Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                  <UserIcon className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">{vendor?.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{vendor?.email}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize">
                    Vendor
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none capitalize">
                    {vendor?.status.toLowerCase()}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Joined:</span>
                  <span className="font-medium">
                    {vendor?.createdAt ? format(new Date(vendor.createdAt), "MMMM dd, yyyy") : "N/A"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Status:</span>
                  <span className="font-medium">Verified Account</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Business Information
              </CardTitle>
              <CardDescription>Official business and tax registration details.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization Name</p>
                <p className="text-sm font-medium">{vendor?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GST Number</p>
                <p className="text-sm font-medium">{vendor?.gstNumber || "Not Provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</p>
                <p className="text-sm font-medium">{vendor?.phoneNumber || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Official Email</p>
                <p className="text-sm font-medium">{vendor?.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compliance & Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">gst_Certificate.pdf</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VendorProfilePage