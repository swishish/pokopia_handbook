# 箱庭手冊

《寶可夢 Pokopia》非官方繁中粉絲指南。靜態站，無廣告、無付費牆。MVP 只做規則、食物口味、夢島、工具選擇器與術語對照，**不做圖鑑**。

站名刻意不用遊戲或公司商標。遊戲名稱只出現在說明與免責文字。

## 本機執行

需要 Node.js 22.12 或更新。

```bash
npm install
npm run dev
```

瀏覽器開啟 <http://127.0.0.1:4721>。

```bash
npm run build    # 驗證 JSON 後輸出到 dist/
npm run preview  # 預覽正式建置
npm run validate # 只跑資料檢查
```

## 頁面

| 路徑 | 內容 |
| --- | --- |
| `/` | 資料版本、六個任務入口 |
| `/housing/` | 建築與房屋規則（信心標籤） |
| `/food/` | 食物與口味（口味篩選） |
| `/pokedex/` | 圖鑑列表（HOME 縮圖、屬性圓標、口味／棲息圖示） |
| `/pokedex/[id]/` | 種族詳情（棲息、喜好類、專長、口味） |
| `/islands/` | 夢島卡片 |
| `/cloud-islands/` | 雲島地址（官方／社群／已結束） |
| `/tools/` | 任務選擇器 + 工具目錄 |
| `/glossary/` | 日／英／繁術語 |
| `/about/` | 聲明、來源政策、更新紀錄、回報錯誤 |

資料在 `src/data/`。改 JSON 後重新建置即可。房屋規則若缺信心標籤或來源，`npm run build` 會失敗。

## 靜態部署

`npm run build` 產出純靜態檔，可丟到 GitHub Pages、Cloudflare Pages 或 Vercel。

1. Build command: `npm run build`
2. Output directory: `dist`
3. 若部署在專案子路徑（例如 `https://user.github.io/repo/`），在 `astro.config.mjs` 加上 `base: '/repo'`。
4. 不要接廣告或追蹤腳本。

回報信箱尚未設定。要啟用「回報錯誤」連結，把信箱填進 `src/data/site.json` 的 `report_mailto`。

種族中文以台灣寶可夢官方網站圖鑑為準，對照見 `src/data/official-names.md`。

無帳號預覽部署（已建置的 `dist/`）：

```bash
npx netlify-cli deploy --dir=dist --no-build --allow-anonymous
```

## 設計

奶油紙底、墨色字、硬陰影。介面只有繁體中文。字體堆疊含 Noto Sans TC、PingFang TC、Microsoft JhengHei。
