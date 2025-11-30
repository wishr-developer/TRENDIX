import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types/product';
import { sendPriceAlertNotificationEmail } from '@/lib/email';

// 動的レンダリングを強制（request.headersを使用するため）
export const dynamic = 'force-dynamic';

/**
 * URLからASINを抽出
 */
function extractASIN(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  return match ? (match[1] || match[2]) : null;
}

/**
 * アラートデータの型定義
 */
interface Alert {
  id: string;
  asin: string;
  email: string;
  targetPrice: number;
  createdAt: string;
  notifiedAt?: string; // 通知済みの日時
  isActive: boolean; // アクティブなアラートかどうか
}

/**
 * アラート監視ジョブAPI
 * GET /api/alert-check
 * 
 * セキュリティ: ALERT_SECRET環境変数で認証
 */
export async function GET(request: NextRequest) {
  try {
    // セキュリティチェック: 秘密のトークンを検証
    const authHeader = request.headers.get('authorization');
    const secretToken = process.env.ALERT_SECRET;
    
    if (!secretToken) {
      console.error('ALERT_SECRET is not set');
      return NextResponse.json(
        { success: false, message: 'サーバー設定エラー: ALERT_SECRETが設定されていません' },
        { status: 500 }
      );
    }

    // Authorizationヘッダーまたはクエリパラメータからトークンを取得
    const providedToken = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');
    
    if (!providedToken || providedToken !== secretToken) {
      return NextResponse.json(
        { success: false, message: '認証に失敗しました' },
        { status: 401 }
      );
    }

    // アラートデータファイルのパス
    const alertsFilePath = path.join(process.cwd(), 'data', 'alerts.json');
    
    // アラートデータが存在しない場合は空配列を返す
    if (!fs.existsSync(alertsFilePath)) {
      return NextResponse.json({
        success: true,
        message: 'アラートデータが存在しません',
        checked: 0,
        notified: 0,
      });
    }

    // アラートデータを読み込む
    let alerts: Alert[] = [];
    try {
      const alertsContent = fs.readFileSync(alertsFilePath, 'utf8');
      alerts = JSON.parse(alertsContent);
    } catch (error) {
      console.error('アラートデータの読み込みに失敗しました:', error);
      return NextResponse.json(
        { success: false, message: 'アラートデータの読み込みに失敗しました' },
        { status: 500 }
      );
    }

    // アクティブなアラートのみをフィルタリング
    const activeAlerts = alerts.filter(alert => alert.isActive);

    if (activeAlerts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'アクティブなアラートがありません',
        checked: 0,
        notified: 0,
      });
    }

    // 商品データを読み込む
    const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
    let products: Product[] = [];
    
    try {
      if (fs.existsSync(productsFilePath)) {
        const productsContent = fs.readFileSync(productsFilePath, 'utf8');
        products = JSON.parse(productsContent);
      }
    } catch (error) {
      console.error('商品データの読み込みに失敗しました:', error);
      return NextResponse.json(
        { success: false, message: '商品データの読み込みに失敗しました' },
        { status: 500 }
      );
    }

    // アラートをチェックして通知を送信
    let notifiedCount = 0;
    const updatedAlerts = [...alerts];

    for (const alert of activeAlerts) {
      // 商品を検索
      let product: Product | undefined;
      
      // まず、product.asinで検索
      product = products.find(p => p.asin === alert.asin);
      
      // asinフィールドがない場合は、affiliateUrlからASINを抽出して比較
      if (!product) {
        product = products.find(p => {
          const productASIN = extractASIN(p.affiliateUrl);
          return productASIN === alert.asin;
        });
      }

      // 商品が見つからない場合はスキップ
      if (!product) {
        console.warn(`商品が見つかりません: ASIN ${alert.asin}`);
        continue;
      }

      // 現在価格が目標価格以下かチェック
      if (product.currentPrice <= alert.targetPrice) {
        // 既に通知済みの場合はスキップ（重複通知を防ぐ）
        if (alert.notifiedAt) {
          continue;
        }

        // 商品情報を取得
        const productName = product.name || '不明な商品';
        const currentPrice = product.currentPrice;
        const productUrl = product.affiliateUrl || `https://www.amazon.co.jp/dp/${alert.asin}`;

        // 通知メールを送信
        const emailResult = await sendPriceAlertNotificationEmail(
          alert.email,
          productName,
          currentPrice,
          alert.targetPrice,
          productUrl
        );

        if (emailResult.success) {
          // アラートを更新（通知済みフラグを設定）
          const alertIndex = updatedAlerts.findIndex(a => a.id === alert.id);
          if (alertIndex !== -1) {
            updatedAlerts[alertIndex] = {
              ...updatedAlerts[alertIndex],
              notifiedAt: new Date().toISOString(),
              isActive: false, // 通知後は非アクティブにする（1回限りの通知）
            };
            notifiedCount++;
            console.log(`アラート通知を送信しました: ${alert.email} - ${productName}`);
          }
        } else {
          console.error(`アラート通知の送信に失敗しました: ${alert.email} - ${emailResult.error}`);
        }
      }
    }

    // 更新されたアラートデータを保存
    try {
      fs.writeFileSync(alertsFilePath, JSON.stringify(updatedAlerts, null, 2), 'utf8');
    } catch (error) {
      console.error('アラートデータの保存に失敗しました:', error);
      // 保存に失敗しても、通知は送信済みなので成功として返す
    }

    return NextResponse.json({
      success: true,
      message: `アラートチェックが完了しました`,
      checked: activeAlerts.length,
      notified: notifiedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Alert check error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : '不明なエラーが発生しました';
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'アラートチェック中にエラーが発生しました',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

