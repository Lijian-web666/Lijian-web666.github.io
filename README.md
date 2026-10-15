# 个人简历网站

一个纯静态的个人简历 + 作品集网站。零依赖、零构建，双击 `index.html` 即可预览。

**已上线：<https://Lijian-web666.github.io/>**（GitHub Pages，仓库 `Lijian-web666/Lijian-web666.github.io`）

- 风格：简约专业（白底 + 单主色 + 大量留白）
- 技术：原生 HTML / CSS / JavaScript，没有框架、没有 npm 依赖
- 特性：深浅色主题、滚动动画、作品分组展示、一键复制联系方式、打印/存为 PDF、完整响应式
- 体积：HTML + CSS + JS 合计约 86KB，含 7 张作品图约 1.8MB；无外部字体与 CDN 请求（国内访问也不会卡）

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
│       └── works/          ← 七张作品封面（3 张 3:4 账号截图 + 4 张 4:3 画面帧）
├── .gitignore              ← 排除 .workbuddy/ 等内部文件，不要提交项目记忆
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
| `<link rel="canonical">` / `og:*` | 已填真实网址 `https://Lijian-web666.github.io/`，换域名时同步改 |
| `.hero__stats` | 首屏三个数字（改 `data-to` 与 `<dt>` 标签） |
| `#about` | 自我介绍正文 + 右侧基本信息 |
| `#skills` | 五个技能分类的标签，直接增删 `<li class="tag">` |
| `#experience` | 三段工作经历、教育经历、求职意向 |
| `#works` | 七个作品卡片，分「IP 账号运营 / 直播运营与投流 / 视频拍摄与后期」三组 |
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

## 四、部署（已完成）

- 线上地址：<https://Lijian-web666.github.io/>
- 仓库：<https://github.com/Lijian-web666/Lijian-web666.github.io>（Public）
- Pages 配置：分支 `main`，目录 `/ (root)`；推送后 1 分钟左右线上自动更新

### 以后改内容怎么发布

本地改完 `index.html` / `style.css` 等文件后，三条命令即可上线：

```bash
git add .
git commit -m "update: 更新作品集"
git push
```

### 仓库分支说明

| 分支 | 内容 |
| --- | --- |
| `main` | 当前线上站点（这份版本的来源） |
| `legacy` | 部署前的旧简历页存档（2026-01 创建、2026-05 最后更新的那版），**不要删** |

本地另有一份旧站的完整克隆备份：`.workbuddy/backup-old-site/repo`。

### 绑定自己的域名（可选）

1. 在域名服务商处添加一条 `CNAME` 记录，指向 `Lijian-web666.github.io`；
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
