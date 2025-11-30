import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product } from "@/types/product";

/**
 * 商品データを取得するAPI
 * キャッシュ設定: 60秒間はCDNにキャッシュし、その後5分間は古いデータを見せながら再検証
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json");
    
    // ファイルの存在確認
    if (!fs.existsSync(filePath)) {
      console.error(`商品データファイルが見つかりません: ${filePath}`);
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
    
    // JSONのパースエラーハンドリング
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

    // 成功レスポンス（キャッシュヘッダー付き）
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    // 詳細なエラーメッセージを生成
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

