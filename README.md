# Evidence-Based Development Framework from Requirements to Acceptance

Enter a task goal. The cloud breaks down the work, coordinates execution, and supports acceptance with execution results and signed evidence. Use this development skill when users mention Entrorove, code review, regression evidence for a bug fix, delivery or contractor acceptance, compliance evidence, cloud planning, task acceptance, or the evidence platform, or when they need to install, update, or first connect the Entrorove SDK.

Enable this plugin in DeepSeek Harness to access the `entrorove-setup` guide. The guide connects the official SDK, which provides planning, coordination, and delivery acceptance.

## Install in Harness

In DeepSeek Harness plugin management, install this npm package:

```text
@entrorove/dsh-plugin@1.0.13
```

Or install into the `web` profile with the Harness CLI:

```sh
dsh plugin --profile web add @entrorove/dsh-plugin
```

Enable the bundle and select `entrorove-setup` in a session. Ask it to install Entrorove for DeepSeek Harness. The guide checks the actual command environment and uses `--host deepseek-harness --no-hooks`.

The SDK installer returns the managed `discovery.skillPath`. Read its `SKILL.md` and use the launcher there. The setup plugin does not contain a launcher. An existing Entrorove installation and personal credential are reused. On the first actual task, the SDK can provision a private 24-hour installation credential; after expiry it directs the user to the website for a personal key.

This version pins first-time installation, unlock and cache recovery to SDK 0.2.89. It reuses the existing installation, credential and host configuration.

Harness 0.2.2-rc.1 or newer within 0.2.x is supported. Its skills service and an authorized command environment are required. Plugin installation, enabled state, skill discovery and a successful SDK call are separate observations.

## Contents and behavior

- Registers only the `entrorove-setup` guide through the Harness skill service.
- Shares the existing marketplace guide and three reference documents.
- Performs no command execution, network calls, automatic SDK installation, credential access or hooks when the plugin is loaded.
- Keeps the plugin version independent of SDK and capability versions.
- Does not provide a separate Entrorove runtime or identify a verified DeepSeek user.

Source: [Entrorove Harness plugin](https://github.com/88208555/entrorove-dsh-plugin). Website: [entrorove.com](https://entrorove.com). [中文说明](README.zh.md).
