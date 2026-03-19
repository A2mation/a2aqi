'use client'

import { useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { DeviceSubscription } from "@prisma/client";

export const useSubscription = (deviceId: string | string[] | undefined) => {
    const query = useQuery({
        queryKey: ["subscription", deviceId],
        queryFn: async () => {
            const res = await http.get<{ data : DeviceSubscription }>(`/api/user/subscription/validate?deviceId=${deviceId}`);
            return res.data;
        },
        enabled: !!deviceId,
        staleTime: 1000 * 60 * 5,
    });
    
    return {
        subscription: query.data?.data,
        isLoading: query.isLoading,
        isLocked: !query.isLoading && !query.data?.data,
        isError: query.isError
    };
};