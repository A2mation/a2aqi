import { SearchController } from "@/domains/public/search/controller/search.controller";

export async function GET(req: Request) {
    return new SearchController().searchByCityController(req);
}