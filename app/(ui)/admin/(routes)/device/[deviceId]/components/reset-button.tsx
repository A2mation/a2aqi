'use client'

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2 } from 'lucide-react'

import { http } from '@/lib/http';
import { Button } from '@/components/ui/button'
import ConfirmActionModal from '@/components/modals/confirm-action-modal';

interface DeleteDeviceSectionProps {
    id: string;
    serialNo: string;
}

export const DeleteDeviceSection = ({
    id,
    serialNo,
}: DeleteDeviceSectionProps) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);

            const res = await http.delete('/api/admin/device', {
                params: { id }
            });

            if (res.status >= 200 && res.status < 300) {
                toast.success(res.data?.message || "Device deleted successfully");
                router.refresh();
                setOpen(false); 
                return;
            }

            if (res.status === 401 || res.status === 403) {
                toast.error("Unauthorized: Admin access required.");
            } else if (res.status === 404) {
                toast.error("Device not found. It may have already been deleted.");
            } else if (res.status === 400) {
                toast.error(res.data?.message || "Invalid request parameters.");
            } else {
                toast.error(res.data?.message || "A server error occurred.");
            }

        } catch (err) {
            toast.error("Network error: Please check your connection.");
            console.error("CRITICAL_ERROR:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <ConfirmActionModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                passphrase={serialNo}
            />

            <div className="mt-12 space-y-6 border-t pt-10">
                <div className="flex items-center gap-x-2 text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                    <h3 className="text-xl font-bold tracking-tight">Danger Zone</h3>
                </div>

                <div className="rounded-lg border-2 border-destructive/20 bg-destructive/5">
                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-bold uppercase tracking-wider text-destructive">
                                Permanently Delete Device Records
                            </p>
                            <p className="text-sm text-muted-foreground max-w-full">
                                This action will delete **all subscription history, logs, and ownership records** associated with serial number <code className="bg-destructive/10 px-1 py-0.5 rounded font-mono text-destructive">{serialNo}</code>.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setOpen(true)}
                            className="w-full md:w-auto px-8 h-12 font-bold shadow-lg shadow-destructive/20 active:scale-95 transition-all"
                        >
                            <Trash2 className="mr-2 h-5 w-5" />
                            Delete All Records
                        </Button>
                    </div>

                    <div className="bg-destructive/10 px-6 py-2">
                        <p className="text-[10px] uppercase font-bold text-destructive/60">
                            Internal Administrative Override - Restricted Access
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}