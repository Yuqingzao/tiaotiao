# 跳跳塘（TiaoTiao）—— 撑杆跳跃闯关游戏

![Gameplay Preview](https://via.placeholder.com/800x400?text=Demo+GIF+Placeholder)

基于 Cocos Creator 3.8.8 + TypeScript 开发的 2D 横版撑杆跳跃闯关小游戏。玩家在自动跑动中收集杆子、撑杆跨越沟壑、空中开伞减速、躲避随机风力，挑战更高分数。

## 游戏特色

- **单指操作**：触摸按住撑杆、松手起跳、空中点击开伞，三套核心动作一气呵成
- **随机关卡**：障碍模块循环滚动 + 随机生成（约 1/3 概率无杆），每次游玩体验不同
- **动态环境**：随机风力扰动、视差滚动背景（草地 / 建筑 / 云层三速不同）
- **分数系统**：实时计分 + 最佳成绩本地持久化（localStorage）
- **视听表现**：Animation Graph 状态机驱动的角色动画 + BGM / 多通道音效
- **多端构建**：Cocos Creator 原生支持 Web / 移动端 / 小游戏等多平台导出

## 玩法说明

| 场景 | 操作 | 效果 |
| --- | --- | --- |
| 地面 · 接近杆子 | 点击 | 拾取杆子（拿杆） |
| 地面 · 已持杆 | 按住 -> 松手 | 撑杆蓄力（按住越久跳得越高），松手起跳 |
| 地面 · 无杆 | 点击 | 普通跳跃 |
| 空中 · 下落阶段 | 点击 | 开伞减速（撑伞），可应对长距离落点 |
| 空中 · 开伞中 | 点击 | 收伞恢复正常重力 |

> 分数规则：每收集一根杆子 `+5` 分；掉落沟壑即游戏结束。

## 技术栈

- **引擎**：Cocos Creator 3.8.8
- **语言**：TypeScript
- **物理**：内置 2D 物理系统（Collider2D 碰撞检测）
- **动画**：Animation Graph（动画状态机 + 参数驱动）
- **存储**：`sys.localStorage`（最佳分数持久化）

## 项目结构

```
tiaotiao/
├── assets/
│   ├── animation/            # 动画资源（Animation Graph + 各动作 .anim）
│   │   ├── Animation Graph.animgraph
│   │   ├── run.anim          # 奔跑
│   │   ├── tiao.anim         # 跳跃
│   │   ├── paogan.anim       # 跑杆
│   │   ├── nagan.anim        # 拿杆
│   │   ├── chenggan.anim     # 撑杆
│   │   ├── chengsan.anim     # 撑伞
│   │   └── ...
│   ├── resources/
│   │   ├── audios/           # 音频（BGM + 音效）
│   │   └── textures/         # 图集（plist + png）
│   ├── scene/
│   │   └── game.scene        # 主场景
│   └── scripts/
│       ├── common/
│       │   ├── gameconst.ts  # 游戏状态枚举 & 碰撞标签
│       │   ├── gamedata.ts   # 全局数据（单例：分数、最佳分、状态）
│       │   └── gameevent.ts  # 全局事件名定义
│       ├── game.ts           # 主控逻辑（移动 / 跳跃 / 撑杆 / 开伞 / 风）
│       ├── playercollider.ts # 玩家碰撞分发
│       ├── gamestart.ts      # 开始界面
│       ├── over.ts           # 结束 / 复活界面
│       └── teach.ts          # 新手教程
├── settings/                 # 引擎项目配置
├── .gitignore
├── package.json
├── tsconfig.json
└── LICENSE
```

## 快速开始

### 环境要求

- Cocos Creator 3.8.8（需与项目版本一致，避免编辑器兼容性问题）
- Node.js（仅命令行构建时需要）

### 运行项目

1. 安装 [Cocos Creator 3.8.8](https://www.cocos.com/creator)
2. 用 Cocos Dashboard 打开本项目根目录
3. 打开 `assets/scene/game.scene` 主场景
4. 点击编辑器顶部 **预览** 即可在浏览器中运行

### 构建发布

通过编辑器菜单 `项目 -> 构建发布`，可选择目标平台（Web Mobile / Web Desktop / 微信小游戏 / 原生等）。

## 核心实现要点

### 1. 全局数据与事件解耦
`gamedata` 采用单例模式管理分数与游戏状态，避免组件间直接耦合。`gameevent` 集中声明事件名，使用 `director.emit / on` 实现跨组件通信（如碰撞 -> 加分 / 游戏结束）。

### 2. 视差滚动背景
`grass / buiding / cloud` 三层节点以不同速度（1.0 / 0.4 / 0.05）向左移动，并在移出屏幕时回卷，营造纵深感。位置计算复用 `tempPos` 避免每帧 `new`，减少 GC。

### 3. 撑杆蓄力跳跃
按住期间累计帧数 `chumozhen_chenggan`，松手时按 `yspeed = 帧数 x 16` 计算起跳速度，实现"按住越久跳得越高"的手感。

### 4. 随机障碍生成
`suijizhangai()` 在障碍模块回卷时随机化：杆子是否出现、平台长度（`scaleX`）、间距，并通过碰撞盒边缘计算保证杆与平台不重叠。

### 5. 动画状态机驱动
角色动画由 Animation Graph 参数（`is_dimian / is_up / has_gan / is_chenggan / is_chengsan / is_feng / is_over`）驱动，逻辑层只设参数、状态机负责混合过渡。

### 6. 碰撞标签体系
`playercollider` 通过 `Collider2D.tag` 分发事件：
- `tag 5` -> 收集杆子加分
- `tag 10` -> 触发游戏结束
- `tag 100` -> 进入可拿杆区域

## 开源协议

本项目基于 MIT License 开源，仅供学习交流使用，商用请联系作者。音效、美术资源版权归原作者所有。

## 致谢

- 引擎：[Cocos Creator](https://www.cocos.com/creator)

- 单指操作：触摸按住撑杆、松手起跳、空中点击开伞，三套核心动作一气呵成
- 随机关卡：障碍模块循环滚动 + 随机生成（约 1/3 概率无杆），每次游玩体验不同
- 动态环境：随机风力扰动、视差滚动背景（草地 / 建筑 / 云层三速不同）
- 分数系统：实时计分 + 最佳成绩本地持久化（localStorage）
- 视听表现：Animation Graph 状态机驱动的角色动画 + BGM / 多通道音效
- 多端构建：Cocos Creator 原生支持 Web / 移动端 / 小游戏等多平台导出

## 玩法说明

| 场景 | 操作 | 效果 |
| --- | --- | --- |
| 地面 · 接近杆子 | 点击 | 拾取杆子（拿杆） |
| 地面 · 已持杆 | 按住 -> 松手 | 撑杆蓄力（按住越久跳得越高），松手起跳 |
| 地面 · 无杆 | 点击 | 普通跳跃 |
| 空中 · 下落阶段 | 点击 | 开伞减速（撑伞），可应对长距离落点 |
| 空中 · 开伞中 | 点击 | 收伞恢复正常重力 |

> 分数规则：每收集一根杆子 `+5` 分；掉落沟壑即游戏结束。

## 技术栈

- 引擎：Cocos Creator 3.8.8
- 语言：TypeScript
- 物理：内置 2D 物理系统（Collider2D 碰撞检测）
- 动画：Animation Graph（动画状态机 + 参数驱动）
- 存储：`sys.localStorage`（最佳分数持久化）

## 项目结构

```
tiaotiao/
├── assets/
│   ├── animation/            # 动画资源（Animation Graph + 各动作 .anim）
│   │   ├── Animation Graph.animgraph
│   │   ├── run.anim          # 奔跑
│   │   ├── tiao.anim         # 跳跃
│   │   ├── paogan.anim       # 跑杆
│   │   ├── nagan.anim        # 拿杆
│   │   ├── chenggan.anim     # 撑杆
│   │   ├── chengsan.anim     # 撑伞
│   │   └── ...
│   ├── resources/
│   │   ├── audios/           # 音频（BGM + 音效）
│   │   └── textures/         # 图集（plist + png）
│   ├── scene/
│   │   └── game.scene        # 主场景
│   └── scripts/
│       ├── common/
│       │   ├── gameconst.ts  # 游戏状态枚举 & 碰撞标签
│       │   ├── gamedata.ts   # 全局数据（单例：分数、最佳分、状态）
│       │   └── gameevent.ts  # 全局事件名定义
│       ├── game.ts           # 主控逻辑（移动 / 跳跃 / 撑杆 / 开伞 / 风）
│       ├── playercollider.ts # 玩家碰撞分发
│       ├── gamestart.ts      # 开始界面
│       ├── over.ts           # 结束 / 复活界面
│       └── teach.ts          # 新手教程
├── settings/                 # 引擎项目配置
├── .gitignore
├── package.json
└── tsconfig.json
```

## 快速开始

### 环境要求

- Cocos Creator 3.8.8（需与项目版本一致，避免编辑器兼容性问题）
- Node.js（仅命令行构建时需要）

### 运行项目

1. 安装 [Cocos Creator 3.8.8](https://www.cocos.com/creator)
2. 用 Cocos Dashboard 打开本项目根目录
3. 打开 `assets/scene/game.scene` 主场景
4. 点击编辑器顶部 **预览** 即可在浏览器中运行

### 构建发布

通过编辑器菜单 `项目 -> 构建发布`，可选择目标平台（Web Mobile / Web Desktop / 微信小游戏 / 原生等）。

## 核心实现要点

### 1. 全局数据与事件解耦
`gamedata` 采用单例模式管理分数与游戏状态，避免组件间直接耦合。`gameevent` 集中声明事件名，使用 `director.emit / on` 实现跨组件通信（如碰撞 -> 加分 / 游戏结束）。

### 2. 视差滚动背景
`grass / buiding / cloud` 三层节点以不同速度（1.0 / 0.4 / 0.05）向左移动，并在移出屏幕时回卷，营造纵深感。位置计算复用 `tempPos` 避免每帧 `new`，减少 GC。

### 3. 撑杆蓄力跳跃
按住期间累计帧数 `chumozhen_chenggan`，松手时按 `yspeed = 帧数 x 16` 计算起跳速度，实现"按住越久跳得越高"的手感。

### 4. 随机障碍生成
`suijizhangai()` 在障碍模块回卷时随机化：杆子是否出现、平台长度（`scaleX`）、间距，并通过碰撞盒边缘计算保证杆与平台不重叠。

### 5. 动画状态机驱动
角色动画由 Animation Graph 参数（`is_dimian / is_up / has_gan / is_chenggan / is_chengsan / is_feng / is_over`）驱动，逻辑层只设参数、状态机负责混合过渡。

### 6. 碰撞标签体系
`playercollider` 通过 `Collider2D.tag` 分发事件：
- `tag 5` -> 收集杆子加分
- `tag 10` -> 触发游戏结束
- `tag 100` -> 进入可拿杆区域

## 开源协议

本项目仅供学习交流使用，商用请联系作者。音效、美术资源版权归原作者所有。

## 致谢

- 引擎：[Cocos Creator](https://www.cocos.com/creator)