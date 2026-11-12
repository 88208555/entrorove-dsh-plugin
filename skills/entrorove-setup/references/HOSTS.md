# DeepSeek Harness 安装入口

本引导的目标宿主为 DeepSeek Harness，安装时明确使用：

```text
--host deepseek-harness --no-hooks
```

Harness 插件需要 Node.js 24.9.0 或更新版本，以及实际可用、获准的命令工具。SDK 本身需要 Node.js 20 或更新版本。没有命令工具或兼容运行时时，记录具体缺项，不宣称已经安装或完成 SDK 调用。

宿主配置目录默认使用 `~/.dsh`；设置 `DSH_HOME` 时沿用该目录。安装完成后读取实际返回的 `discovery.skillPath` 和 `discovery.invokeEnvironment`，不猜测启动器路径。安装引导与正式 `entrorove` 技能可以共存，已有受管副本和凭证继续复用。

插件加载时只提供安装说明。命令执行和 SDK 调用由当前会话依据实际权限进行，安装成功、技能发现、启用和 SDK 调用结果分别观察。
