# AI 記帳本（genai-w9-ai-ledger）

純前端個人記帳網站：記一筆帳、看月分類報表，資料存瀏覽器 localStorage，部署於 GitHub Pages。

## 功能清單（與實作一一對應）
- 記帳：金額／類別／備註／日期，重新整理不遺失（localStorage）
- 明細：本月紀錄依日期倒序，可單筆刪除，顯示本月總額
- 月報表：選月份 → 分類長條圖＋分類小計表（筆數、金額、佔比）
- 手機宽度（375px）不破版

## 技術
靜態 HTML + 單一 style.css + 原生 JS（無框架、無 CDN、無後端）。

## AI 協作方式
本專案以根目錄 `AGENTS.md` 為唯一開發規則：技術棧鐵律、頁面命名、資料格式、
「新增頁面五步流程」與提交守則全部寫在裡面。AI 助手照 AGENTS.md 第 6 節即可
在不移植原始碼的情況下繼續新增頁面（例：預算頁 budget.html）。

## 連結
- Repo: https://github.com/NextBai/genai-w9-ai-ledger
- Pages: https://nextbai.github.io/genai-w9-ai-ledger/
