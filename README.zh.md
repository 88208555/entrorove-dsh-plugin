# DeepSeek Harness 熵巡安装引导

在 DeepSeek Harness 中接入熵巡 Entrorove。本插件提供 `entrorove-setup` 安装引导，帮助安装官方 SDK，并开始使用任务分析、规划与交付核验能力。

## 安装

在 DeepSeek Harness 的插件管理中安装：

```text
@entrorove/dsh-plugin@1.0.3
```

也可以使用 Harness CLI，安装到 `web` profile：

```sh
dsh plugin --profile web add @entrorove/dsh-plugin
```

启用组合包后，在会话中选择「熵巡安装引导」（`entrorove-setup`），让它为当前 Harness 安装 Entrorove。引导先检查实际命令环境，再使用 `--host deepseek-harness --no-hooks`。

保留 SDK 安装输出中的 `discovery.skillPath`，读取那个目录中的 `SKILL.md` 并使用其启动器。引导插件本身没有启动器。已有受管安装与个人密钥原样复用；无凭证时首次实际任务可自动领取 24 小时临时密钥，到期后提示进入官网登录获取个人密钥。

兼容 Harness 0.2.2-rc.1 及其后的 0.2.x 版本。宿主需要技能服务与实际可用、获准的命令环境。插件已安装、已启用、技能可发现和 SDK 调用成功分别验证。

## 插件边界

- 通过 Harness 技能服务注册安装引导，复用同一份通用市场文档。
- 插件加载时不执行命令、不联网、不自动安装 SDK、不读取凭证、不配置 Hook。
- 正式技能名称为 `entrorove`，与 `entrorove-setup` 分开；继续保持单一受管运行时。
- 插件版本独立，不为适配复制九项能力或增加它们的版本。
- 安装身份不代表已验证的 DeepSeek 用户；权限、限额与到期规则仍由原 SDK 和服务端处理。

[源码](https://github.com/88208555/entrorove-dsh-plugin) · [官网](https://entrorove.com) · [English](README.md)
