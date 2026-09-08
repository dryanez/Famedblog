import { NextResponse } from 'next/server';
import { processCampaignSend } from '@/lib/campaigns';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Delegate to shared library
        const result = await processCampaignSend(body);

        if (!result.success) {
            return NextResponse.json({
                error: result.error || 'Failed to send campaign',
                debug: result.debug
            }, { status: 400 });
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
