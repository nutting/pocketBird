# 小鸟日常 · Pocket Bird

竖屏触屏优先的像素风养鸟游戏，使用 Phaser 3.90、TypeScript 7、Vite 8。美术由程序生成，声音用 Web Audio 合成，无外部美术、字体、音频或后端服务。

## 开发

需要 Node.js 24 和 npm 11。在已有的 `/workspace/pocketBird` checkout 中工作，无需创建 worktree。

```sh
npm ci
npm run dev
```

游戏逻辑分辨率为 360 × 640。首次进入鸟舍，选择免费鸟蛋，轻敲十次孵化。可以给小鸟起名、点击或拖拽食物喂食、来回搓动抚摸，打开洗澡模式后搓动清洁。成长到 8 可成为成鸟。五次连续点击会让小鸟躲开。

- 七个品种分别保存，三种高级鸟蛋需要金币解锁。
- 公园可收集八件物品和结交野鸟，离开时结算。
- 接瓜子每局三十秒，左右拖动接食物，避开辣椒。
- 会说话的成鸟可以学习六个词；只显示文字和啁啾，不使用语音合成。
- 免费瓜子、分档收费食物、饱腹时间、成长奖励、饱食外出门槛均在纯逻辑层实现。
- 存档保存在 `birdpet.save`，支持 v1 格式迁移；自动存档、离线属性补算、静音与最高分记录。

## 验证

```sh
npm test                  # 33 个核心规则测试
npm run typecheck
npm run build             # 生成像素 PNG、类型检查、构建 dist/
npm run preview -- --port 4173
```

浏览器集成测试需要 `/usr/bin/chromium`（当前云环境已提供）：

```sh
# 另一个终端运行 npm run dev
node scripts/smoke.mjs
# 另一个终端运行 npm run preview -- --port 4173
node scripts/pwa-smoke.mjs
```

第一组覆盖选鸟、孵化、起名、喂食、公园收益、游戏结算、存档恢复与桌面/手机截图。第二组覆盖生产版触屏孵化、拖拽喂食、洗澡开关、完整 30 秒游戏、PWA 离线刷新。截图保存在忽略的 `.test-results/`。音频听感需人工确认。

调试参数：`?speed=60` 加速属性衰减；`?hour=23` 查看夜晚。开发版 `window.game` 可访问 Phaser 实例。

## 结构

- `art/pixel.ts`：像素网格与带 CRC 的 PNG 编码器。
- `scripts/gen-art.ts`：生成七品种的雏鸟、成鸟精灵表和 PWA 图标。`npm run art` 可重建。
- `src/data/catalog.ts`：品种、食物与词表。
- `src/logic/`：属性、成长、购买、教学、活动结算、行为和存档。
- `src/scenes/World.ts`：程序绘制的房间、公园、孵化与小游戏画面。
- `src/main.ts`：页面界面、状态流转与交互；`src/audio.ts`：合成声音。
- `public/sw.js`：生产版首次联网后缓存页面、构建资源和全部鸟素材，支持离线游玩。

## 发布

把 `dist/` 部署到任意 HTTPS 静态托管，可添加到手机主屏幕。生产版才注册 Service Worker。存档不跨设备同步；浏览器清理数据会删除本地存档。未做 Capacitor、Tauri 或微信小游戏移植。

GitHub Pages 使用 `gh-pages` 分支根目录发布，目标地址为 https://nutting.github.io/pocketBird/ 。仓库 Settings → Pages 中选择 Deploy from a branch → gh-pages → /(root)。`.github/workflows/pages.yml` 会在推送 main 时执行测试、构建并更新发布分支；不需要额外密钥。手动发布：先执行 `npm run build`，再运行 `bash scripts/publish-pages.sh`。发布脚本使用临时 Git index 保留源码和现有暂存区，并在已有发布提交上追加历史。
