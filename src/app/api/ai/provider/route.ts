import { NextResponse } from 'next/server';
import {
  getAIProvider,
  getProviderBaseUrl,
  getProviderModel,
  getPrimaryProviderName,
  testAIProvider,
} from '@/lib/ai/aiProvider';

export async function GET() {
  try {
    const result = await testAIProvider();
    const activeProvider = getAIProvider();
    const providerName = result.provider || activeProvider.name;

    return NextResponse.json({
      provider: providerName,
      primary: getPrimaryProviderName(),
      model: getProviderModel(providerName),
      baseUrl: getProviderBaseUrl(providerName),
      hasKey: activeProvider.isConfigured(),
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        primary: getPrimaryProviderName(),
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
