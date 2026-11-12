# 选择当前真实宿主

`npx --yes --prefer-online --registry=https://registry.npmjs.org @entrorove/skill@latest hosts` 返回当前 SDK 登记的标识、别名、原生目录与接入方式。只为用户实际使用的软件安装，不批量安装其他软件。

| 当前软件 | `--host` 标识 |
| --- | --- |
| WorkBuddy / 企业版 | `workbuddy` / `workbuddy-enterprise` |
| CodeBuddy | `codebuddy` |
| 千问办公 / Qwen Code | `qwenwork` / `qwen-code` |
| TRAE / TRAE CN | `trae` |
| 通义灵码 / Qoder | `qoder` |
| DeepSeek Harness | `deepseek-harness` |
| Kimi Code CLI | `kimi` |
| 华为码道 / ZCode | `codearts-agent` / `zcode` |
| 百度 Comate / 京东 JoyCode | `comate` / `joycode` |
| 豆包工作 / 飞书 Aily | `doubao-work` / `feishu-aily` |
| 钉钉悟空 / Manus | `dingtalk-wukong` / `manus` |
| 扣子 / 百度搭子 | `coze` / `dumate` |
| QwenPaw（CoPaw）/ ArkClaw | `qwenpaw` / `arkclaw` |
| 腾讯云智能体开发平台 | `tencent-adp` |
| AStudio / ACode Harness | `astudio` / `acode` |
| WPS 灵犀 / 智谱 AutoClaw | `wps-lingxi` / `autoclaw` |
| LobsterAI 有道龙虾 / MiniMax Agent | `lobsterai` / `minimax-agent` |
| 360 安全龙虾 | `360-claw` |

表中 `guided-install` 产品仅提供身份、通用引导和官方接入文档。安装结果为 `requires-host-setup` 时，按该产品的技能管理界面启用引导，并确认它提供命令工具和运行时。不要创建猜测的本地技能目录，也不要将 SDK 可用声称为宿主已加载。

企业微信、普通钉钉、飞书聊天、腾讯文档、ima 和抖音等渠道不因提供机器人或 API 就成为本地技能宿主。先确认实际承载任务的代理，如 WorkBuddy、CodeBuddy、QwenPaw 或悟空，再选择其标识。只沿用用户已配置的通道与组织权限，不自动建机器人、注册连接器或发送消息。

豆包开放平台公开上架的外部服务须使用其认可的连接器或已注册工具；没有该连接器时说明缺项，不通过 Shell 绕过。其他云端产品同样以实际工具、网络与凭证规则为准。

DeepSeek Harness 的技能主目录遵从绝对 `DSH_HOME`，Qoder 遵从绝对 `QODER_CONFIG_DIR`。设置了这些配置不等于当前进程属于那个宿主。可靠身份信号、显式选择和安装预览分别处理。

Marvis 未确认独立产品身份，不将其擅自映射为 Manus。QClaw 与 iFlow CLI 的停服或迁移按其官方通知处理，不把旧产品登记为新的就绪接入。

## 单一受管副本与复用

SDK 保持一份 canonical 受管副本，`discovery.canonicalSkillPath` 指向它。`discovery.skillPath` 是当前宿主实际可调用入口；通常由原生目录链接到 canonical 副本。原生目录有市场引导、手改文件或其他内容时保留原文件，返回受管入口。`reusedManagedCopy` 和 `managedCopyReason` 明确说明复用状态与原因。显式 `--host` 选择当前宿主，不会授权覆盖或迁移旧目录。
