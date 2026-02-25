# 更新日志

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/),
本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2026-02-25

### 新增
- lof-timer 首次发布
- 灵活的时间设置: 支持自定义工作时间和休息时间
- 循环模式: 可设置工作+休息的循环次数
- 环形进度条: 实时显示当前状态和进度
- 配置持久化: 使用 Tauri Plugin Store 实现配置自动保存
- 完成提醒: 倒计时结束时发送系统通知
- 主题切换: 支持多种内置主题
- 精简模式: 可切换精简界面, 减少视觉干扰
- 自动启动: 支持开机自启动
- 窗口标题: 动态显示当前状态和剩余时间
- 现代化界面: 无边框透明窗口设计
- 跨平台支持: 可在 Windows, macOS 和 Linux 上运行

### 技术细节
- 前端: Vue 3 + TypeScript + Vite + Tailwind CSS + DaisyUI + Pinia
- 后端: Rust + Tauri 2.x
- 数据存储: Tauri Plugin Store
- 通知功能: Tauri Plugin Notification
- 系统托盘: Tauri Tray Icon
- 单例模式: Tauri Plugin Single Instance
- 自动启动: Tauri Plugin Autostart

[1.0.0]: https://gitee.com/m19/lof-timer/releases/tag/v1.0.0
