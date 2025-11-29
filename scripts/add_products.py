#!/usr/bin/env python3
"""
大量商品追加ツール
urls.txtからAmazon商品URLを読み込み、商品情報を取得してproducts.jsonに追記する
"""

import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# プロジェクトルートのパスを取得
PROJECT_ROOT = Path(__file__).parent.parent
DATA_FILE = PROJECT_ROOT / "data" / "products.json"
URLS_FILE = PROJECT_ROOT / "scripts" / "urls.txt"

# User-Agentヘッダー（ブラウザからのアクセスに見せかける）
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}


def extract_price_from_html(html: str) -> int | None:
    """
    HTMLから価格を抽出する
    Amazonの価格表示パターンを複数試行
    """
    soup = BeautifulSoup(html, "html.parser")

    # パターン1: id="priceblock_ourprice" または id="priceblock_dealprice"
    price_element = soup.find(id="priceblock_ourprice") or soup.find(id="priceblock_dealprice")
    if price_element:
        price_text = price_element.get_text(strip=True)
        price = parse_price(price_text)
        if price:
            return price

    # パターン2: class="a-price-whole"
    price_element = soup.find(class_="a-price-whole")
    if price_element:
        price_text = price_element.get_text(strip=True)
        price = parse_price(price_text)
        if price:
            return price

    # パターン3: span.a-price-whole を含む要素を探す
    price_elements = soup.find_all("span", class_="a-price-whole")
    for element in price_elements:
        price_text = element.get_text(strip=True)
        price = parse_price(price_text)
        if price:
            return price

    # パターン4: data-a-color="price" を含む要素
    price_element = soup.find(attrs={"data-a-color": "price"})
    if price_element:
        price_text = price_element.get_text(strip=True)
        price = parse_price(price_text)
        if price:
            return price

    return None


def parse_price(price_text: str) -> int | None:
    """
    価格テキストから数値を抽出する
    "¥248,000" -> 248000
    """
    # カンマと通貨記号を除去して数値を抽出
    price_match = re.search(r"[\d,]+", price_text.replace(",", ""))
    if price_match:
        try:
            return int(price_match.group().replace(",", ""))
        except ValueError:
            return None
    return None


def extract_product_name(html: str) -> str | None:
    """
    HTMLから商品名を抽出する
    """
    soup = BeautifulSoup(html, "html.parser")

    # パターン1: id="productTitle"
    title_element = soup.find(id="productTitle")
    if title_element:
        return title_element.get_text(strip=True)

    # パターン2: h1.a-size-large
    title_element = soup.find("h1", class_="a-size-large")
    if title_element:
        return title_element.get_text(strip=True)

    # パターン3: meta property="og:title"
    meta_title = soup.find("meta", property="og:title")
    if meta_title and meta_title.get("content"):
        return meta_title.get("content").strip()

    return None


def extract_image_url(html: str) -> str | None:
    """
    HTMLから商品画像URLを抽出する
    """
    soup = BeautifulSoup(html, "html.parser")

    # パターン1: id="landingImage"
    image_element = soup.find(id="landingImage")
    if image_element and image_element.get("src"):
        return image_element.get("src")

    # パターン2: id="main-image"
    image_element = soup.find(id="main-image")
    if image_element and image_element.get("src"):
        return image_element.get("src")

    # パターン3: img#landingImage
    image_element = soup.find("img", id="landingImage")
    if image_element and image_element.get("data-src"):
        return image_element.get("data-src")
    if image_element and image_element.get("src"):
        return image_element.get("src")

    # パターン4: meta property="og:image"
    meta_image = soup.find("meta", property="og:image")
    if meta_image and meta_image.get("content"):
        return meta_image.get("content")

    return None


def scrape_product_info(url: str) -> dict | None:
    """
    Amazon商品ページから商品情報をスクレイピングする
    成功時は商品情報の辞書を返し、失敗時はNoneを返す
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"  エラー: ステータスコード {response.status_code}")
            return None

        html = response.text
        name = extract_product_name(html)
        price = extract_price_from_html(html)
        image_url = extract_image_url(html)

        if not name:
            print(f"  警告: 商品名を取得できませんでした")
            return None

        if not price:
            print(f"  警告: 価格を取得できませんでした")
            return None

        # 画像URLが取得できなかった場合はデフォルト画像を使用
        if not image_url:
            print(f"  警告: 画像URLを取得できませんでした（デフォルト画像を使用）")
            image_url = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"

        return {
            "name": name,
            "price": price,
            "image_url": image_url,
        }

    except requests.exceptions.RequestException as e:
        print(f"  エラー: リクエスト中にエラーが発生しました: {e}")
        return None
    except Exception as e:
        print(f"  エラー: 予期しないエラーが発生しました: {e}")
        return None


def get_next_id(products: list) -> str:
    """
    既存の商品IDから次のIDを生成する
    """
    if not products:
        return "1"

    # 既存のIDから最大値を取得
    max_id = 0
    for product in products:
        try:
            product_id = int(product.get("id", "0"))
            max_id = max(max_id, product_id)
        except ValueError:
            continue

    return str(max_id + 1)


def add_products():
    """商品を追加する"""
    # urls.txtが存在するか確認
    if not URLS_FILE.exists():
        print(f"エラー: {URLS_FILE} が見つかりません")
        print("urls.txtを作成し、1行に1つずつAmazon商品URLを記入してください")
        return

    # 既存の商品データを読み込む
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            products = json.load(f)
    else:
        products = []

    # urls.txtを読み込む
    with open(URLS_FILE, "r", encoding="utf-8") as f:
        urls = [line.strip() for line in f if line.strip() and not line.strip().startswith("#")]

    if not urls:
        print("urls.txtにURLが記入されていません")
        return

    print(f"{len(urls)}件のURLを処理します...\n")

    added_count = 0
    failed_count = 0

    # 各URLを処理
    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] 処理中: {url}")

        # 既に存在するURLかチェック
        if any(product.get("affiliateUrl") == url for product in products):
            print(f"  スキップ: 既に登録されている商品です")
            continue

        # 商品情報を取得
        product_info = scrape_product_info(url)
        if not product_info:
            print(f"  失敗: 商品情報の取得に失敗しました")
            failed_count += 1
            time.sleep(2)  # エラー時も待機
            continue

        # 新しい商品データを作成
        new_id = get_next_id(products)
        new_product = {
            "id": new_id,
            "name": product_info["name"],
            "currentPrice": product_info["price"],
            "priceHistory": [
                {
                    "date": datetime.now(timezone.utc).isoformat(),
                    "price": product_info["price"],
                }
            ],
            "affiliateUrl": url,
            "imageUrl": product_info["image_url"],
        }

        products.append(new_product)
        added_count += 1

        print(f"  成功: {product_info['name']} (¥{product_info['price']:,}) を追加しました")

        # サーバー負荷を考慮してリクエスト間に2秒待機
        if i < len(urls):  # 最後のURLの後は待機しない
            time.sleep(2)

    # JSONファイルに保存
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\n処理完了:")
    print(f"  追加: {added_count}件")
    print(f"  失敗: {failed_count}件")
    print(f"  合計: {len(products)}件の商品が登録されています")


if __name__ == "__main__":
    add_products()

