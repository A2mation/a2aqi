"use client"

import * as z from "zod";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { Admin } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Trash, FileText, Van } from "lucide-react"
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { http } from "@/lib/http";
import { Input } from "@/components/ui/input"
import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import AlertModal from "@/components/modals/alert-modal";
import { VendorEditFormSchema } from "@/lib/validation/vendor/Vendor.registration.schema";

type VendorFormValues = z.infer<typeof VendorEditFormSchema>

interface VendorFormProps {
    initialData: Admin;
}

export const VendorForm = ({ initialData }: VendorFormProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm < VendorFormValues > ({
        resolver: zodResolver(VendorEditFormSchema),
        defaultValues: {
            name: initialData.name || "",
            email: initialData.email || "",
            phoneNumber: initialData.phoneNumber || "",
            address: initialData.address || "",
            gstNumber: initialData.gstNumber || "",
            gstCertificate: initialData.gstCertificate || "",
            status: initialData.status || "PENDING",
            password: "",
        },
    });

    const onSubmit = async (values: VendorFormValues) => {
        try {
            setLoading(true);
            const payload = { ...values };
            if (!payload.password) delete payload.password;

            const res = await http.patch(`/api/admin/vendors/${params.vendorId}`, payload);

            if (res.status == 200 && !res.data.error) {
                router.push('/admin/vendors');
                router.refresh();
                toast.success("Vendor updated successfully");
                return;
            }

            toast.error(res.data.message || "Cannot alter the details");
            throw new Error(res.data.message || "Cannot alter the details");

        } catch (error: any) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            const res = await http.delete(`/api/admin/vendors/${params.vendorId}`);

            if (res.status == 200 && !res.data.error) {
                router.push('/admin/vendors');
                router.refresh();
                toast.success("Vendor account deleted.");
            }

            toast.error(res.data.message || "Cannot alter the details");
            throw new Error(res.data.message || "Cannot alter the details");

        } catch (error) {
            toast.error("An error occurred while deleting the vendor.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex justify-between items-center">
                <Heading
                    title="Edit Vendor"
                    description="Update vendor credentials and verification status"
                    Icon={Van}
                />
                <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    {/* GST Certificate Preview */}
                    <div className="space-y-4">
                        <FormLabel>GST Certificate (Click to zoom)</FormLabel>
                        {initialData.gstCertificate ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative w-75 h-50 rounded-md overflow-hidden border cursor-zoom-in group">
                                        <Image
                                            fill
                                            className="object-contain bg-slate-50 transition group-hover:opacity-80"
                                            alt="GST Certificate Preview"
                                            src={initialData.gstCertificate}
                                        />
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="max-w-none w-screen h-fit m-0 p-0 bg-white/60 border-none flex items-center justify-center outline-none ring-0">

                                    <div className="sr-only">
                                        <DialogTitle>GST Certificate Viewer</DialogTitle>
                                        <DialogDescription>Use mouse wheel or pinch gestures to zoom.</DialogDescription>
                                    </div>


                                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                        <QuickPinchZoom
                                            onUpdate={({ x, y, scale }) => {
                                                const el = document.getElementById("zoom-target");
                                                if (el) {
                                                    el.style.setProperty("transform", make3dTransformValue({ x, y, scale }));
                                                }
                                            }}
                                            wheelScaleFactor={0.005}
                                        >
                                            <div id="zoom-target" className="relative w-[85dvw] h-[60dvh] transition-transform duration-75 ease-out">
                                                <Image
                                                    fill
                                                    src={initialData.gstCertificate}
                                                    alt="GST Certificate Full View"
                                                    className="object-contain"
                                                    quality={100}
                                                    priority
                                                />
                                            </div>
                                        </QuickPinchZoom>
                                    </div>

                                    <div className="fixed bottom-10 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-black text-sm border border-white/20">
                                        Scroll to Zoom • Drag to Pan
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <div className="flex items-center justify-center w-75 h-50 bg-secondary rounded-md border-dashed border-2">
                                <div className="text-center text-muted-foreground">
                                    <FileText className="mx-auto h-8 w-8 mb-2" />
                                    <p className="text-sm">No certificate image</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Status Change Select */}
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Status</FormLabel>
                                <Select
                                    disabled={loading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                        <SelectItem value="BANNED">Banned</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor Name</FormLabel>
                                <FormControl><Input disabled={loading} {...field} value={field.value || ""} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="gstNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>GST Number</FormLabel>
                                <FormControl><Input disabled={loading} {...field} value={field.value || ""} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="gstCertificate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Certificate Cloudinary URL</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <Button disabled={loading} type="submit">
                        Update Vendor
                    </Button>
                </form>
            </Form>
        </>
    )
}