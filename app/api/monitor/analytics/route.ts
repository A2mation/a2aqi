import { AdvanceAnalysisController } from "@/domains/monitor/controller/analysis.controller";

export async function GET(req: Request) {
    return new AdvanceAnalysisController().getAllDataAtOnce(req);
}