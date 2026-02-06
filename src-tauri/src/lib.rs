use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 通知插件
        .plugin(tauri_plugin_notification::init())
        // 单例插件
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            // 激活主窗口
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        // Store 插件
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            // 显式设置主窗口大小
            if let Some(window) = app.get_webview_window("main") {
                // 使用与配置文件相同的尺寸
                let _ = window.set_size(tauri::LogicalSize {
                    width: 380.0,
                    height: 680.0,
                });
                // 确保窗口不可调整大小
                let _ = window.set_resizable(false);
            }

            // 创建菜单子项
            let menu_item_quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            // 创建菜单
            let menu = Menu::with_items(app, &[&menu_item_quit])?;
            let _tray = TrayIconBuilder::new()
                .tooltip("lof-timer")
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {
                        println!("menu item {:?} not handled", event.id);
                    }
                })
                .show_menu_on_left_click(false)
                // 托盘图标事件监听
                .on_tray_icon_event(|tray, event| match event {
                    // 左键双击时展示主界面
                    TrayIconEvent::DoubleClick {
                        button: MouseButton::Left,
                        ..
                    } => {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.unminimize();
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
