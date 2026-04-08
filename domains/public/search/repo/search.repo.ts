import { prisma } from "@/lib/prisma";
import { SearchBy } from "../dto/search.dto";

export class SearchRepo {
    async SearchByUserQuery(q: string, searchBy: SearchBy, startOfToday: Date, endOfToday: Date) {
        return await prisma.aQIReading.findMany({
            where: {
                [searchBy]: {
                    startsWith: q,
                    mode: "insensitive"
                },
                createdAt: {
                    gte: startOfToday,
                    lt: endOfToday
                }
            },
            select: {
                id: true,
                city: true,
                state: true,
                country: true,
                street: true,
                aqi: true,
                createdAt: true,
                lat: true,
                lng: true
            },
            take: 10,
        })
    }
}