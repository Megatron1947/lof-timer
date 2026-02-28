# 🍅 lof-timer

一个基于 Tauri 开发的番茄时钟小工具, 帮助你保持专注, 提高工作效率. (暂时只提供 Windows 版本)

## 功能特点

- ⏰ 灵活的时间设置: 支持自定义工作时间和休息时间
- 🔄 循环模式: 可设置工作+休息的循环次数
- 📊 直观的进度展示: 环形进度条显示当前状态和进度
- 💾 配置持久化: 使用 Tauri Plugin Store 实现配置自动保存
- 🔔 完成提醒: 集成 Tauri 通知功能, 倒计时结束时发送系统通知
- 🎨 主题切换: 支持多种内置主题, 满足不同使用场景
- 📱 精简模式: 可切换精简界面, 减少视觉干扰
- 🚀 自动启动: 支持开机自启动
- 📝 窗口标题: 动态显示当前状态和剩余时间
- 🎨 现代化界面: 无边框透明窗口设计, 美观简洁
- 🖥️ 平台支持: 基于 Tauri 2.x, 暂时只提供 Windows 版本

## 技术栈

- 前端: Vue 3 + TypeScript + Vite + Tailwind CSS + DaisyUI + Pinia
- 后端: Rust + Tauri 2.x
- 数据存储: Tauri Plugin Store (支持全平台)
- 通知功能: Tauri Plugin Notification (支持全平台, Windows 仅对已安装应用有效)
- 系统托盘: Tauri Tray Icon
- 单例模式: Tauri Plugin Single Instance (支持全平台)
- 自动启动: Tauri Plugin Autostart (支持全平台)

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) (v16+)
- [Rust](https://www.rust-lang.org/) (stable)
- [Tauri CLI](https://v2.tauri.app/zh-cn/start/prerequisites/)
- [pnpm](https://pnpm.io/)

### 安装与运行

1. 克隆项目

    ```bash
    git clone https://gitee.com/m19/lof-timer.git
    cd lof-timer
    ```

2. 安装依赖

    ```bash
    pnpm install
    ```

3. 开发模式运行

    ```bash
    # 只启动前端开发服务器
    pnpm run dev

    # 启动前端+后端 (完整应用)
    pnpm run tauri
    ```

4. 构建生产版本

    ```bash
    # 构建前端
    pnpm run build

    # 构建 Windows 应用
    pnpm run build:win

    # 跳过捆绑步骤 (仅生成可执行文件)
    pnpm run build:no-bundle
    ```

## 项目结构

```
lof-timer/
├── src/                      # 前端源码
│   ├── components/           # Vue 组件
│   │   ├── Buttons.vue       # 按钮组件
│   │   ├── Countdown.vue     # 倒计时显示组件
│   │   ├── Navbar.vue        # 导航栏组件
│   │   ├── RadialProgress.vue # 环形进度条组件
│   │   └── Settings.vue      # 设置面板组件
│   ├── composables/          # 组合式函数
│   │   └── useTimerLogic.ts # 计时器核心逻辑
│   ├── services/             # 服务层
│   │   ├── configService.ts  # 配置服务
│   │   └── notificationService.ts # 通知服务
│   ├── stores/               # Pinia 状态管理
│   │   └── timerStore.ts     # 计时器状态
│   ├── types/                # TypeScript 类型定义
│   │   └── timer.ts          # 计时器器相关类型
│   ├── App.vue               # 主应用组件
│   ├── main.ts               # 应用入口
│   └── style.css             # 全局样式
├── src-tauri/               # Tauri 后端源码
│   ├── icons/                # 应用图标
│   ├── src/                  # Rust 源代码
│   │   ├── main.rs           # Rust 入口
│   │   └── lib.rs            # Rust 库
│   └── tauri.conf.json       # Tauri 配置文件
├── package.json              # 前端依赖配置
├── Cargo.toml                # Rust 依赖配置
└── tsconfig.json             # TypeScript 配置文件
```

## 使用说明

1. 设置时间: 点击右侧「设置」按钮, 通过滑块调整工作时间, 休息时间和循环次数
2. 开始计时: 点击「开始」按钮启动番茄时钟, 进入专注模式
3. 暂停/继续: 在计时过程中, 可随时暂停或继续当前计时
4. 重置: 点击「重置」按钮重新开始新的番茄循环
5. 查看进度: 环形进度条会实时显示当前阶段的进度和整体循环进度
6. 状态指示: 界面顶部会显示当前状态 (就绪, 专注中, 休息中, 暂停, 结束)
7. 主题切换: 在设置面板中选择喜欢的主题
8. 精简模式: 在设置面板中开启精简模式, 减少界面元素
9. 自动启动: 在设置面板中设置开机自启动
10. 窗口标题: 应用窗口标题会动态显示当前状态和剩余时间

## 开发指南

### 代码规范

- 使用 TypeScript 编写前端代码
- 使用 Rust 编写后端代码
- 遵循 Vue 3 Composition API 风格
- 使用 Pinia 进行状态管理
- 使用 Tailwind CSS 进行样式管理
- 使用 DaisyUI 组件库

### 核心功能实现

- 状态管理: 使用 Pinia 实现响应式状态管理, 包括计时器状态, 配置参数等
- 配置持久化: 使用 Tauri Plugin Store 实现配置自动保存和加载
- 倒计时逻辑: 基于 setInterval 实现精准的秒级倒计时
- 状态切换: 自动处理专注和休息状态的切换, 支持循环计数
- 进度展示: 使用 Tailwind CSS 实现环形进度条展示双层级进度
- 主题切换: 集成 DaisyUI 主题系统, 支持多种内置主题
- 通知功能: 集成 Tauri Plugin Notification, 实现系统通知
- 窗口标题: 动态更新窗口标题, 显示当前状态和剩余时间
- 单例模式: 使用 Tauri Plugin Single Instance 确保应用只运行一个实例

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目!

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature-amazing-feature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用开发框架
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [DaisyUI](https://daisyui.com/) - Tailwind CSS 组件库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库

---

享受专注的乐趣! 🎉
