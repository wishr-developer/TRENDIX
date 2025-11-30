import { NextRequest, NextResponse } from 'next/server';

/**
 * 価格アラート受付API
 * POST /api/alert
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asin, targetPrice, email } = body;

    // バリデーション
    if (!asin || !targetPrice || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // ターゲット価格のチェック
    if (typeof targetPrice !== 'number' || targetPrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid target price' },
        { status: 400 }
      );
    }

    // モック機能：コンソールにログを出力
    console.log('=== 価格アラート設定 ===');
    console.log(`ASIN: ${asin}`);
    console.log(`ターゲット価格: ¥${targetPrice.toLocaleString()}`);
    console.log(`通知先メール: ${email}`);
    console.log(`設定日時: ${new Date().toISOString()}`);
    console.log('======================');

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      message: `Alert set for ${asin}`,
      data: {
        asin,
        targetPrice,
        email,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Alert API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

