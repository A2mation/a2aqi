"use client"

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddressType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MapPin, Phone, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { http } from "@/lib/http";
import { addressSchema } from "@/lib/validation/UserAddressSchema";
import { cn } from "@/lib/utils";


interface Address {
  id: string;
  name: string,
  type: AddressType;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  email: string,
  phoneNumber: string
}

interface UserData {
  id: string;
  billingAddressId?: string;
  addresses?: Address[];
}

interface AddressFormProps {
  user: UserData | null;
  isLoading: boolean;
  showAddressSection?: boolean
}

export const AddressForm = ({ user, isLoading: profileLoading, showAddressSection = true }: AddressFormProps) => {
  const queryClient = useQueryClient()
  const [isAddingAddress, setIsAddingAddress] = useState(false)

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      zipCode: "",
      type: AddressType.BILLING,
      street: "",
      city: "",
      state: "",
      email: "",
      phoneNumber: "",
    }
  });

  const addAddressMutation = useMutation({
    mutationFn: async (address: Partial<Address>) => {
      const { data } = await http.post("/api/user/address", address)
      return data
    },
    onSuccess: () => {
      toast.success("Address added successfully")
      setIsAddingAddress(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
    onError: () => toast.error("Failed to save address")
  })

  const handlePincodeLookup = async (pincode: string) => {
    if (pincode.length === 6) {
      try {
        const res = await http.get(`https://api.postalpincode.in/pincode/${pincode}`)
        const data = res.data[0];
        if (data.Status === "Success") {
          form.setValue("city", data.PostOffice[0].District)
          form.setValue("state", data.PostOffice[0].State)
          toast.success("Location detected")
        } else {
          toast.error("Invalid Pincode")
        }
      } catch (e) {
        toast.error("Pincode service unavailable")
      }
    }
  }

  const pincode = form.watch("zipCode");
  useEffect(() => {
    if (pincode?.length === 6) handlePincodeLookup(pincode);
  }, [pincode]);

  return (
    <div className="space-y-6">
      {/* Toggle Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Addresses</h3>
        <Button
          variant={isAddingAddress ? "ghost" : "outline"}
          size="sm"
          onClick={() => setIsAddingAddress(!isAddingAddress)}
        >
          {isAddingAddress ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {isAddingAddress ? "Cancel" : "Add New"}
        </Button>
      </div>

      {/* Add Address Form */}
      {isAddingAddress && (
        <div className="bg-gray-50/50 p-6 rounded-xl border-2 border-dashed border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((vals) => addAddressMutation.mutate(vals))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Billing Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="6-digit PIN" maxLength={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>
                              Address Types
                            </SelectLabel>
                            {Object.values(AddressType).map((type) => (
                              <SelectItem key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street / Area / Building</FormLabel>
                        <FormControl>
                          <Input placeholder="Flat No, Street, Landmark..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" disabled className="bg-gray-100" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" disabled className="bg-gray-100" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={addAddressMutation.isPending}>
                {addAddressMutation.isPending ? <Loader2 className="animate-spin" /> : "Save Address"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {showAddressSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.addresses?.map((addr) => {
            const isDefault = user.billingAddressId === addr.id;
            return (
              <div
                key={addr.id}
                className={cn(
                  "group relative p-5 rounded-xl border-2 transition-all duration-200 flex justify-between items-start hover:shadow-md",
                  isDefault ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                <div className="flex gap-4">
                  <div className={cn(
                    "p-2 rounded-full h-fit",
                    isDefault ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
                  )}>
                    <MapPin className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm tracking-tight capitalize">
                        {addr.type.toLowerCase()}
                      </p>
                      {isDefault && (
                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-md font-bold uppercase">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 leading-snug max-w-50">
                      {addr.name}
                    </p>
                    <p className="text-sm text-gray-700 leading-snug max-w-50">
                      {addr.street}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {addr.city}, {addr.state} — {addr.zipCode}
                    </p>

                    <div className="pt-2 space-y-1 border-t border-gray-100 mt-2">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Mail className="w-3 h-3" /> {addr.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Phone className="w-3 h-3" /> {addr.phoneNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {user?.addresses?.length === 0 && !isAddingAddress && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-gray-200 bg-gray-50">
              <MapPin className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">No saved addresses found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};