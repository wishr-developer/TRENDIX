#!/bin/bash

# 商品数を5,000件まで増やすためのバルク実行スクリプト
# 使用方法: ./scripts/bulk_runner.sh

set -e  # エラーが発生したら即座に終了

# カラー出力用の変数
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# スクリプトのディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  XIORA TREND - バルク商品追加スクリプト${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 現在の商品数を確認
if [ -f "data/products.json" ]; then
    CURRENT_COUNT=$(python3 -c "import json; data = json.load(open('data/products.json')); print(len(data))" 2>/dev/null || echo "0")
    echo -e "${YELLOW}現在の商品数: ${CURRENT_COUNT}件${NC}"
else
    CURRENT_COUNT=0
    echo -e "${YELLOW}商品データファイルが見つかりません。新規作成します。${NC}"
fi

echo ""
echo -e "${GREEN}実行回数: 5回${NC}"
echo -e "${GREEN}各実行間の待機時間: 60秒${NC}"
echo -e "${GREEN}予想所要時間: 約5〜6分${NC}"
echo ""
read -p "実行を開始しますか？ (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "実行をキャンセルしました。"
    exit 0
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  バルク実行を開始します${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 実行回数
TOTAL_RUNS=5
DELAY_SECONDS=60

# 各実行の開始時刻を記録
START_TIME=$(date +%s)

for i in $(seq 1 $TOTAL_RUNS); do
    echo ""
    echo -e "${GREEN}----------------------------------------${NC}"
    echo -e "${GREEN}  実行 ${i}/${TOTAL_RUNS}${NC}"
    echo -e "${GREEN}----------------------------------------${NC}"
    
    RUN_START=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}開始時刻: ${RUN_START}${NC}"
    
    # Pythonスクリプトを実行
    if python3 scripts/import_ranking.py; then
        RUN_END=$(date '+%Y-%m-%d %H:%M:%S')
        echo -e "${GREEN}✓ 実行 ${i} が正常に完了しました${NC}"
        echo -e "${BLUE}終了時刻: ${RUN_END}${NC}"
        
        # 現在の商品数を再確認
        if [ -f "data/products.json" ]; then
            UPDATED_COUNT=$(python3 -c "import json; data = json.load(open('data/products.json')); print(len(data))" 2>/dev/null || echo "0")
            echo -e "${YELLOW}現在の商品数: ${UPDATED_COUNT}件${NC}"
        fi
    else
        RUN_END=$(date '+%Y-%m-%d %H:%M:%S')
        echo -e "${YELLOW}⚠ 実行 ${i} でエラーが発生しました${NC}"
        echo -e "${BLUE}終了時刻: ${RUN_END}${NC}"
        echo -e "${YELLOW}続行しますか？ (y/N): ${NC}"
        read -p "" -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "実行を中断しました。"
            exit 1
        fi
    fi
    
    # 最後の実行以外は待機
    if [ $i -lt $TOTAL_RUNS ]; then
        echo ""
        echo -e "${YELLOW}次の実行まで ${DELAY_SECONDS}秒待機します...${NC}"
        sleep $DELAY_SECONDS
    fi
done

# 全体の実行時間を計算
END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))
ELAPSED_MINUTES=$((ELAPSED_TIME / 60))
ELAPSED_SECONDS=$((ELAPSED_TIME % 60))

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  バルク実行が完了しました${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 最終的な商品数を確認
if [ -f "data/products.json" ]; then
    FINAL_COUNT=$(python3 -c "import json; data = json.load(open('data/products.json')); print(len(data))" 2>/dev/null || echo "0")
    ADDED_COUNT=$((FINAL_COUNT - CURRENT_COUNT))
    echo -e "${GREEN}開始時の商品数: ${CURRENT_COUNT}件${NC}"
    echo -e "${GREEN}終了時の商品数: ${FINAL_COUNT}件${NC}"
    echo -e "${GREEN}追加された商品数: ${ADDED_COUNT}件${NC}"
    echo ""
    echo -e "${BLUE}総実行時間: ${ELAPSED_MINUTES}分${ELAPSED_SECONDS}秒${NC}"
    echo ""
fi

# Git操作を実行
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Git操作を実行します${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Gitリポジトリかどうか確認
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠ .gitディレクトリが見つかりません。Git操作をスキップします。${NC}"
    exit 0
fi

# 変更があるか確認
if ! git diff --quiet data/products.json 2>/dev/null && [ -f "data/products.json" ]; then
    echo -e "${GREEN}変更を検出しました。Git操作を実行します...${NC}"
    echo ""
    
    # git add
    echo -e "${BLUE}[1/3] git add data/products.json${NC}"
    if git add data/products.json; then
        echo -e "${GREEN}✓ git add が完了しました${NC}"
    else
        echo -e "${YELLOW}⚠ git add でエラーが発生しました${NC}"
        exit 1
    fi
    
    # git commit
    echo ""
    echo -e "${BLUE}[2/3] git commit${NC}"
    if git commit -m "Bulk add: Adding products towards 5000 limit."; then
        echo -e "${GREEN}✓ git commit が完了しました${NC}"
    else
        echo -e "${YELLOW}⚠ git commit でエラーが発生しました（変更がない可能性があります）${NC}"
    fi
    
    # git push
    echo ""
    echo -e "${BLUE}[3/3] git push${NC}"
    read -p "リモートリポジトリにプッシュしますか？ (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if git push; then
            echo -e "${GREEN}✓ git push が完了しました${NC}"
        else
            echo -e "${YELLOW}⚠ git push でエラーが発生しました${NC}"
            echo -e "${YELLOW}手動で git push を実行してください。${NC}"
        fi
    else
        echo -e "${YELLOW}git push をスキップしました${NC}"
    fi
else
    echo -e "${YELLOW}変更が検出されませんでした。Git操作をスキップします。${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  すべての処理が完了しました${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}次のステップ:${NC}"
echo -e "${BLUE}  商品数が5,000件に達するまで、このスクリプトを繰り返し実行してください。${NC}"
echo ""

