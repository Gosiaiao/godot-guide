# Godot 4 系统学习指南

> **适用版本**：以 [Godot 4.7](https://godotengine.org/download/windows/) Standard 稳定版为准，Godot 4.4 及以上版本基本适用  
> **文档定位**：系统学习主线与精选视频导航  
> **阅读方式**：结合 Godot 编辑器同步阅读与实践，每完成一篇后对照末尾的能力自检确认掌握情况。

---

## 序言：行前指南

### 1. 为什么选择 Godot
* **轻量快捷**：安装包仅几十 MB，解压即用，打开只需要两秒，对电脑配置要求低。
* **免费开源**：采用 MIT 协议，做完游戏发布 Steam、参加比赛或独立开发，都没有抽成与授权限制。
* **2D 体验出色，3D 满足常见需求**：拥有独立的 2D 像素与渲染引擎，而非用 3D 强行压扁，对独立游戏、Game Jam 和社团原型开发非常友好。
* **概念统一**：核心设计围绕节点与场景展开，上手门槛低，代码结构清晰直观。

### 2. 版本与编程语言选型

| 选项 | 适用人群 | 优点 | 注意事项 |
| :--- | :--- | :--- | :--- |
| **GDScript，入门首选** | 零基础、快速做原型、参加 Game Jam、绝大多数 2D 与轻中度 3D 项目 | 语法接近 Python，上手快；与编辑器深度集成；绝大多数社区教程都使用它；支持导出网页端 | 应尽早使用静态类型注解，详见 1.3 节 |
| **C# .NET 版** | 已有扎实的 C#/.NET 或 Unity 经验，计划开发重计算逻辑的中大型项目 | 执行性能较高，强类型工程生态完善 | 需要额外安装 .NET SDK；不少教程需要自行改写语法；[官方明确目前无法导出至 Web 网页端](https://docs.godotengine.org/en/latest/tutorials/export/exporting_for_web.html) |

初学者无需在语言选型上过度耗费时间。先用 GDScript 完成前两篇内容并做出两个小游戏，熟悉引擎本身的工作方式后，后续若有需要转向 C#，迁移成本很低——两者的 API 基本一致，只是命名风格从蛇形命名换成了帕斯卡命名。

### 3. 本指南的使用方法
1. **善用文档与排错工具**：在编辑器中按 `F1` 可离线搜索所有节点与函数说明；在脚本里按住 `Ctrl` 并左键点击任意类名、属性或方法，即可直接跳转查看文档。开发过程中遇到报错时，应优先阅读错误堆栈、查阅官方文档或借助 AI 工具定位问题。
2. **以能力自检衡量进度**：每篇末尾均列出该阶段应当具备的核心能力，可用于自查是否具备进入下一阶段的基础，避免停留在单纯观看教程。
3. **留意版本差异**：查阅外部资料时优先确认教程基于 Godot 4。常见版本差异速查如下：
   * **Godot 3 与 Godot 4**：接口变动大，例如 `KinematicBody2D` 已改为 `CharacterBody2D`，`yield` 已改为 `await`，不建议照搬 Godot 3 代码。
   * **Godot 4.0–4.2 与 4.3+**：4.3 起新增 `TileMapLayer` 替代旧版 `TileMap`，并支持单线程 Web 导出。
   * **Godot 4.4 及以上**：为资源新增独立的 `.uid` 文件用于追踪引用，多人协作时需纳入 Git 版本管理。
   * **Godot 4.4 至 4.7**：核心脚本语法与节点体系保持高度兼容，本指南与 4.4+ 社区教程在 4.7 中均可顺畅适用，遇到细微编辑器选项位置变动时以内置文档和当前版本界面为准。

### 序言参考资料
* **Godot 官方中文文档入门章节**：https://docs.godotengine.org/zh-cn/4.x/getting_started/introduction/index.html ，用于快速建立对引擎定位、核心概念与学习路线的整体认知。

---

## 第一篇：引擎基石与最小闭环

> **本篇目标**：熟悉编辑器布局，理解节点、场景与信号三大核心机制，写出带静态类型的 GDScript，并跑通从新建工程到导出运行文件的完整流程。

### 1.1 编辑器五大核心面板
打开 Godot 后，界面主要分为五个工作区：
1. **Scene 场景面板**：位于左上角，用于管理当前场景的节点树结构。
2. **FileSystem 文件系统**：位于左下角，用于管理项目内所有资源，`res://` 表示项目根目录。
3. **Viewport 主视口**：位于中央，可在 2D、3D、Script 脚本和 AssetLib 资源库之间切换。
4. **Inspector 检查器**：位于右侧，用于查看和修改选中节点的属性；旁边的 **Node** 标签页用于管理信号和分组。
5. **底部面板**：包含 Output 输出日志、Debugger 调试器、Audio 音频总线和 Animation 动画编辑器。

### 1.2 Godot 的核心：节点与场景树

Godot 的基本模型非常纯粹：整个游戏运行在一棵场景树上，树上的最小功能单元叫**节点 Node**，把一组节点保存为 `.tscn` 文件供复用就叫**场景 Scene**。

场景既是关卡，也是可复用的预制体。主角是一个场景，一颗子弹是一个场景，一张地图也是一个场景，可以把主角场景直接拖进地图场景中嵌套使用。

学习初期不需要去背诵上百个节点，先记住四大基类，通过图标颜色就能一眼分辨：

| 基类 | 图标颜色 | 作用与定位 | 常见子类举例 |
| :--- | :--- | :--- | :--- |
| **`Node`** | 白色 | 纯逻辑节点，没有空间坐标 | `Timer`、`AnimationPlayer`、`AudioStreamPlayer` |
| **`Node2D`** | 蓝色 | 所有 2D 对象的基类，带有平面位置、旋转与缩放 | `Sprite2D`、`CharacterBody2D`、`Area2D`、`Camera2D`、`TileMapLayer` |
| **`Node3D`** | 红色 | 所有 3D 对象的基类，带有三维变换 | `MeshInstance3D`、`CharacterBody3D`、`Camera3D`、`DirectionalLight3D` |
| **`Control`** | 绿色 | 所有 UI 元素的基类，支持锚点与容器布局 | `Button`、`Label`、`TextureRect`、`VBoxContainer`、`Panel` |

### 1.3 GDScript 核心语法与静态类型规范

GDScript 语法接近 Python，在工程实践中应当从一开始就使用**静态类型注解**：
* 编辑器能提供准确的代码自动补全；
* 类型写错在编辑阶段就会直接提示，不必等到运行时崩溃；
* 在 Godot 4 中，静态类型代码的执行效率明显高于动态类型。

建议打开设置：`Editor -> Editor Settings -> Text Editor -> Completion -> Add Type Hints`，让编辑器自动补充类型提示。

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ff7085">class_name</span> <span style="color:#c7ffed">Player</span>  <span style="color:#ffffff80;font-style:italic"># 注册全局类名，方便其他脚本做类型注解</span>
<span style="color:#ff7085">extends</span> <span style="color:#c7ffed">CharacterBody2D</span>

<span style="color:#ffffff80;font-style:italic"># @export 将变量暴露到右侧 Inspector 面板，方便直接调参</span>
<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">move_speed</span>: <span style="color:#42ffc2">float</span> = <span style="color:#a1ffe0">220.0</span>
<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">max_hp</span>: <span style="color:#42ffc2">int</span> = <span style="color:#a1ffe0">100</span>

<span style="color:#ffffff80;font-style:italic"># @onready 在所有子节点准备就绪后再获取引用</span>
<span style="color:#ffb373">@onready</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">sprite</span>: <span style="color:#c7ffed">Sprite2D</span> = $<span style="color:#c7ffed">Sprite2D</span>
<span style="color:#ffb373">@onready</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">anim</span>: <span style="color:#c7ffed">AnimationPlayer</span> = $<span style="color:#c7ffed">AnimationPlayer</span>

<span style="color:#ffffff80;font-style:italic"># 显式声明类型与使用 := 进行类型推断</span>
<span style="color:#ff7085">var</span> <span style="color:#bce0ff">current_hp</span>: <span style="color:#42ffc2">int</span> = <span style="color:#a1ffe0">100</span>
<span style="color:#ff7085">var</span> <span style="color:#bce0ff">is_invincible</span>: <span style="color:#42ffc2">bool</span> = <span style="color:#a1ffe0">false</span>

<span style="color:#ff7085">func</span> <span style="color:#66e6ff">take_damage</span>(<span style="color:#bce0ff">amount</span>: <span style="color:#42ffc2">int</span>) -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#ff8ccc">if</span> <span style="color:#bce0ff">is_invincible</span>:
		<span style="color:#ff8ccc">return</span>
	<span style="color:#bce0ff">current_hp</span> = <span style="color:#57b3ff">maxi</span>(<span style="color:#bce0ff">current_hp</span> - <span style="color:#bce0ff">amount</span>, <span style="color:#a1ffe0">0</span>)
	<span style="color:#ff7085">var</span> <span style="color:#bce0ff">ratio</span> := <span style="color:#a3a3f5">float</span>(<span style="color:#bce0ff">current_hp</span>) / <span style="color:#a3a3f5">float</span>(<span style="color:#bce0ff">max_hp</span>)
	<span style="color:#a3a3f5">print</span>(<span style="color:#ffeda1">"当前血量比例: %.2f"</span> % <span style="color:#bce0ff">ratio</span>)</code></pre>

再记住两个高频用法：
* **`await`**：异步等待某个信号触发，例如延迟 1 秒再继续执行：

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#bce0ff">await</span> <span style="color:#57b3ff">get_tree</span>().<span style="color:#57b3ff">create_timer</span>(<span style="color:#a1ffe0">1.0</span>).<span style="color:#bce0ff">timeout</span>
<span style="color:#a3a3f5">print</span>(<span style="color:#ffeda1">"1 秒后执行这里"</span>)</code></pre>

* **`queue_free()`**：在当前帧结束后安全销毁节点，通常不要直接调用 `free()`。

### 1.4 生命周期与帧循环

节点从加入场景树到离开场景树，引擎会按固定顺序调用以下回调函数：

| 回调函数 | 触发时机与顺序 | 典型用途 |
| :--- | :--- | :--- |
| `_init()` | 对象在内存中创建时，尚未进入场景树 | 初始化纯数据 |
| `_enter_tree()` | 节点进入场景树时，父节点先于子节点执行 | 注册到全局管理器 |
| `_ready()` | 该节点及其全部子节点都进入树后，子节点先于父节点执行 | 获取子节点引用、初始化状态、连接信号 |
| `_process(delta)` | 每个渲染帧调用一次，频率随硬件帧率波动 | UI 刷新、动画与非物理逻辑 |
| `_physics_process(delta)` | 按固定物理帧率调用，默认 60Hz | 角色移动、碰撞判断与物理受力 |
| `_exit_tree()` | 节点离开场景树时 | 清理外部引用 |

在 `_process` 和 `_physics_process` 中计算位移时，需要乘以 `delta` 也就是上一帧的耗时，才能保证 60 帧和 144 帧设备上的移动速度一致。唯一要注意的是，`CharacterBody2D.move_and_slide()` 内部已经乘过 `delta`，给 `velocity` 赋值时不需要再乘一次。

### 1.5 信号系统

信号是 Godot 内置的观察者机制，用来在节点之间解耦通信：发送方只需在状态变化时广播事件，无需关心外部有哪些节点在监听。

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ffffff80;font-style:italic"># 在 Player.gd 中定义并发出信号</span>
<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">health_changed</span>(<span style="color:#bce0ff">new_hp</span>: <span style="color:#42ffc2">int</span>, <span style="color:#bce0ff">max_hp</span>: <span style="color:#42ffc2">int</span>)
<span style="color:#ff7085">signal</span> <span style="color:#bce0ff">died</span>

<span style="color:#ff7085">func</span> <span style="color:#66e6ff">take_damage</span>(<span style="color:#bce0ff">amount</span>: <span style="color:#42ffc2">int</span>) -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#bce0ff">current_hp</span> = <span style="color:#57b3ff">maxi</span>(<span style="color:#bce0ff">current_hp</span> - <span style="color:#bce0ff">amount</span>, <span style="color:#a1ffe0">0</span>)
	<span style="color:#bce0ff">health_changed</span>.<span style="color:#57b3ff">emit</span>(<span style="color:#bce0ff">current_hp</span>, <span style="color:#bce0ff">max_hp</span>)
	<span style="color:#ff8ccc">if</span> <span style="color:#bce0ff">current_hp</span> == <span style="color:#a1ffe0">0</span>:
		<span style="color:#bce0ff">died</span>.<span style="color:#57b3ff">emit</span>()</code></pre>

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ffffff80;font-style:italic"># 在 HUD.gd 或父场景中连接信号，推荐用代码连接以便追踪调用关系</span>
<span style="color:#ff7085">func</span> <span style="color:#66e6ff">_ready</span>() -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#bce0ff">player</span>.<span style="color:#bce0ff">health_changed</span>.<span style="color:#57b3ff">connect</span>(<span style="color:#bce0ff">_on_player_health_changed</span>)

<span style="color:#ff7085">func</span> <span style="color:#66e6ff">_on_player_health_changed</span>(<span style="color:#bce0ff">new_hp</span>: <span style="color:#42ffc2">int</span>, <span style="color:#bce0ff">max_hp</span>: <span style="color:#42ffc2">int</span>) -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#bce0ff">hp_bar</span>.<span style="color:#bce0ff">max_value</span> = <span style="color:#bce0ff">max_hp</span>
	<span style="color:#bce0ff">hp_bar</span>.<span style="color:#bce0ff">value</span> = <span style="color:#bce0ff">new_hp</span></code></pre>

### 1.6 物理、碰撞与输入

#### 四类常用物理与检测节点
* **`StaticBody2D/3D`**：静止不动的墙体与地面。
* **`CharacterBody2D/3D`**：由代码精确控制移动的角色和敌人，配合 `velocity` 与 `move_and_slide()` 使用。
* **`RigidBody2D/3D`**：交由物理引擎模拟重力、碰撞和弹跳的箱子或碎石，应通过 `apply_impulse` 或 `apply_force` 施加力，不要直接改坐标。
* **`Area2D/3D`**：不产生物理阻挡，专门用于区域检测，适合做金币拾取、攻击判定框、传送门和敌人视野。

以上四类节点都必须挂载一个 `CollisionShape2D` 或 `CollisionShape3D` 子节点并设置碰撞形状，否则不会生效。

#### Collision Layer 与 Mask 的区分
通常先在 `Project Settings -> Layer Names -> 2D Physics` 中为各层命名，例如 1 为 World、2 为 Player、3 为 Enemy、4 为 PlayerBullet。
* **Layer 层**：定义对象自身所属的碰撞分类。例如主角勾选第 2 层，标识其属于 Player 类别。
* **Mask 掩码**：定义对象会与哪些分类发生碰撞或检测。例如主角勾选第 1 层和第 3 层，表示主角会被墙壁阻挡并与敌人碰撞，但不会与自身发射的子弹产生碰撞。

#### 输入系统：`InputMap` 与输入传播
永远在 `Project Settings -> Input Map` 里定义语义化动作，例如 `move_left`、`jump`、`attack`，不要在代码里写死键盘按键。

八方向移动推荐使用 `Input.get_vector()`，它会自动做归一化处理，避免斜向移动比直线更快：

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ff7085">func</span> <span style="color:#66e6ff">_physics_process</span>(<span style="color:#bce0ff">_delta</span>: <span style="color:#42ffc2">float</span>) -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#ff7085">var</span> <span style="color:#bce0ff">dir</span> := <span style="color:#c7ffed">Input</span>.<span style="color:#57b3ff">get_vector</span>(<span style="color:#ffeda1">"move_left"</span>, <span style="color:#ffeda1">"move_right"</span>, <span style="color:#ffeda1">"move_up"</span>, <span style="color:#ffeda1">"move_down"</span>)
	<span style="color:#bce0ff">velocity</span> = <span style="color:#bce0ff">dir</span> * <span style="color:#bce0ff">move_speed</span>
	<span style="color:#57b3ff">move_and_slide</span>()</code></pre>

此外要区分 `_input(event)` 和 `_unhandled_input(event)`：
* `_input` 最先接收所有输入，哪怕点击的是 UI 按钮也会触发。
* `_unhandled_input` 只接收没有被 UI 消费的输入。角色攻击、交互这类游戏内按键应放在 `_unhandled_input` 中，避免点击界面按钮时角色在背后误触发攻击。

### 1.7 最小导出流程
完成第一个可玩原型后，按以下三步即可跑通桌面端导出流程：
1. **安装导出模板**：点击顶部菜单 `Editor -> Manage Export Templates`，点击 `Download and Install` 下载并安装与当前引擎版本号完全一致的导出模板。
2. **创建导出预设**：打开 `Project -> Export`，点击 `Add...` 添加目标平台，例如 `Windows Desktop`，确认主场景已在项目设置中正确指定。
3. **打包生成可执行文件**：点击 `Export Project` 选择输出路径并导出。默认会生成 `.exe` 与 `.pck` 两个文件，分发时必须放在同一目录下；如需合并为单个可执行文件，可在导出预设的 `Binary Format` 中勾选 `Embed PCK`。

---

### 第一篇推荐视频与教程
> **推荐视频 1：跟着 Brackeys 学习用 Godot 制作第一款游戏，国外经典教程中文搬运版**  
> 链接：https://www.bilibili.com/video/BV1fs421N7TD
> * **内容定位**：完整的零基础 2D 平台跳跃入门全流程，节奏紧凑，适合作为第一个上手项目。
> * **学习目标**：掌握编辑器基本操作、场景与节点组合、精灵动画、碰撞检测、金币拾取与计分流程。
> * **补充说明**：视频录制于 Godot 4.2 时期，若其中使用旧版 `TileMap` 节点，在 Godot 4.3 及以上版本中应替换为 `TileMapLayer`。
>
> **推荐视频 2：国内 Godot 4 2D 游戏开发入门实战教程**  
> 链接：https://www.bilibili.com/video/BV1fuCrYFEoG
> * **内容定位**：中文原生录制的 Godot 2D 入门实战课程，配有完整项目与素材练习，可与上方 Brackeys 教程互为补充或二选一跟练。
> * **学习目标**：熟悉 Godot 编辑器工作流、基础节点用法与完整 2D 小游戏的搭建步骤。
> * **补充说明**：适合更习惯中文原声讲解的初学者作为入门主线。
>
> **推荐视频 3：GDScript 语法系统讲解**  
> 链接：https://www.bilibili.com/video/BV1fx4y1p79u
> * **内容定位**：专门针对 GDScript 语言本身的基础语法教学。
> * **学习目标**：掌握变量、函数、流程控制、静态类型注解、数组与字典、信号与节点引用等核心语法。
> * **补充说明**：适合在跟练实战视频前先快速通览一遍语法，或在写代码卡壳时作为专项查阅资料。
>
> **推荐视频 4：All 219 Godot Nodes Explained In 42 Minutes，Lukky**  
> B站搬运链接：https://www.bilibili.com/video/BV1MY4GzYEKC  
> YouTube 原版链接：https://www.youtube.com/watch?v=tO2gthp45MA
> * **内容定位**：42 分钟全景式速览 Godot 内置的 219 个核心、2D、3D 与 UI 节点功能，对应本篇 1.2 节的节点体系认识。
> * **学习目标**：在跑通第一个小游戏后建立对 Godot 内置能力边界的整体认知，明确各类常见需求已有现成节点可用，避免重复造轮子；观看时以建立索引印象为主，无需死记硬背。

### 第一篇能力自检
完成本篇学习后，应当具备以下能力：
* 熟悉编辑器核心面板与场景树思维，能够通过 `F1` 内置文档按需查找节点与接口，不再依赖死记硬背。
* 能够编写带静态类型注解的 GDScript，理解节点生命周期、`_process` 与 `_physics_process` 的区别，并能使用信号完成基础的节点通信。
* 能够合理选择物理与检测节点，正确配置 Collision Layer、Mask 与 `InputMap`，独立从零搭建并导出一个包含完整玩法循环的 2D 小游戏。

---

## 第二篇：构建完整体验的核心子系统

> **本篇目标**：掌握地图搭建、动画系统、UI 多分辨率适配、音频总线与基础操作手感，做出一个结构完整、体验流畅的 Demo。

### 2.1 高频核心节点精讲

#### 1. 关卡与镜头
* **`TileMapLayer`**：Godot 4.3 起的新标准，用来替代已弃用的单节点多图层 `TileMap`。每个图层都是独立的 `TileMapLayer` 节点，如地面层、墙壁层、装饰层，管理层级与碰撞更直观。
* **`Camera2D`**：开启 `Position Smoothing` 可实现镜头平滑跟随；通过 `Limit` 限制边界，防止镜头拍到地图外的空白区域。

#### 2. 动画与补间：`AnimatedSprite2D`、`AnimationPlayer`、`Tween`
* **`AnimatedSprite2D`**：适合简单的序列帧动画，上手快，但扩展性有限。
* **`AnimationPlayer`**：Godot 中非常核心的节点，不仅能播放帧动画，还能给任意节点的任意属性设置关键帧，包括缩放、颜色、粒子开关和碰撞框启停。更实用的是 **Call Method Track**，例如在挥剑动画的第 0.15 秒精准调用 `enable_hitbox()`，第 0.30 秒调用 `disable_hitbox()`，比手写计时器清晰得多。
* **`AnimationTree`**：用于管理复杂的动画状态切换与混合，如八方向混合树和 3D 骨骼融合。
* **`Tween`**：纯代码补间动画，非常适合制作按钮弹跳、受击挤压拉伸、伤害数字飘动等效果：

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ff7085">func</span> <span style="color:#66e6ff">play_hit_squash</span>() -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#ff7085">var</span> <span style="color:#bce0ff">tween</span> := <span style="color:#57b3ff">create_tween</span>().<span style="color:#57b3ff">set_ease</span>(<span style="color:#c7ffed">Tween</span>.<span style="color:#c7ffed">EASE_OUT</span>).<span style="color:#57b3ff">set_trans</span>(<span style="color:#c7ffed">Tween</span>.<span style="color:#c7ffed">TRANS_ELASTIC</span>)
	<span style="color:#bce0ff">sprite</span>.<span style="color:#bce0ff">scale</span> = <span style="color:#a3a3f5">Vector2</span>(<span style="color:#a1ffe0">1.3</span>, <span style="color:#a1ffe0">0.7</span>)
	<span style="color:#bce0ff">tween</span>.<span style="color:#57b3ff">tween_property</span>(<span style="color:#bce0ff">sprite</span>, <span style="color:#ffeda1">"scale"</span>, <span style="color:#42ffc2">Vector2</span>.<span style="color:#c7ffed">ONE</span>, <span style="color:#a1ffe0">0.25</span>)</code></pre>

#### 3. 氛围表现
* **`GPUParticles2D/3D`**：用于制作脚步扬尘、受击火花、雨雪等粒子效果，性能开销低。
* **`PointLight2D` 与 `CanvasModulate`**：用来实现 2D 昼夜变化和局部光照。

### 2.2 UI 系统与多分辨率适配

窗口拉伸或切换全屏时，未正确配置的界面容易出现布局错位。解决多分辨率适配主要依靠两项机制：

#### 1. 窗口缩放模式设置
打开 `Project Settings -> Display -> Window -> Stretch`：
* **常规高清 2D 或矢量 UI 游戏**：`Mode` 设为 `canvas_items`，`Aspect` 设为 `expand` 或 `keep`。
* **像素风游戏**：`Mode` 设为 `viewport`，`Aspect` 设为 `keep`，同时将 `Project Settings -> Rendering -> Textures -> Canvas Textures -> Default Texture Filter` 设为 `Nearest`，防止像素画面发糊。

#### 2. 用容器排版，减少手拖坐标
尽量使用绿色 `Container` 容器节点管理界面布局：
* `MarginContainer`：控制整体四周留白，常用于让 HUD 与屏幕边缘保持安全距离。
* `VBoxContainer` 与 `HBoxContainer`：自动垂直或水平排列按钮与状态条。
* `GridContainer`：适合制作背包格子与技能栏。
* `CenterContainer`：将弹窗或提示框居中。
* **Anchor 锚点**：通过顶部工具栏的锚点预设，将 HUD 固定在屏幕四角或四边；全屏遮罩背景选择 `Full Rect`。
* **`Theme` 主题资源**：统一全游戏的字体、按钮样式和配色，挂载在根 `Control` 上即可让所有子控件自动继承。
* **`CanvasLayer`**：游戏内 HUD 必须放在 `CanvasLayer` 下，这样界面才不会跟随 `Camera2D` 移动。

### 2.3 音频系统与 Audio Bus

不要把所有声音都放在默认的 `Master` 轨道里。正确做法如下：
1. 打开底部 **Audio** 面板，新建 `BGM` 和 `SFX` 两条音频总线，输出均指向 `Master`。
2. 背景音乐节点的 `Bus` 属性设为 `BGM`，音效节点的 `Bus` 属性设为 `SFX`。
3. 设置界面的音量滑块范围设为 `0.0` 到 `1.0`，代码中使用 `linear_to_db()` 换算成分贝，因为人耳对响度是对数感知，直接线性修改 dB 听感会不自然：

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ff7085">func</span> <span style="color:#66e6ff">set_bus_volume</span>(<span style="color:#bce0ff">bus_name</span>: <span style="color:#42ffc2">String</span>, <span style="color:#bce0ff">linear_value</span>: <span style="color:#42ffc2">float</span>) -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#ff7085">var</span> <span style="color:#bce0ff">bus_idx</span> := <span style="color:#c7ffed">AudioServer</span>.<span style="color:#57b3ff">get_bus_index</span>(<span style="color:#bce0ff">bus_name</span>)
	<span style="color:#c7ffed">AudioServer</span>.<span style="color:#57b3ff">set_bus_volume_db</span>(<span style="color:#bce0ff">bus_idx</span>, <span style="color:#57b3ff">linear_to_db</span>(<span style="color:#bce0ff">linear_value</span>))
	<span style="color:#c7ffed">AudioServer</span>.<span style="color:#57b3ff">set_bus_mute</span>(<span style="color:#bce0ff">bus_idx</span>, <span style="color:#bce0ff">linear_value</span> &lt;= <span style="color:#a1ffe0">0.001</span>)</code></pre>

### 2.4 游戏手感与细节打磨

决定一款 Demo 玩起来是否顺手，往往在于以下几个经典机制：
* **土狼时间 Coyote Time**：角色离开平台边缘后的 0.1 秒内仍然允许起跳，减少极限起跳时的挫败感。
* **跳跃缓冲 Jump Buffer**：落地前 0.1 秒内提前按下跳跃键，落地瞬间自动触发起跳。
* **可变跳跃高度**：玩家在上升阶段提前松开跳跃键时，将竖直速度减半，实现轻按小跳、长按大跳。
* **顿帧与震屏**：命中敌人时暂停极短时间如 0.05 秒，配合轻微的相机偏移抖动与粒子爆发，能显著增强打击感。

---

### 第二篇推荐视频与参考资料
> **推荐视频：Godot 2D 实战：从零开发俯视角射击游戏**  
> 链接：https://www.bilibili.com/video/BV11ngh6xE3s
> * **前置要求**：适合在掌握第一篇 Godot 基础后开始跟练。
> * **内容定位**：以《元气骑士》《挺进地牢》为参考，从零搭建完整的 2D 俯视角肉鸽射击游戏核心框架。
> * **覆盖内容**：可复用角色与脚本、动态敌人 AI、远程与近战武器系统、完整道具与金币交易系统、随机游走算法地牢生成、宝箱与奖励机制、音效与背景音乐、视觉特效与基础自定义着色器。
> * **学习目标**：熟练运用节点、信号、场景组合与场景继承，打通核心子系统的协作，并为进入第三篇的数据驱动、设计模式与第四篇的工程架构做好过渡。

此外，在制作本篇 Demo 过程中涉及的具体节点参数与进阶配置，可直接查阅 Godot 官方中文文档对应专题：
* **2D 瓦片地图与动画**：重点查阅 `TileMapLayer`、`AnimationPlayer` 与 `Tween`。
* **UI 与多分辨率适配**：重点查阅 `Control` 锚点、各类 `Container` 容器与 `Multiple resolutions` 缩放策略。
* **音频系统**：重点查阅 Audio Bus 音频总线与 `AudioServer`。

### 第二篇能力自检
完成本篇学习后，应当具备以下能力：
* 能够综合运用 `TileMapLayer`、`Camera2D`、`AnimationPlayer` 与 `Tween`，搭建具备基本表现力与流畅操作手感的 2D 关卡及角色交互。
* 能够使用 `Control` 锚点、`Container` 容器和 `Stretch Mode` 构建多分辨率自适应界面，并理解界面焦点拦截、游戏暂停模式与音频总线分轨的原理。
* 能够在不逐行照抄教程的前提下，独立把地图、动画、UI 与音频四个子系统整合成一个结构完整的 2D 可玩 Demo。

---

## 第三篇：数据驱动与常用设计模式

> **本篇目标**：当单个脚本超过几百行、改一处逻辑影响全局时，需要引入数据驱动思想和适合 Godot 的设计模式，让代码保持清晰和可扩展。

### 3.1 自定义资源 Custom `Resource`

在 Godot 中，继承 **`Resource`** 的自定义类类似于 Unity 的 ScriptableObject，是实现数据驱动开发的核心手段。武器属性、敌人配置、道具、对话、技能数据都可以保存为 `.tres` 资源文件，在编辑器面板里可视化编辑。

<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ffffff80;font-style:italic"># weapon_data.gd</span>
<span style="color:#ff7085">class_name</span> <span style="color:#c7ffed">WeaponData</span>
<span style="color:#ff7085">extends</span> <span style="color:#42ffc2">Resource</span>

<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">weapon_name</span>: <span style="color:#42ffc2">String</span> = <span style="color:#ffeda1">""</span>
<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">icon</span>: <span style="color:#c7ffed">Texture2D</span>
<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">damage</span>: <span style="color:#42ffc2">int</span> = <span style="color:#a1ffe0">10</span>
<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">attack_cooldown</span>: <span style="color:#42ffc2">float</span> = <span style="color:#a1ffe0">0.4</span>
<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">projectile_scene</span>: <span style="color:#42ffc2">PackedScene</span></code></pre>

写完后，在 FileSystem 面板右键选择 `Create New -> Resource`，搜索 `WeaponData`，就可以直接创建 `fire_sword.tres`、`ice_bow.tres` 等配置文件，再拖入角色脚本的 `@export var weapon: WeaponData` 属性中。

**重要注意事项：Resource 的共享引用特性**  
同一个 `.tres` 文件默认在内存中是全局共享同一份实例的。如果在运行时直接修改 `enemy_data.hp -= 10`，全地图同种敌人的血量都会同时减少。
* **正确做法**：`Resource` 原则上只存放静态配置数据如 `max_hp`，运行时动态变化的数值存在节点自身变量中；如果确实需要每个实例持有独立可修改的副本，应注意 `Local to Scene` 仅对嵌入场景内部的**内联子资源**可靠，对于磁盘上独立的外部 `.tres` 文件，应在代码中显式调用 `data.duplicate(true)` 做深拷贝隔离。

### 3.2 按痛点学习 Godot 高频设计模式

学习设计模式不要死背概念，而要看它解决什么实际问题：

#### 1. 有限状态机 FSM：解决主角脚本充满 `if-else` 标志位
当代码里开始出现 `if is_dashing and not is_hurt and not is_climbing and is_on_floor():` 这类复杂条件时，就该引入状态机了。

Godot 中最直观的做法是节点式状态机：
```text
Player (CharacterBody2D)
├── Sprite2D
├── CollisionShape2D
└── StateMachine (Node)
    ├── IdleState (Node)
    ├── MoveState (Node)
    ├── JumpState (Node)
    └── AttackState (Node)
```

状态基类模板：
<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ffffff80;font-style:italic"># state.gd</span>
<span style="color:#ff7085">class_name</span> <span style="color:#c7ffed">State</span>
<span style="color:#ff7085">extends</span> <span style="color:#42ffc2">Node</span>

<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">transitioned</span>(<span style="color:#bce0ff">state</span>: <span style="color:#c7ffed">State</span>, <span style="color:#bce0ff">new_state_name</span>: <span style="color:#42ffc2">String</span>)

<span style="color:#ff7085">func</span> <span style="color:#66e6ff">enter</span>() -&gt; <span style="color:#ff7085">void</span>: <span style="color:#ff8ccc">pass</span>
<span style="color:#ff7085">func</span> <span style="color:#66e6ff">exit</span>() -&gt; <span style="color:#ff7085">void</span>: <span style="color:#ff8ccc">pass</span>
<span style="color:#ff7085">func</span> <span style="color:#66e6ff">update</span>(<span style="color:#bce0ff">_delta</span>: <span style="color:#42ffc2">float</span>) -&gt; <span style="color:#ff7085">void</span>: <span style="color:#ff8ccc">pass</span>
<span style="color:#ff7085">func</span> <span style="color:#66e6ff">physics_update</span>(<span style="color:#bce0ff">_delta</span>: <span style="color:#42ffc2">float</span>) -&gt; <span style="color:#ff7085">void</span>: <span style="color:#ff8ccc">pass</span></code></pre>
每个状态只负责自己的行为和切换条件，通过 `transitioned.emit(self, "JumpState")` 通知 `StateMachine` 完成切换，代码职责非常清晰。

#### 2. 组件模式：组合优于继承
如果使用深层继承树如 `Entity -> Damageable -> Character -> Enemy -> FlyingEnemy`，一旦需要新增一个“不能移动但可以被打碎的木箱”，继承结构就会变得很别扭。

Godot 更推崇用子节点组合能力：把通用功能做成独立小场景，按需挂到任意实体下：
```text
Slime (CharacterBody2D)          WoodenCrate (StaticBody2D)
├── HealthComponent              ├── HealthComponent
├── HurtboxComponent (Area2D)    └── HurtboxComponent (Area2D)
├── HitboxComponent (Area2D)
└── ChaseAIComponent
```
`HurtboxComponent` 负责检测 `HitboxComponent` 的碰撞，收到伤害后通知绑定的 `HealthComponent` 扣血。主角、史莱姆、Boss 和木箱可以完全复用同一套组件代码。

#### 3. 观察者模式与 EventBus 事件总线
当深藏在关卡里的敌人死亡，需要同时通知顶层 UI 加分、任务系统计数和相机震屏时，层层向上转发信号会很繁琐。

可以创建一个只定义信号的 Autoload 单例 `Events`：
<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ffffff80;font-style:italic"># events.gd，在 Project Settings -&gt; Globals -&gt; Autoload 中注册为 Events</span>
<span style="color:#ff7085">extends</span> <span style="color:#42ffc2">Node</span>

<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">enemy_died</span>(<span style="color:#bce0ff">enemy_pos</span>: <span style="color:#42ffc2">Vector2</span>, <span style="color:#bce0ff">score_value</span>: <span style="color:#42ffc2">int</span>)
<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">camera_shake_requested</span>(<span style="color:#bce0ff">intensity</span>: <span style="color:#42ffc2">float</span>, <span style="color:#bce0ff">duration</span>: <span style="color:#42ffc2">float</span>)
<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">item_picked_up</span>(<span style="color:#bce0ff">item</span>: <span style="color:#42ffc2">Resource</span>)</code></pre>
发射方调用 `Events.enemy_died.emit(global_position, 100)`，需要响应的系统各自连接该信号即可。需要注意的是，父子节点之间的近距离通信仍然优先使用局部信号，只有跨系统、远距离的通知才走全局事件总线。

#### 4. 策略模式：搭配 Resource 实现可插拔行为
把不同的发射方式或技能逻辑封装成继承 `Resource` 的策略类，例如 `SingleShotStrategy`、`ShotgunSpreadStrategy`、`HomingStrategy`，统一实现 `execute(shooter: Node2D, dir: Vector2) -> void`。在编辑器里替换一个 `.tres` 文件，就能直接改变武器的攻击方式。

#### 5. 修饰器模式、对象池与命令模式
* **修饰器模式 Decorator**：在不修改原始数值计算逻辑的前提下，按顺序叠加多层数值或行为修正，常用于肉鸽与卡牌游戏中的 Buff、Debuff、遗物与装备词条计算，例如先叠加固定增伤，再乘以易伤或虚弱倍率。
* **对象池 Object Pool**：制作弹幕射击或肉鸽游戏时，高频 `instantiate()` 和 `queue_free()` 会造成卡顿。提前创建一批对象放入数组，回收时除了隐藏节点并设为 `PROCESS_MODE_DISABLED`，还必须同步禁用碰撞与区域检测，例如使用 `set_deferred` 关闭 `CollisionShape2D.disabled`，或对 `Area2D` 同时将 `monitoring` 和 `monitorable` 设为 `false`，否则隐藏的对象仍会触发物理碰撞；取出复用时再恢复可见性、处理模式与碰撞状态并重置坐标。
* **命令模式 Command**：把每次操作封装成带 `execute()` 与 `undo()` 方法的对象，非常适合推箱子撤回、战棋悔棋或录像回放系统。

> **关于工厂模式的补充**：在传统面向对象语言里常讲抽象工厂，但在 Godot 中，`PackedScene.instantiate()` 配合配置型 `Resource` 本身就承担了轻量化工厂的角色，多数时候无需手写复杂的工厂类层次。

---

### 第三篇推荐视频与教程
> **推荐视频 1：基于《Game Development Patterns with Godot 4》的游戏编程模式教程，中文版一**  
> 链接：https://www.bilibili.com/video/BV1e5dbYHEyJ
> * **内容定位**：依据 *Game Development Patterns with Godot 4* 一书制作的中文设计模式系列讲解，结合 Godot 4 实例演示常用游戏编程模式。
> * **学习目标**：理解有限状态机、观察者、组件化、策略、命令、对象池等模式在 Godot 节点与脚本中的落地方式。
> * **补充说明**：与下方视频 2 同源，内容体系相近，按偏好的讲解风格任选其一跟学即可。
>
> **推荐视频 2：基于《Game Development Patterns with Godot 4》的游戏编程模式教程，中文版二**  
> 链接：https://www.bilibili.com/video/BV1LsdoBZEgu
> * **内容定位**：同样基于 *Game Development Patterns with Godot 4* 制作的中文游戏编程模式系列视频。
> * **学习目标**：掌握常见游戏设计模式的适用场景与 Godot 实现方式，为后续独立搭建中大型项目架构打下基础。
> * **补充说明**：可与视频 1 对比试看前两集，选择讲解节奏更契合的一套完整跟完。

### 第三篇能力自检
完成本篇学习后，应当具备以下能力：
* 能够清晰区分静态配置数据与运行时状态，熟练使用自定义 `Resource` 将数值与配置从逻辑代码中抽离，并理解资源共享引用机制。
* 面对复杂角色行为、多实体能力复用或跨层级通信，能够自主判断是否需要引入有限状态机、组件组合、事件总线、策略或修饰器，避免过度设计或堆砌臃肿的条件判断。
* 能够在单脚本出现膨胀趋势时主动重构，将高耦合代码拆分为职责清晰的独立模块。

---

## 第四篇：项目架构与工程化实践

> **本篇目标**：能够驾驭包含几十个场景、上百个脚本的中型工程，做到切场景平滑、存档可靠、多人 Git 协作有序、遇到问题能通过调试工具自主定位。

### 4.1 Godot 惯用整体架构

#### 1. 场景树解耦原则：Call Down, Signal Up
```text
        ┌─────────────────┐
        │   Parent Node   │
        └───────┬─────────┘
         ▲      │
         │      │  1. Call Down：父节点直接调用子节点方法
         │      ▼
        ┌───────┴─────────┐
        │   Child Node    │
        └─────────────────┘
         └── 2. Signal Up：子节点发信号向上汇报，避免写死 get_parent()
```
坚持这条原则的主要收益在于**子场景可独立运行**。只要子节点不强依赖父节点的具体结构，即可随时按 `F6` 单独运行主角场景、单个 Boss 或单个 UI 面板进行调试，显著提升开发效率。

#### 2. 推荐的场景树顶层分层
不建议直接用 `get_tree().change_scene_to_file()` 把整个场景树整体替换，那样很难保留常驻 UI 和过渡动画。更稳健的做法是保留一个常驻的 `Main` 根场景作为容器：
```text
Main (Node)
├── WorldContainer (Node)         # 动态加载与卸载当前关卡场景
├── UILayer (CanvasLayer)         # HUD、背包、对话等常驻界面
├── MenuLayer (CanvasLayer)       # 暂停菜单、设置弹窗
└── TransitionLayer (CanvasLayer) # 黑屏淡入淡出或加载遮罩
```

#### 3. UI 的数据与视图分离
在界面系统中可以轻量借鉴 MVP 或 MVVM 思想：
* **数据层**：保存在 `Resource` 或全局数据对象中，数值变动时发出信号，例如 `gold_changed`。
* **视图层**：UI 场景只负责展示和接收按钮点击，不要在 UI 脚本里写扣血或结算伤害的业务规则，只把玩家的操作意图交给数据层或逻辑控制器处理。

#### 4. Autoload 全局单例的使用边界

| 适合做成 Autoload | 不适合放进 Autoload |
| :--- | :--- |
| `Events` 全局事件总线 | 某个具体关卡里的敌人引用或宝箱状态 |
| `SceneManager` 场景切换与转场管理 | 主角的移动速度与跳跃逻辑 |
| `AudioManager` 全局背景音乐与音效管理 | 互相耦合的零散全局变量 |
| `SaveManager` 存档读档与用户设置 | 仅在单个场景内部使用的逻辑 |

#### 5. 架构辨析：为什么一般不在 Godot 里硬套纯 ECS
在部分游戏开发讨论中，ECS 常被视为高性能架构的代表，但在 Godot 中强行实现一套纯 ECS 通常并不合适，原因在于引擎底层的设计定位不同：
* Godot 的核心是面向对象的场景树与节点组合，物理、渲染、动画和编辑器检视面板都深度围绕节点运作。在 GDScript 里手写 ECS，既无法获得底层连续内存带来的 CPU 缓存优势，又会失去可视化搭建场景和检视调参的便利。
* 对于绝大多数独立游戏和中小型项目，**节点组件化 + 自定义 Resource 数据驱动 + Call Down, Signal Up** 就是最贴合 Godot 的架构方案。真遇到万级同屏单位的性能瓶颈时，优先用第五篇提到的 `MultiMeshInstance2D/3D` 与底层 Server API 做局部优化。

### 4.2 场景管理与存档系统

#### 1. 异步后台加载大场景
当关卡资源较大、同步加载会造成画面卡顿时，使用多线程异步加载配合进度信号：
<pre style="background:#1e1e1e;padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0"><code style="font-family:Consolas,monospace;font-size:12.5px;line-height:1.5;color:#abb2bf"><span style="color:#ffffff80;font-style:italic"># scene_loader.gd</span>
<span style="color:#ff7085">class_name</span> <span style="color:#c7ffed">SceneLoader</span>
<span style="color:#ff7085">extends</span> <span style="color:#42ffc2">Node</span>

<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">load_progress_changed</span>(<span style="color:#bce0ff">ratio</span>: <span style="color:#42ffc2">float</span>)
<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">scene_loaded</span>(<span style="color:#bce0ff">instance</span>: <span style="color:#42ffc2">Node</span>)
<span style="color:#ff7085">signal</span> <span style="color:#57b3ff">load_failed</span>(<span style="color:#bce0ff">path</span>: <span style="color:#42ffc2">String</span>)

<span style="color:#ffb373">@export</span> <span style="color:#ff7085">var</span> <span style="color:#bce0ff">world_container</span>: <span style="color:#42ffc2">Node</span>

<span style="color:#ff7085">var</span> <span style="color:#bce0ff">_target_path</span>: <span style="color:#42ffc2">String</span> = <span style="color:#ffeda1">""</span>

<span style="color:#ff7085">func</span> <span style="color:#66e6ff">_ready</span>() -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#57b3ff">set_process</span>(<span style="color:#a1ffe0">false</span>)

<span style="color:#ff7085">func</span> <span style="color:#66e6ff">load_scene</span>(<span style="color:#bce0ff">path</span>: <span style="color:#42ffc2">String</span>) -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#bce0ff">_target_path</span> = <span style="color:#bce0ff">path</span>
	<span style="color:#ff7085">var</span> <span style="color:#bce0ff">err</span> := <span style="color:#c7ffed">ResourceLoader</span>.<span style="color:#57b3ff">load_threaded_request</span>(<span style="color:#bce0ff">_target_path</span>)
	<span style="color:#ff8ccc">if</span> <span style="color:#bce0ff">err</span> != <span style="color:#c7ffed">OK</span>:
		<span style="color:#bce0ff">load_failed</span>.<span style="color:#57b3ff">emit</span>(<span style="color:#bce0ff">_target_path</span>)
		<span style="color:#ff8ccc">return</span>
	<span style="color:#57b3ff">set_process</span>(<span style="color:#a1ffe0">true</span>)

<span style="color:#ff7085">func</span> <span style="color:#66e6ff">_process</span>(<span style="color:#bce0ff">_delta</span>: <span style="color:#42ffc2">float</span>) -&gt; <span style="color:#ff7085">void</span>:
	<span style="color:#ff7085">var</span> <span style="color:#bce0ff">progress</span>: <span style="color:#42ffc2">Array</span> = []
	<span style="color:#ff7085">var</span> <span style="color:#bce0ff">status</span> := <span style="color:#c7ffed">ResourceLoader</span>.<span style="color:#57b3ff">load_threaded_get_status</span>(<span style="color:#bce0ff">_target_path</span>, <span style="color:#bce0ff">progress</span>)

	<span style="color:#ff8ccc">match</span> <span style="color:#bce0ff">status</span>:
		<span style="color:#c7ffed">ResourceLoader</span>.<span style="color:#c7ffed">THREAD_LOAD_IN_PROGRESS</span>:
			<span style="color:#ff8ccc">if</span> <span style="color:#bce0ff">progress</span>.<span style="color:#57b3ff">size</span>() &gt; <span style="color:#a1ffe0">0</span>:
				<span style="color:#bce0ff">load_progress_changed</span>.<span style="color:#57b3ff">emit</span>(<span style="color:#a3a3f5">float</span>(<span style="color:#bce0ff">progress</span>[0]))
		<span style="color:#c7ffed">ResourceLoader</span>.<span style="color:#c7ffed">THREAD_LOAD_LOADED</span>:
			<span style="color:#57b3ff">set_process</span>(<span style="color:#a1ffe0">false</span>)
			<span style="color:#ff7085">var</span> <span style="color:#bce0ff">packed_scene</span> := <span style="color:#c7ffed">ResourceLoader</span>.<span style="color:#57b3ff">load_threaded_get</span>(<span style="color:#bce0ff">_target_path</span>) <span style="color:#bce0ff">as</span> <span style="color:#42ffc2">PackedScene</span>
			<span style="color:#ff8ccc">if</span> <span style="color:#bce0ff">packed_scene</span> == <span style="color:#a1ffe0">null</span>:
				<span style="color:#bce0ff">load_failed</span>.<span style="color:#57b3ff">emit</span>(<span style="color:#bce0ff">_target_path</span>)
				<span style="color:#ff8ccc">return</span>
			<span style="color:#ff8ccc">for</span> <span style="color:#bce0ff">child</span> <span style="color:#ff7085">in</span> <span style="color:#bce0ff">world_container</span>.<span style="color:#57b3ff">get_children</span>():
				<span style="color:#bce0ff">child</span>.<span style="color:#57b3ff">queue_free</span>()
			<span style="color:#ff7085">var</span> <span style="color:#bce0ff">new_scene</span> := <span style="color:#bce0ff">packed_scene</span>.<span style="color:#57b3ff">instantiate</span>()
			<span style="color:#bce0ff">world_container</span>.<span style="color:#57b3ff">add_child</span>(<span style="color:#bce0ff">new_scene</span>)
			<span style="color:#bce0ff">load_progress_changed</span>.<span style="color:#57b3ff">emit</span>(<span style="color:#a1ffe0">1.0</span>)
			<span style="color:#bce0ff">scene_loaded</span>.<span style="color:#57b3ff">emit</span>(<span style="color:#bce0ff">new_scene</span>)
		<span style="color:#c7ffed">ResourceLoader</span>.<span style="color:#c7ffed">THREAD_LOAD_FAILED</span>, <span style="color:#c7ffed">ResourceLoader</span>.<span style="color:#c7ffed">THREAD_LOAD_INVALID_RESOURCE</span>:
			<span style="color:#57b3ff">set_process</span>(<span style="color:#a1ffe0">false</span>)
			<span style="color:#bce0ff">load_failed</span>.<span style="color:#57b3ff">emit</span>(<span style="color:#bce0ff">_target_path</span>)</code></pre>

#### 2. 常见存档方案对比
存档文件统一写入 `user://` 用户数据目录，不要写入只读的 `res://` 目录。

| 方案 | 适用场景 | 优点 | 缺点与注意事项 |
| :--- | :--- | :--- | :--- |
| **`ConfigFile`** | 游戏设置，如音量、分辨率、键位 | 类 INI 格式，读写简单，易于查看 | 不适合复杂嵌套数据 |
| **`JSON`，主存档首选** | 角色进度、背包、关卡解锁 | 通用安全，跨版本兼容好，便于排查 | 需要自行编写字典与对象的转换逻辑 |
| **`ResourceSaver` 保存为 `.tres`** | 本地快速原型测试 | 一行代码即可保存自定义 `Resource` | 安全隐患：`.tres` 可内嵌可执行脚本，不应直接加载外部来源的 `.tres` 存档 |

### 4.3 项目目录规范与 Git 团队协作

#### 1. 按功能模块组织目录
相比把所有脚本放进 `scripts/`、所有场景放进 `scenes/`，在 Godot 中按功能聚合文件夹更好维护——修改某个实体时，它的场景、脚本、贴图和配置都在同一个目录里：
```text
res://
├── autoload/           # 全局单例脚本
├── common/             # 跨模块复用的通用组件
├── entities/
│   ├── player/         # player.tscn、player.gd、贴图与 states/
│   └── enemies/
│       └── slime/      # slime.tscn、slime.gd、slime_data.tres
├── levels/             # 关卡场景与 TileSet
├── ui/                 # HUD、主菜单、主题资源与字体
└── resources/          # 武器、道具、技能配置表
```

#### 2. Git 协作规范
1. **`.gitignore` 基础模板**：
   ```gitignore
   # Godot 4 本地导入缓存与导出凭据，不要提交
   .godot/

   # 由 CSV 自动编译生成的本地化二进制文件
   *.translation

   # 导出构建产物
   *.exe
   *.pck

   # 使用 C# 时的本地缓存
   .mono/
   .vs/
   ```
   说明：Godot 4.1 及以上版本已将导出所需的敏感凭据独立存放在 `.godot/export_credentials.cfg` 并随 `.godot/` 忽略，根目录下的 `export_presets.cfg` 不再包含敏感信息，可直接提交至 Git 供团队共享导出配置。
2. **保留 `.uid` 文件**：Godot 4.4 及以上版本会为资源生成 `.uid` 文件，用于追踪资源引用，应当正常提交到 Git，不要忽略或手动删除。
3. **在编辑器内移动文件**：移动或重命名资源时，应在 Godot 的 FileSystem 面板中操作，避免在系统文件夹里直接拖动，以免引发引用丢失。
4. **减少 `.tscn` 合并冲突**：不要让多人同时修改同一个大场景，应提前拆分好子场景，各自负责独立文件。
5. **统一命名风格**：文件夹、文件名、变量、函数和信号统一使用全小写蛇形命名 `snake_case`，避免 Windows 不区分大小写但导出包区分大小写引发的路径错误；类名和节点名使用 `PascalCase`。

### 4.4 调试、排错与性能分析

除了 `print()`，平时排查问题要充分利用底部 **Debugger** 面板：
* **断点调试**：点击代码行号左侧打断点，暂停执行并逐行检查变量值。
* **Remote 远程场景树**：运行游戏时，在左上角 Scene 面板切换到 **Remote** 标签，可以实时查看运行中的完整场景树、动态生成的节点及属性数值，还能边运行边修改参数测试。
* **Monitors 监视器**：重点关注 `Objects -> Orphan Nodes` 孤儿节点数量。如果该数值持续增长，说明存在创建后未加入场景树或移除后未释放的节点，即内存泄漏。
* **Profiler 性能分析器**：出现掉帧时点击 Start 录制几秒，按耗时排序就能直接定位拖慢帧率的函数。

---

### 第四篇推荐视频与教程
> **推荐视频：《杀戮尖塔》完整复刻综合实战系列**  
> 链接：https://www.bilibili.com/video/BV1PC411L78f
> * **前置要求**：适合在掌握基础节点用法与常用设计模式之后，作为中大型项目综合实战跟练。
> * **覆盖内容**：完整拆解了类《杀戮尖塔》项目的整体架构与多系统流程循环，涵盖回合制战斗循环、手牌交互与逻辑解耦、状态机、修饰器数值修正、Custom Resource 数据驱动、意图系统、地图生成与存档等综合开发技能。
> * **学习目标**：理解中复杂度游戏如何组织模块边界、如何在真实工程中串联多种设计模式与数据驱动架构。

### 第四篇能力自检
完成本篇学习后，应当具备以下能力：
* 能够依据 Call Down, Signal Up 原则划分场景职责，使核心子场景可独立运行调试，并合理规划顶层场景分层与 Autoload 单例边界。
* 能够独立设计并实现异步场景切换、用户设置保存与进度存档系统，并理解 Godot 中面向场景树架构与 ECS 等外部范式的边界差异。
* 能够按功能模块规范组织工程目录、配置 `.gitignore` 开展多人 Git 协作，并熟练借助断点、Remote 场景树、Monitors 与 Profiler 定位逻辑错误、内存泄漏与性能瓶颈。

---

## 第五篇：进阶拓展地图

> **本篇定位**：完成前四篇内容后，即已具备独立开发完整中小型游戏的基础能力。以下五个方向属于按需选修的进阶主题，本篇仅梳理核心概念与学习入口，待实际项目涉及时再深入研究。

### 5.1 Shader 着色器入门
Shader 是运行在 GPU 上的小程序，能以很低的性能开销实现丰富的视觉效果。Godot 使用类 GLSL 的 GDShader 语法，2D 声明 `shader_type canvas_item;`，3D 声明 `shader_type spatial;`。

2D 项目中最实用的四个入门效果是：受击闪白、角色描边、像素溶解、水面波动。

下面是一个可直接使用的 2D 受击闪白示例。为 `Sprite2D` 添加 `ShaderMaterial` 并填入以下代码，受击时用 `Tween` 将 `flash_amount` 从 `1.0` 过渡到 `0.0` 即可：
```glsl
shader_type canvas_item;

uniform vec4 flash_color : source_color = vec4(1.0, 1.0, 1.0, 1.0);
uniform float flash_amount : hint_range(0.0, 1.0) = 0.0;

void fragment() {
	// 进入 fragment() 时 COLOR 已包含贴图采样与节点 modulate 染色结果
	// 仅混合 COLOR.rgb 可同时保留原始透明度与 modulate 染色效果
	COLOR.rgb = mix(COLOR.rgb, flash_color.rgb, flash_amount);
}
```

### 5.2 3D 开发核心差异
从 2D 转向 3D 时，节点、信号与架构思想完全相通，重点补齐以下几块内容：
* **资产导入流程**：推荐使用 Blender 导出 `.glb` 或 `.gltf` 格式，Godot 对其支持最稳定，也可以直接导入 `.blend` 工程文件。
* **核心 3D 节点**：`CharacterBody3D`、`SpringArm3D` 用于防穿墙第三人称相机、`GridMap` 用于 3D 块状地图拼接、`NavigationRegion3D` 搭配 `NavigationAgent3D` 实现 3D 寻路。
* **光照与环境**：`DirectionalLight3D` 模拟太阳光，`WorldEnvironment` 管理天空盒、雾效、辉光与环境光遮蔽。

### 5.3 性能优化进阶
性能优化的第一原则是先用 Profiler 找到真实瓶颈，不要过早优化。常见进阶手段包括：
* **批量渲染重复物体**：草地、树林或大量弹幕使用 `MultiMeshInstance2D/3D`，以极少的 Draw Call 渲染成千上万个实例。
* **屏幕外休眠**：为远处敌人挂载 `VisibleOnScreenEnabler2D/3D`，离开视野后自动暂停更新。
* **底层接口与扩展**：遇到极限计算或实体规模时，可绕过场景树直接调用 `RenderingServer`、`PhysicsServer2D`，或将热点逻辑迁移到 C# 与 GDExtension。

### 5.4 多人联机基础概念
Godot 内置了基于 ENet、WebSocket 和 WebRTC 的联机框架，通常采用客户端-服务端权威模型。核心围绕三个概念展开：
* **`@rpc` 注解**：用于远程过程调用，例如通知所有客户端在指定位置播放爆炸效果。
* **`MultiplayerSpawner`**：自动在所有客户端同步生成与销毁玩家、子弹等节点。
* **`MultiplayerSynchronizer`**：按设定频率自动同步节点的位置、朝向、血量等属性。

### 5.5 本地化与跨平台导出
* **多语言本地化**：将全部文本整理为 CSV 表格导入项目，在界面与代码中填写键值或调用 `tr("UI_START_GAME")`，通过 `TranslationServer.set_locale("en")` 即可切换语言。
* **常见导出注意项**：
  * **Windows**：首次导出需下载对应版本的 Export Templates；修改 `.exe` 图标需要配置 `rcedit`。
  * **Web**：Godot 4.3 起支持单线程网页导出，部署门槛大幅降低；发布到 itch.io 时留意 SharedArrayBuffer 相关勾选。
  * **Android**：需提前配置 JDK、Android SDK 与调试签名密钥，并做好触屏虚拟按键适配。

### 第五篇推荐视频与拓展资源
> **Shader 入门教程**  
> 链接：https://www.bilibili.com/video/BV1tEPXzREfs
> * **前置建议**：不建议在入门初期优先观看，应在完成前四篇基础开发流程、实际有视觉特效需求后再按需选学。
> * **配套参考**：[Godot Shaders 社区效果库](https://godotshaders.com/)

GDshader、3D 开发、多人联机与跨平台导出等方向建议直接以 Godot 官方文档对应专题为准，在具体项目遇到需求时结合官方文档与社区示例按需查阅。

---

## 结语：从教程转向独立 Demo 与 Game Jam

视频教程的价值在于帮助开发者度过零基础阶段、建立设计模式与架构意识；真正拉开工程能力差距的阶段，始于脱离教程、独立制作小型 Demo 以及参加 Game Jam 极限开发比赛。

* **尽早脱离“教程依赖”**：完成入门与综合复刻项目后，应及时转向自主立项。先做体量可控的微型玩法原型，把一个核心机制做扎实、做完整，胜过长期停留在反复跟练教程。
* **通过 Game Jam 压缩验证周期**：48 小时或 72 小时的 Game Jam 能够高强度锻炼范围控制、需求取舍、团队 Git 协作、快速排错与完整打包交付能力。
* **坚持“完成优先于完美”**：限时开发中优先跑通核心玩法闭环，再迭代手感、音效与界面；赛后复盘代码中的耦合与返工点，往往比单纯阅读理论收获更大。
* **以问题驱动查阅文档**：进阶阶段无需系统刷完所有专题视频，遇到具体瓶颈时直接翻阅 Godot 内置文档、官方文档专题与开源示例即可。

---

## 附录：学习资料与素材索引

### 附录 A：核心学习资料总览

| 阶段与分类 | 资料名称 | 链接 | 适用说明 |
| :--- | :--- | :--- | :--- |
| 官方文档 | Godot 4 官方中文文档 | https://docs.godotengine.org/zh-cn/4.x/ | 权威一手文档，贯穿全阶段随时查阅 |
| 第一篇入门 | 跟着 Brackeys 用 Godot 制作第一款游戏 | https://www.bilibili.com/video/BV1fs421N7TD | 国外经典 2D 入门全流程中文搬运版 |
| 第一篇入门 | 国内 Godot 4 2D 游戏开发入门教程 | https://www.bilibili.com/video/BV1fuCrYFEoG | 中文原生 2D 入门实战系列 |
| 第一篇语法 | GDScript 语法讲解视频 | https://www.bilibili.com/video/BV1fx4y1p79u | GDScript 基础语法专项学习 |
| 第一篇节点 | All 219 Godot Nodes Explained In 42 Minutes | B站：https://www.bilibili.com/video/BV1MY4GzYEKC ，YouTube：https://www.youtube.com/watch?v=tO2gthp45MA | 全部内置节点功能速览，用于建立索引印象 |
| 第二篇实战 | Godot 2D 实战：从零开发俯视角射击游戏 | https://www.bilibili.com/video/BV11ngh6xE3s | 类《元气骑士》《挺进地牢》完整实战，涵盖武器、道具、地牢生成、AI 与架构基础 |
| 第三篇模式 | 游戏编程模式教程中文版一 | https://www.bilibili.com/video/BV1e5dbYHEyJ | 基于 *Game Development Patterns with Godot 4*，与下项二选一 |
| 第三篇模式 | 游戏编程模式教程中文版二 | https://www.bilibili.com/video/BV1LsdoBZEgu | 基于 *Game Development Patterns with Godot 4*，与上项二选一 |
| 第四篇实战 | 《杀戮尖塔》完整复刻综合实战 | https://www.bilibili.com/video/BV1PC411L78f | 架构设计、状态机、修饰器与数据驱动综合项目 |
| 第五篇选修 | Shader 入门教程 | https://www.bilibili.com/video/BV1tEPXzREfs | 后期视觉特效选修，不建议入门初期先看 |
| 第五篇选修 | Godot Shaders 社区效果库 | https://godotshaders.com/ | 开源 Shader 效果参考与检索库 |

### 附录 B：免费游戏素材网站
* **Kenney**：https://kenney.nl/assets ，CC0 免费可商用，2D、3D、UI 与音效齐全，风格统一，适合练习。
* **itch.io 免费素材区**：https://itch.io/game-assets/free ，像素风角色、瓦片地图与 UI 资源丰富。
* **OpenGameArt**：https://opengameart.org/ ，开源社区美术与音乐素材库。
* **Freesound** 与 **jsfxr**：https://freesound.org/ 和 https://sfxr.me/ ，前者适合寻找真实环境音效，后者可快速生成复古 8-bit 音效。
* **Poly Haven** 与 **Mixamo**：https://polyhaven.com/ 和 https://www.mixamo.com/ ，前者提供免费 3D 贴图、HDRI 与模型，后者提供免费 3D 角色绑定与动作库。
