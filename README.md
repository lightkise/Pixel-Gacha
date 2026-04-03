https://lightkise.github.io/Pixel-Gacha/

# 🏆 Inspiration Box (灵感盒子)

一个基于物理引擎与高保真音频系统的网页交互实验。通过模拟像素扭蛋机的喷射与碰撞，为创作者提供随机的灵感反馈。

---

## ✨ 核心特性

* **🎮 像素风物理模拟**：基于原生 Canvas 打造，支持多物体碰撞（Circle Collision）、重力感应及指针动量扰动算法。
* **⚡ 零延迟音频引擎**：针对移动端深度优化，采用 **Web Audio API** 内存预载技术，彻底解决 iOS/安卓端常见的声音滞后与排队加载问题。
* **🛡️ 全平台双模兼容**：
    * **移动端**：优先激活内存音频缓冲区（BufferSource），实现毫秒级响应，并自动隐藏系统级媒体播放器图标。
    * **桌面端**：配备自动降级（Fallback）机制，在 WebAudio 受限时无缝切换至 HTML5 Audio 方案，确保稳健表现。
* **📱 交互优化**：深度适配触控事件（Touch Events），支持手机端多指连点与滑动交互，物理反馈丝滑不卡顿。

---

## 🛠️ 技术栈

* **核心语言**: Vanilla JavaScript (ES6+)
* **图形渲染**: HTML5 Canvas API (Pixel-art rendering)
* **音频处理**: Web Audio API & HTML5 Audio Element
* **样式表现**: CSS3 (Dynamic Box-shadow stack / Pixelated rendering)

---

## 📦 核心技术攻克 (Dev Log)

在开发过程中，本项目重点解决了以下网页交互难题：

1.  **移动端 5s 音频延迟**：
    传统的 `new Audio()` 在移动端浏览器（尤其是 Safari/微信）中存在严重的“排队请求”机制。本项目通过 `fetch` 获取音频二进制数据并使用 `decodeAudioData` 预存入内存，实现了物理意义上的**瞬时触发**。

2.  **规避系统级喇叭弹窗**：
    Web Audio API 直接向声卡发送波形数据，浏览器不会将其识别为“媒体播放”，从而完美避开了移动端状态栏频繁闪烁播放图标的干扰。

3.  **浏览器自动播放限制 (Autoplay Policy)**：
    利用交互事件（mousedown/touchstart）在用户产生行为的第一时间动态激活 `AudioContext`，优雅绕过了现代浏览器对自动播放的静音拦截。

---

## 🚀 快速开始

1.  **克隆仓库**：
    ```bash
    git clone [https://github.com/lightkise/Pixel-Gacha.git](https://github.com/lightkise/Pixel-Gacha.git)
    ```
2.  **运行环境建议**：
    由于音频资源采用 `fetch` 请求，请务必使用本地服务器环境运行（如 VS Code 的 **Live Server** 插件），直接双击 `.html` 文件可能因浏览器跨域安全限制导致音效无法加载。

---

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源。
