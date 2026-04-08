import { NextResponse } from "next/server";

import { SearchService } from "../service/search.service";

export class SearchController {
    private searchServiceOBJ = new SearchService();

    async searchController(req: Request) {
        try {
            const { searchParams } = new URL(req.url);
            const q = searchParams.get("q")?.trim();

            if (!q || q.length < 2) {
                return NextResponse.json({
                    success: true,
                    cities: [],
                    states: [],
                    streets: []
                });
            }

            const results = await this.searchServiceOBJ.SearchService(q);

            const isEmpty =
                results.cities.length === 0 &&
                results.states.length === 0 &&
                results.streets.length === 0;

            if (isEmpty) {
                return NextResponse.json(
                    { success: false, message: "No results found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                ...results
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Internal server error" },
                { status: 500 }
            );
        }
    }
}