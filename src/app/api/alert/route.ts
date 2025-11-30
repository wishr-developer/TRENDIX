import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types/product';
import { sendPriceAlertConfirmationEmail } from '@/lib/email';

/**
 * URLからASINを抽出
 */
function extractASIN(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  return match ? (match[1] || match[2]) : null;
}

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
        { success: false, message: '必須フィールドが不足しています' },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'メールアドレスの形式が不正です' },
        { status: 400 }
      );
    }

    // ターゲット価格のチェック
    if (typeof targetPrice !== 'number' || targetPrice <= 0) {
      return NextResponse.json(
        { success: false, message: '目標価格が不正です' },
        { status: 400 }
      );
    }

    // 商品データを読み込んで、ASINから商品情報を取得
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    let products: Product[] = [];
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        products = JSON.parse(fileContents);
      }
    } catch (error) {
      console.error('商品データの読み込みに失敗しました:', error);
      // 商品データの読み込みに失敗しても、アラート設定は続行
    }

    // ASINから商品情報を検索
    let product: Product | undefined;
    
    // まず、product.asinで検索
    if (products.length > 0) {
      product = products.find(p => p.asin === asin);
    }
    
    // asinフィールドがない場合は、affiliateUrlからASINを抽出して比較
    if (!product && products.length > 0) {
      product = products.find(p => {
        const productASIN = extractASIN(p.affiliateUrl);
        return productASIN === asin;
      });
    }

    // 商品情報が見つからない場合でも、アラート設定は続行（商品名は「不明な商品」とする）
    const productName = product?.name || '不明な商品';
    const currentPrice = product?.currentPrice || 0;
    const productUrl = product?.affiliateUrl || `https://www.amazon.co.jp/dp/${asin}`;

    // メール送信
    const emailResult = await sendPriceAlertConfirmationEmail(
      email,
      productName,
      currentPrice,
      targetPrice,
      productUrl
    );

    // メール送信に失敗した場合でも、アラート設定自体は成功とする
    // （メール送信は補助的な機能であり、アラート設定の主機能ではない）
    if (!emailResult.success) {
      console.warn('メール送信に失敗しましたが、アラート設定は続行します:', emailResult.error);
    }

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      message: `アラートを設定しました。確認メールを送信しました。`,
      data: {
        asin,
        targetPrice,
        email,
        productName,
        currentPrice,
        productUrl,
        emailSent: emailResult.success,
        emailMessageId: emailResult.messageId,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Alert API error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : '不明なエラーが発生しました';
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'アラート設定中にエラーが発生しました',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

