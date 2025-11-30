import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product } from "@/types/product";

/**
 * URLからASINを抽出
 */
function extractASIN(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  return match ? (match[1] || match[2]) : null;
}

/**
 * 特定のASINの商品データを取得するAPI
 */
export async function GET(
  request: Request,
  { params }: { params: { asin: string } }
) {
  try {
    const { asin } = params;
    
    // ASINのバリデーション
    if (!asin || asin.length !== 10) {
      return NextResponse.json(
        { error: "無効なASINです" },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    const filePath = path.join(process.cwd(), "data", "products.json");
    
    // ファイルの存在確認
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "商品データファイルが見つかりません" },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    
    // JSONのパース
    let products: Product[];
    try {
      products = JSON.parse(fileContents);
    } catch (parseError) {
      console.error("商品データのJSONパースに失敗しました:", parseError);
      return NextResponse.json(
        { error: "商品データの形式が不正です" },
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // ASINで商品を検索
    const product = products.find((p) => {
      // product.asinフィールドを確認
      if (p.asin && p.asin === asin) {
        return true;
      }
      // affiliateUrlからASINを抽出して比較
      const urlASIN = extractASIN(p.affiliateUrl);
      return urlASIN === asin;
    });

    if (!product) {
      return NextResponse.json(
        { error: "商品が見つかりません" },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // 成功レスポンス（キャッシュヘッダー付き）
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : '不明なエラーが発生しました';
    
    console.error("商品データの読み込みに失敗しました:", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { 
        error: "商品データの読み込みに失敗しました",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}

