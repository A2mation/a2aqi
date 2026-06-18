'use client'

import z from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { http } from '@/lib/http'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChartBarInteractive } from '@/components/admin-ui/charts/chart'

const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormValues = z.infer<typeof formSchema>

const AdminMainPannel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const response = await http.patch('/api/admin', values);

      if (response.status === 200) {
        toast.success(response.data.message || "Password updated successfully.");
        router.refresh();
        return;
      }

      toast.error(response.data.message || "Something went wrong.");
      router.refresh();

    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ChartBarInteractive />

      <section className="my-8 border rounded-lg p-8 bg-card shadow-xl">
        <h2 className="text-3xl font-medium mb-4">Update Admin Password</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Update the password for the admin account. Make sure to choose a strong password.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" disabled={loading} {...field} /></FormControl>
                <FormDescription className="text-sm text-destructive">
                  "Leave blank to keep current password"
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <Button disabled={loading} type="submit">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </section>
    </>
  )
}

export default AdminMainPannel
