# 🕹️ Pixel Gacha (像素扭蛋)

一款纯原生 JavaScript 驱动的像素风交互实验原型。

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-9CF?style=for-the-badge&logo=web-audio-api&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

### 🔗 在线体验 (Demo)
👉 **[https://lightkise.github.io/Pixel-Gacha/](https://lightkise.github.io/Pixel-Gacha/)**

---

## 🌟 核心亮点

* **👾 纯正像素美学**：完全使用 CSS `box-shadow` 栈和 `canvas` 像素化渲染，无需外部图片资源，实现极致轻量的视觉风格。
* **🧪 独立物理模拟**：自主实现的圆体碰撞检测（Circle Collision）与重力感应逻辑，支持指针/触摸动量的实时物理交互。
* **🚀 零延迟音效引擎 (Web Audio API)**：
    * **秒开体验**：针对移动端 Safari/Chrome 深度优化，将音效预载入内存缓冲区，彻底解决传统 `new Audio()` 导致的播放延迟。
    * **沉浸反馈**：高频碰撞时自动触发密集 `pop` 音效，不弹系统喇叭，不占用移动端媒体控制条。
* **🛡️ 全环境兼容机制**：自动识别浏览器限制，在 Web Audio 受阻时智能降级至传统音频模式，确保电脑与手机端均有完美表现。

---

## 🛠️ 技术攻克：干掉移动端的“延迟噩梦”

在开发这个 Demo 时，最大的技术挑战是移动端浏览器的**节能与预加载策略**。

1. **痛点**：普通 HTML5 音频在用户点击后才发起网络请求，导致声音和画面严重脱节（通常延迟 1-5 秒）。
2. **方案**：改用 **Web Audio API**。页面初始化时通过二进制流（ArrayBuffer）预取音频，点击时直接从 CPU 调用内存数据。
3. **结果**：响应速度从“秒级”提升到了“毫秒级”，实现了真正的实时交互反馈。

---

## 🎮 玩法指南

- **点击/长按标题**：喷射随机色彩的像素扭蛋。
- **滑动/拖拽鼠标**：扰乱重力场，与已有的扭蛋进行实时物理互动。
- **多指连点**：手机端支持多点触控，可以同时喷射多枚扭蛋。

---

## 🏗️ 快速本地调试

由于涉及到 `fetch` 请求内存音频，请勿直接双击 `.html` 文件打开（会导致浏览器跨域安全拦截）。

**推荐方式：**
1. 使用 VS Code 插件 **Live Server** 启动。
2. 或使用 Python 快速搭建：`python -m http.server 8000`

---

## 📜 开源协议

本项目基于 [MIT License](LICENSE) 开源。
