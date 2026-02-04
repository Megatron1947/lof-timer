# 🍅 lof-timer

一个基于 Tauri 开发的跨平台番茄时钟小工具，帮助你保持专注，提高工作效率。

## ✨ 功能特点

- ⏰ **灵活的时间设置**：支持自定义工作时间和休息时间
- 🔄 **循环模式**：可设置工作+休息的循环次数
- 📊 **直观的进度展示**：环形进度条显示当前状态和进度
- 💾 **配置持久化**：设置自动保存，下次启动时保持上次配置
- 🔔 **完成提醒**：支持完成提示，预留Tauri通知集成接口
- 🎨 **美观的界面**：现代化设计，响应式布局
- 🖥️ **跨平台支持**：基于 Tauri，可在 Windows、macOS 和 Linux 上运行

## 🛠️ 技术栈

- **前端**：Vue 3 + TypeScript + Vite + NaiveUI + Pinia + UnoCSS
- **后端**：Rust + Tauri
- **数据存储**：使用 localStorage 实现配置持久化，预留 Tauri Plugin Store 集成接口

## 📦 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) (v16+)
- [Rust](https://www.rust-lang.org/) (stable)
- [Tauri CLI](https://v2.tauri.app/zh-cn/start/prerequisites/)

### 安装与运行

1. **克隆项目**

    ```bash
    git clone https://gitee.com/m19/lof-timer.git
    cd lof-timer
    ```

2. **安装依赖**

    ```bash
    pnpm install
    ```

3. **开发模式运行**

    ```bash
    cargo tauri dev
    ```

4. **构建生产版本**

    ```bash
    cargo tauri build
    ```

    ### 常用构建示例

    **Windows 平台构建：**

    ```bash
    # 构建 64 位 Windows 应用
    cargo tauri build --target x86_64-pc-windows-msvc
    ```

    **跳过捆绑步骤（仅生成可执行文件）：**

    ```bash
    cargo tauri build --no-bundle
    ```

## 📁 项目结构

```
lof-timer/
├── src/                # 前端源码
│   ├── stores/         # Pinia 状态管理
│   │   └── timerStore.ts  # 计时器核心逻辑
│   ├── types/          # TypeScript 类型定义
│   │   └── timer.ts       # 计时器相关类型
│   ├── App.vue         # 主应用组件
│   └── main.ts         # 应用入口
├── src-tauri/          # Tauri 后端源码
│   ├── icons/          # 应用图标
│   ├── src/            # Rust 源代码
│   └── tauri.conf.json # Tauri 配置文件
├── package.json        # 前端依赖配置
├── Cargo.toml          # Rust 依赖配置
└── tsconfig.json       # TypeScript 配置文件
```

## 🎯 使用说明

1. **设置时间**：点击右侧「设置」按钮，通过滑块调整工作时间、休息时间和循环次数
2. **开始计时**：点击「开始」按钮启动番茄时钟，进入专注模式
3. **暂停/继续**：在计时过程中，可随时暂停或继续当前计时
4. **重置**：点击「重置」按钮重新开始新的番茄循环
5. **查看进度**：环形进度条会实时显示当前阶段的进度和整体循环进度
6. **状态指示**：界面顶部会显示当前状态（就绪、专注中、休息中、暂停、结束）
7. **窗口标题**：应用窗口标题会动态显示当前状态和剩余时间

## 🎨 界面预览

### 主界面

（待补充）

### 设置界面

（待补充）

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 编写前端代码
- 使用 Rust 编写后端代码
- 遵循 Vue 3 Composition API 风格
- 使用 Pinia 进行状态管理
- 使用 NaiveUI 组件库
- 使用 UnoCSS 进行样式管理

### 核心功能实现

- **状态管理**：使用 Pinia 实现响应式状态管理，包括计时器状态、配置参数等
- **配置持久化**：使用 localStorage 实现配置自动保存和加载
- **倒计时逻辑**：基于 setInterval 实现精准的秒级倒计时
- **状态切换**：自动处理专注和休息状态的切换，支持循环计数
- **进度展示**：使用 NaiveUI 的环形进度条组件展示双层级进度
- **窗口标题**：动态更新窗口标题，显示当前状态和剩余时间

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用开发框架
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [NaiveUI](https://www.naiveui.com/) - Vue 3 组件库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库
- [UnoCSS](https://unocss.dev/) - 即时原子 CSS 引擎

---

**享受专注的乐趣！** 🎉
