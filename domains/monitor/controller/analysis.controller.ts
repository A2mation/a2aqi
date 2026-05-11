import { NextResponse } from "next/server";
import { AdvancedAnalysiService } from "../service/analysis.service";

export class AdvanceAnalysisController {
    async getAllDataAtOnce(req: Request) {
        const { searchParams } = new URL(req.url);
        const service = new AdvancedAnalysiService();

        try {
            const monitorId = searchParams.get('monitorId');

            if (!monitorId) {
                return NextResponse.json(
                    { error: 'monitorId is required' },
                    { status: 400 }
                );
            }

            const dateStr = new Date().toISOString();

            const data = await service.getAllData(monitorId, {
                type: 'custom',
                dateStr: dateStr,
                day: 90
            });

            return NextResponse.json(data, {
                status: 200,
            });

        } catch (error: any) {
            console.error('Analytics Controller Error:', error);
            return NextResponse.json(
                { error: 'Internal Server Error', details: error.message },
                { status: 500 }
            );
        }
    }
}