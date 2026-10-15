# 个人简历网站

一个纯静态的个人简历 + 作品集网站。零依赖、零构建，双击 `index.html` 即可预览，可直接部署到 GitHub Pages。

- 风格：简约专业（白底 + 单主色 + 大量留白）
- 技术：原生 HTML / CSS / JavaScript，没有框架、没有 npm 依赖
- 特性：深浅色主题、滚动动画、作品分类筛选、一键复制联系方式、打印/存为 PDF、完整响应式
- 体积：全部文件合计约 60KB，无外部字体与 CDN 请求（国内访问也不会卡）

---

## 一、目录结构

```
个人网站/
├── index.html              ← 页面结构与全部文案内容
├── assets/
│   ├── css/style.css       ← 全部样式（含深色主题、响应式、打印样式）
│   ├── js/main.js          ← 全部交互逻辑
│   └── img/
│       ├── avatar.jpg      ← 头像（800×800）
│       ├── favicon.svg     ← 浏览器标签页图标
│       └── works/          ← 五张作品封面（3 张 3:4 账号截图 + 2 张 4:3 视频帧）
├── .nojekyll               ← 告诉 GitHub Pages 不要用 Jekyll 处理，勿删
└── README.md               ← 本文件
```

---

## 二、本地预览

直接双击 `index.html` 就能看。

如果想用本地服务器（更接近线上环境，剪贴板 API 也能正常工作）：

```bash
# 在本目录下执行任意一条
python -m http.server 8000
npx serve .
```

然后浏览器打开 `http://localhost:8000`。

---

## 三、需要替换 / 更新的内容清单

`index.html` 里所有可编辑位置都用 `<!-- ▼ 替换：... -->` 或 `<!-- ▼ ... -->` 注释标出：

| 位置 | 内容 |
| --- | --- |
| `<title>` / `<meta name="description">` | 网页标题与搜索摘要 |
| `<link rel="canonical">` | 上线后的真实网址 |
| `.hero__stats` | 首屏三个数字（改 `data-to` 与 `<dt>` 标签） |
| `#about` | 自我介绍正文 + 右侧基本信息 |
| `#skills` | 五个技能分类的标签，直接增删 `<li class="tag">` |
| `#experience` | 两段工作经历、教育经历、求职意向 |
| `#works` | 五个作品卡片，分「IP 账号运营」与「视频拍摄与后期」两组 |
| `#contact` | 邮箱、微信号 |

### 更换头像

当前使用 `assets/img/avatar.jpg`（800×800，已压缩）。想换照片时，把新图裁成正方形后
覆盖这个文件即可，文件名不用改。

### 更换作品封面

封面在 `assets/img/works/` 下，分两种规格：

- **账号截图**（`work-jinge / zhangbin / tuhu.jpg`）：3:4 竖版（720×960），
  裁自账号主页截图顶部，保留「账号名 + 粉丝数」区域；
- **视频帧**（`work-youni / lvmai.jpg`）：4:3 横版，从成片中截取。

换视频封面时，用任意播放器截图后按对应比例裁切覆盖原文件即可。

### 作品数据更新

每个作品卡片各有一个 `work__stats` 数据条，数字直接改文本即可。

### 作品链接

| 作品 | 当前链接 |
| --- | --- |
| 进哥的新能源汽车超市 | 抖音主页 |
| 张斌爱说车 | 抖音主页 |
| 途虎官方旗舰店（门店号） | 待补（快手） |
| 悠尼洗地机 · 产品宣发视频 | 待补 |
| 《绿脉穿城》城市宣传片 | B 站 |

有链接的作品，**封面图、标题、底部链接三处写的是同一个 URL**，要改就一起改。

没有链接的两个作品故意不渲染链接区，避免点上去跳回页面顶部。补链接时按下面的方式改：

```html
<!-- 标题：由纯文本改成链接 -->
<h3 class="work__title"><a href="真实链接" target="_blank" rel="noopener">标题</a></h3>

<!-- 封面：由 div 改成 a -->
<a class="work__cover cover cover--shot" href="真实链接" target="_blank" rel="noopener">…</a>

<!-- 底部链接区：加回这一段（放在 </ul> 之后） -->
<p class="work__links">
  <a href="真实链接" target="_blank" rel="noopener">查看账号 <span aria-hidden="true">↗</span></a>
</p>
```

视频卡若要显示封面中央的播放按钮浮层，在封面里加：

```html
<span class="cover__play" aria-hidden="true">
  <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>
</span>
```

### 换主色

只改一个变量，全站跟着变。打开 `assets/css/style.css`，找到 `:root` 里的：

```css
--accent:      #2a5be0;   /* 主色 */
--accent-ink:  #1b3f9e;   /* 主色深一档，用于悬停 */
```

再同步改一下 `[data-theme="dark"]` 里的 `--accent`（深色模式下需要用更亮的色值）。

---

## 四、部署到 GitHub Pages

### 方式 A：网页上传（不需要装任何工具，最省事）

1. 登录 GitHub，点右上角 `+` → **New repository**；
2. 仓库名填 `你的用户名.github.io`（例如 `zhangsan.github.io`）。
   > 这样仓库上线后的地址就是 `https://zhangsan.github.io`，最干净。
   > 如果填别的名字（比如 `resume`），地址会变成 `https://zhangsan.github.io/resume`，也能用。
3. 可见性选 **Public**（GitHub Pages 免费版要求公开仓库），点 **Create repository**；
4. 进入仓库页面，点 **uploading an existing file**；
5. 把 `index.html`、`assets` 文件夹、`.nojekyll` 一起拖进去
   > ⚠️ `assets` 要整个文件夹拖，保持内部目录结构不变；否则页面会没有样式。
   > `.nojekyll` 是隐藏文件，Windows 资源管理器里可能看不到，需要在文件夹选项里打开「显示隐藏的文件」。
6. 填个提交说明，点 **Commit changes**；
7. 进入仓库 **Settings** → 左侧 **Pages**；
8. 在 *Build and deployment* 下，**Source** 选 `Deploy from a branch`，
   **Branch** 选 `main`，目录选 `/ (root)`，点 **Save**；
9. 等 1~2 分钟，刷新页面，顶部会出现绿色提示，网址就是你的站点地址。

### 方式 B：命令行推送（后续改内容更方便）

先在 GitHub 上按上面第 1~3 步建好空仓库（**不要**勾选 Add README），然后在本地项目目录执行：

```bash
git init
git add .
git commit -m "init: 个人简历网站"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

推送完同样去 **Settings → Pages** 选好 `main` 分支和 `/ (root)` 目录。

以后每次改完内容，只要三步：

```bash
git add .
git commit -m "update: 更新作品集"
git push
```

推送后 1 分钟左右线上自动更新。

### 绑定自己的域名（可选）

1. 在域名服务商处添加一条 `CNAME` 记录，指向 `你的用户名.github.io`；
2. 在仓库 **Settings → Pages → Custom domain** 填入你的域名并保存；
3. 勾选 **Enforce HTTPS**（等证书签发完成后再勾，通常几分钟到几小时）。

---

## 五、几个说明

- **打印 / 存为 PDF**：导航栏和页脚已写好打印样式，点「打印 / 存为 PDF」按钮或按 `Ctrl/Cmd + P`，
  会输出一份排版干净的 A4 简历。打印版会隐藏作品截图、只保留文字与数据，方便投递。
- **截图隐私**：作品封面用的是账号主页截图，其中「进哥的新能源汽车超市」截图上带有门店公开电话。
  如不想在个人网站上展示，可换用不打码的普通作品图，或把该卡片封面换成数据后台截图。
- **关于中文字体**：站点刻意没有引入 Google Fonts 等外部字体，只用系统字体栈，
  因此在任何网络环境下都不会出现字体加载卡顿，也不会因为外链被墙而变成默认宋体。
- **`.nojekyll` 不要删**：删掉后 GitHub Pages 会走 Jekyll 流程，某些情况下会导致 `assets` 目录下的文件 404。
