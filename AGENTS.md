# AGENTS.md — AI 開發規則手冊

> 本專案：`genai-w9-ai-ledger`（AI 記帳網站）
> 本文件是 AI 助手（Claude / Copilot / Cursor 等）在本專案工作時**必須遵守**的唯一規則來源。
> 讀完本文件，你應該能回答：「這個專案該怎麼繼續做下去？」

---

## 1. 專案目的

一個純前端、無後端的個人記帳網站：

- 使用者在瀏覽器輸入「金額、類別、備註、日期」即可記一筆帳。
- 資料存在瀏覽器 localStorage，不需要帳號與伺服器。
- 提供月份統計報表（分類長條圖）查看 spending 分佈。
- 本專案的重點不只是「做出網站」，而是**建立一套讓 AI 可以持续快速新增頁面與功能的規則**（見第 6 節）。

## 2. 技術棧（不可擅自更換）

| 項目 | 規定 |
|---|---|
| HTML | 靜態 HTML5，繁體中文 `lang="zh-Hant"` |
| CSS | 單一檔案 `assets/style.css`，CSS 變數集中管理 |
| JS | 原生 JavaScript（ES6+），**禁止引入任何框架或 CDN 套件** |
| 資料 | localStorage，key 統一為 `ledger.entries.v1` |
| 部署 | GitHub Pages（branch: `main`，根目錄 `/`） |

## 3. 頁面結構與檔案命名

```
/                     ← 專案根＝GitHub Pages 根
├── AGENTS.md         ← 本文件（AI 規則，永遠在根目錄）
├── README.md         ← 專案簡介
├── index.html        ← 首頁＝記帳主頁（必填頁）
├── stats.html        ← 月報表頁
├── notes/            ← 知識筆記頁（選配）
└── assets/
    ├── style.css     ← 全站樣式（唯一）
    └── app.js        ← 記帳核心函式庫（唯一資料層）
```

命名鐵律：
- 新頁面＝根目錄一個 `<功能名>.html`（小寫、連字號，例：`budget.html`）。
- 新樣式一律加進 `assets/style.css`，**嚴禁**在 HTML 內寫 `<style>` 區塊。
- 新資料邏輯一律加進 `assets/app.js`，**嚴禁**在 HTML 內寫大段 `<script>`（每頁 `<script>` 只准呼叫 app.js 函式初始化）。

## 4. 資料格式（所有頁面共用）

一筆帳的物件結構（不可更改欄位名）：

```json
{
  "id": "e1730000000000",
  "amount": 150,
  "category": "餐飲",
  "note": "午餐",
  "date": "2026-11-16"
}
```

- `category` 允許值唯一來源：`assets/app.js` 的 `CATEGORIES` 常數。新增類別＝只改那一行。
- 金額為正整數（新台幣），日期格式 `YYYY-MM-DD`。
- 讀寫一律透過 `app.js` 的 `loadEntries()` / `saveEntries()`，禁止直接操作 localStorage。

## 5. 網頁整體風格

- 色板以 `style.css` 的 `:root` CSS 變數為準（`--ink` `--acc` `--bg`），新頁面不得另立顏色。
- 字型：微軟正黑體；最大寬度 860px 置中；卡片式區塊（`.card`）。
- 導覽列：每個頁面頂部都有 `<nav class="topnav">`，連結全部現存頁面——**新增頁面後必須同步更新所有頁面的導覽列**。
- 表單與按鈕沿用既有 class（`.btn`、`.field`），不得重複发明。

## 6. 如何新增一個新頁面／新功能（AI 照這五步做）

1. **抄模板**：複製結構最接近的既有頁面（如 `stats.html`），保留 `<nav>`、`<footer>` 與 `<script src="assets/app.js">`。
2. **寫內容**：新 class 取語義名（`.budget-table`），樣式加進 `style.css` 末尾並加註解 `/* === <功能名> === */`。
3. **動資料**：若需要新欄位/新運算，在 `app.js` 增加純函式（不改既有函式簽名），資料仍走 `loadEntries()/saveEntries()`。
4. **接導覽**：把新頁連結加入全站 `topnav`（全部 HTML 一次更新）。
5. **自查**：打開頁面確認無 console 錯誤、資料讀寫正常、手機宽度（375px）不破版；更新本文件第 3 節的目錄樹。

## 7. AI 修改／提交守則

- 每次修改只做一件事，commit message 格式：`<頁面或模組>: <做了什麼>`（例：`stats: add category filter`）。
- 嚴禁：刪除非資料層註解、更换技術棧、引入外部 CDN、修改本文件第 2/4 節的鐵律。
- 嚴禁把「宣稱的功能」寫進 README 而網頁實際做不到——**宣稱必先與實作核對**。
- 新增任何功能，README 的「功能清單」與本文件目錄樹必須同步更新。

## 8. 驗證清單（交出去之前）

- [ ] 記一筆 → 重新整理 → 資料還在
- [ ] 月報表數字＝明細加總
- [ ] 全站導覽連結無 404
- [ ] GitHub Pages 網址可開啟
- [ ] 本文件（AGENTS.md）與實際檔案結構一致
