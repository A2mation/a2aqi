'use client'

import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Cpu, Hash, Key, Loader2, ShieldCheck } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { moderatordeviceSchema, ModeratordeviceValues } from '@/lib/validation/ModeratorDevice'
import { http } from "@/lib/http"
import { DeviceModel } from "@/types/devices"


const RegisterDevicePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(moderatordeviceSchema),
    defaultValues: {
      name: "",
      serialNo: "",
      model: "",
      apiKey: "",
    },
  });

  // Fetch dynamic models from your API
  const { data: models, isLoading: loadingModels } = useQuery<DeviceModel[]>({
    queryKey: ["device-models"],
    queryFn: async () => (await http.get('/api/moderators/models')).data,
    staleTime: 1000 * 60 * 5 // 5 Mins
  });

  // Mutation: For new Device Registration
  const mutation = useMutation({
    mutationFn: async (values: ModeratordeviceValues) => {
      const { data } = await http.post('/api/moderators/devices/register-new-device', values);
      return data;
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['moderator-devices'] });
      toast.success('Device Added Successfully');
      router.push('/moderator');
    },
    onError: (error: any) => {
      console.error('Registration failed:', error.message);
      toast.error(error.message || 'Something Went Wrong');
    }
  });


  function onSubmit(values: ModeratordeviceValues) {
    mutation.mutate(values);
  }

  return (
    <div className="min-h-[90dvh] bg-[#f8fafc] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-100/50 "
      >
        <div className="p-8 bg-slate-900 text-white relative rounded-t-[30px]">
          <div className="relative z-10">
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Cpu className="text-blue-400" />
              Register New Device
            </h1>
            <p className="text-slate-400 text-sm mt-1">Connect your AQI hardware to the cloud network.</p>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Device Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase text-slate-500 tracking-widest">Device Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Office_01"
                        {...field}
                        className="rounded-xl border-slate-200 focus:ring-blue-500"
                        disabled={mutation.isPending || loadingModels}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* Model Select */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase text-slate-500 tracking-widest">Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingModels || mutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-200">
                          {loadingModels ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              <span className="text-slate-400">Loading models...</span>
                            </div>
                          ) : (
                            <SelectValue placeholder="Select Model" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {models?.map((model) => (
                          <SelectItem key={model.id} value={model.name}>
                            {model.name}
                          </SelectItem>
                        ))}
                        {!loadingModels && models?.length === 0 && (
                          <div className="p-2 text-xs text-center text-slate-400">No active models found</div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Serial Number */}
            <FormField
              control={form.control}
              name="serialNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase text-slate-500 tracking-widest">Serial Number <span className="text-red-600">(CAPITAL LETTER)</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <Input
                        placeholder="SN-XXXX-XXXX"
                        {...field}
                        className="pl-10 rounded-xl border-slate-200"
                        disabled={mutation.isPending || loadingModels}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* API Key */}
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase text-slate-500 tracking-widest">Device API Key <span className="text-red-600">(CAPITAL LETTER)</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <Input
                        type="password"
                        placeholder="Enter security key"
                        {...field}
                        className="pl-10 rounded-xl border-slate-200"
                        disabled={mutation.isPending || loadingModels}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
              disabled={mutation.isPending || loadingModels}
            >
              Confirm Registration
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  )
}

export default RegisterDevicePage