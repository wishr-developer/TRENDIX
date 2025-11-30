import { Resend } from 'resend';

/**
 * Resendクライアントの初期化
 * 環境変数 RESEND_API_KEY からAPIキーを読み込む
 */
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * 価格アラート確認メールを送信
 * @param to 送信先メールアドレス
 * @param productName 商品名
 * @param currentPrice 現在の価格
 * @param targetPrice 目標価格
 * @param productUrl 商品URL
 * @returns 送信結果
 */
export async function sendPriceAlertConfirmationEmail(
  to: string,
  productName: string,
  currentPrice: number,
  targetPrice: number,
  productUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // APIキーが設定されていない場合
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email sending is disabled.');
    return {
      success: false,
      error: 'Email service is not configured',
    };
  }

  // 送信元メールアドレス（環境変数から取得、デフォルトは noreply@yourdomain.com）
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `【TRENDIX】価格アラートを設定しました: ${productName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>価格アラート設定完了</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #111827; font-size: 24px; margin-bottom: 20px;">
                🎯 価格アラートを設定しました
              </h1>
              
              <p style="color: #6b7280; margin-bottom: 30px;">
                ご登録いただいた商品の価格が目標価格に達した際に、お知らせメールをお送りします。
              </p>
              
              <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
                <h2 style="color: #111827; font-size: 18px; margin-bottom: 15px;">
                  ${productName}
                </h2>
                
                <div style="margin-bottom: 10px;">
                  <span style="color: #6b7280; font-size: 14px;">現在の価格:</span>
                  <span style="color: #111827; font-size: 20px; font-weight: bold; margin-left: 10px;">
                    ¥${currentPrice.toLocaleString()}
                  </span>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <span style="color: #6b7280; font-size: 14px;">目標価格:</span>
                  <span style="color: #ef4444; font-size: 20px; font-weight: bold; margin-left: 10px;">
                    ¥${targetPrice.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${productUrl}" 
                   style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  商品を確認する
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">
                このメールは、TRENDIXの価格アラート機能で自動送信されました。<br>
                アラートを解除する場合は、商品ページから設定を変更してください。
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
価格アラートを設定しました

商品名: ${productName}
現在の価格: ¥${currentPrice.toLocaleString()}
目標価格: ¥${targetPrice.toLocaleString()}

商品を確認する: ${productUrl}

このメールは、TRENDIXの価格アラート機能で自動送信されました。
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 価格アラート通知メールを送信（価格が目標価格に達した時）
 * @param to 送信先メールアドレス
 * @param productName 商品名
 * @param currentPrice 現在の価格
 * @param targetPrice 目標価格
 * @param productUrl 商品URL
 * @returns 送信結果
 */
export async function sendPriceAlertNotificationEmail(
  to: string,
  productName: string,
  currentPrice: number,
  targetPrice: number,
  productUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // APIキーが設定されていない場合
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email sending is disabled.');
    return {
      success: false,
      error: 'Email service is not configured',
    };
  }

  // 送信元メールアドレス（環境変数から取得、デフォルトは noreply@yourdomain.com）
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `【TRENDIX】🎉 目標価格に達しました！: ${productName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>目標価格に達しました</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #ef4444; font-size: 28px; margin-bottom: 20px; text-align: center;">
                🎉 目標価格に達しました！
              </h1>
              
              <p style="color: #6b7280; margin-bottom: 30px; text-align: center;">
                ご登録いただいた商品の価格が目標価格に達しました。今が買い時です！
              </p>
              
              <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
                <h2 style="color: #111827; font-size: 18px; margin-bottom: 15px;">
                  ${productName}
                </h2>
                
                <div style="margin-bottom: 10px;">
                  <span style="color: #6b7280; font-size: 14px;">現在の価格:</span>
                  <span style="color: #ef4444; font-size: 24px; font-weight: bold; margin-left: 10px;">
                    ¥${currentPrice.toLocaleString()}
                  </span>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <span style="color: #6b7280; font-size: 14px;">目標価格:</span>
                  <span style="color: #111827; font-size: 20px; font-weight: bold; margin-left: 10px;">
                    ¥${targetPrice.toLocaleString()}
                  </span>
                </div>
                
                <div style="background-color: #fef2f2; padding: 10px; border-radius: 4px; margin-top: 15px;">
                  <p style="color: #ef4444; font-size: 14px; margin: 0; font-weight: 600;">
                    ✅ 目標価格を達成しました！
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${productUrl}" 
                   style="display: inline-block; background-color: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  今すぐ購入する
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">
                このメールは、TRENDIXの価格アラート機能で自動送信されました。<br>
                価格は変動する可能性があるため、購入前に必ずAmazon公式サイトで価格を確認してください。
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
🎉 目標価格に達しました！

商品名: ${productName}
現在の価格: ¥${currentPrice.toLocaleString()}
目標価格: ¥${targetPrice.toLocaleString()}

✅ 目標価格を達成しました！

商品を確認する: ${productUrl}

このメールは、TRENDIXの価格アラート機能で自動送信されました。
価格は変動する可能性があるため、購入前に必ずAmazon公式サイトで価格を確認してください。
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

