import * as z from "zod";
import { DeviceType } from "@prisma/client";

export const deviceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  serialNo: z.string().min(1, "Serial is required"),
  isActive: z.boolean().default(true), 
  
  type: z.enum(DeviceType),
  assignedAt: z.string(),
  
  loaction: z.string().nullable().default(null),
  
  lat: z.string().optional().default(""),
  lng: z.string().optional().default(""),
});

export type DeviceFormValues = z.infer<typeof deviceSchema>;
