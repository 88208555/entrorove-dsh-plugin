# 安装与配置

## 检查已有环境

在实际执行任务的终端或命令工具中检查：

```sh
node --version
npm --version
```

Node.js 应为 20 或更高版本。工具已经提供其他 Node 路径时先检查并复用它；不要因 PATH 缺少 `npx` 就判定没有运行时。兼容 Node 已存在而 npm 缺失时，说明实际缺项。安装新软件需要用户同意，不在业务项目中添加 SDK 依赖。

## 首次安装与后续更新

已有受管安装时，直接使用上次 `discovery.skillPath` 中的启动器处理任务，让后台更新机制检查新版；不要每个任务重复运行 npx 安装命令。

首次安装使用本版引导对应的固定 SDK 版本。正常安装与更新使用同一条短命令；不要每次运行缓存恢复脚本。

macOS / Linux 与 Windows PowerShell：

```sh
npx --yes --prefer-online --registry=https://registry.npmjs.org @entrorove/skill@0.2.75 install --host deepseek-harness --no-hooks
```

固定版本来自本版发布件，不用国内镜像的 `latest` 推断官方版本。核对后续官方发布可运行 `npm view @entrorove/skill@latest version --prefer-online --registry=https://registry.npmjs.org`。需要手动升级时，用核对到的完整版本号执行上面的短命令；原凭证与任务状态复用。

## 安装锁恢复

如果错误码是 `ENTROROVE_INSTALL_LOCK_BUSY`、`ENTROROVE_INSTALL_LOCK_INVALID` 或 `ENTROROVE_INSTALL_LOCK_CLEANUP`，先只读查看：

```sh
npx --yes --prefer-online --registry=https://registry.npmjs.org @entrorove/skill@0.2.75 unlock --install --dry-run
```

需要恢复时去掉 `--dry-run`。它只处理安装锁，不改变账号、任务、协议、业务权限或宿主删除策略。活跃进程、刚创建且没有归属记录的锁、非法内容和链接会保留；过时的空锁只移动保留，不冒充已验证归属后删除。返回 `unlocked`、`canonical`、`retired` 和 `nextStep`，区分已释放锁名与尚未清完的临时目录。成功安装之后的锁删除失败会单独返回 `installationLock.warning`，不会推翻已经完成的安装；原始安装失败仍保留原错误。

不要清空 `NODE_OPTIONS`，不要修改宿主 shim，也不要强删锁目录或凭证。真实 Harness 宿主与 Windows PowerShell 的实机结果必须另行观察，离线注入测试不代表宿主集成已通过。

## npm ENOTEMPTY 自助恢复

出现 `ENOTEMPTY`、`syscall rename` 或非空 `.skill-*` 临时目录冲突，说明 npm 尚未成功启动 SDK。不要反复重跑原命令，也不要清空 `~/.npm`、技能目录或凭证。直接运行下面的独立缓存命令，每次分配私有新缓存，只在确认本次目录身份且持久 SDK 不依赖该缓存后回收；中断或引用不明时保留，并输出本次结果文件路径。不清理旧缓存或其他项目。若仍失败，保留这次真实 npm 错误；不要将它报告为 SDK 执行结果。

下面的独立缓存脚本仅用于 npm 尚未启动 SDK 的 `ENOTEMPTY` 故障，不作为正常安装命令。SDK 的 `unlock --install` 只能恢复 SDK 锁，不能修复尚未启动 SDK 的全局 npm 缓存。脚本不修改全局 npm 配置；身份或引用未知时保留本次缓存并输出明确结果。

macOS / Linux：

```sh
node -e 'const fs=require('\''node:fs'\''),os=require('\''node:os'\''),path=require('\''node:path'\''),cp=require('\''node:child_process'\'');
const version='\''0.2.76'\'',args=['\''--ignore-scripts'\'','\''--yes'\'','\''--prefer-online'\'','\''--registry=https://registry.npmjs.org'\'','\''@entrorove/skill@0.2.76'\'','\''install'\'','\''--host'\'','\''deepseek-harness'\'','\''--no-hooks'\''];
const root=fs.mkdtempSync(path.join(os.tmpdir(),'\''entrorove-install-'\'')),cache=path.join(root,'\''cache'\'');
fs.chmodSync(root,0o700);fs.mkdirSync(cache,{mode:0o700});
const original=fs.lstatSync(cache),owner=fs.lstatSync(root),receipt=path.join(root,'\''result.json'\'');
const canonicalCache=fs.realpathSync(cache);
const same=(a,b)=>a.dev===b.dev&&a.ino===b.ino&&a.uid===b.uid&&a.isDirectory()&&!a.isSymbolicLink()
 &&(process.platform==='\''win32'\''||!(a.mode&0o022));
const inside=(parent,file)=>{const rel=path.relative(parent,file);return rel==='\'''\''||!rel.startsWith('\''..'\''+path.sep)&&rel!=='\''..'\''&&!path.isAbsolute(rel)};
const inCache=file=>inside(cache,file)||inside(canonicalCache,file);
let code=1,reason='\''installation-not-started'\'',cleaned=false,persistent=false,installationOutcome='\''not-started'\'';
function persistentRuntime(){
 const marker=path.join(os.homedir(),'\''.codex'\'','\''skills'\'','\''entrorove'\'','\''.entrorove-managed.json'\'');
 try{
  const stat=fs.lstatSync(marker);if(!stat.isFile()||stat.isSymbolicLink())return false;
  const value=JSON.parse(fs.readFileSync(marker,'\''utf8'\'')),cli=value.sdkRuntime?.cli;
  if(typeof cli!=='\''string'\''||!path.isAbsolute(cli)||inCache(cli))return false;
  const actual=fs.realpathSync(cli),meta=JSON.parse(fs.readFileSync(path.join(path.dirname(actual),'\''package.json'\''),'\''utf8'\''));
  return value.schemaVersion==='\''entrorove.managed-install/1.0'\''&&value.name==='\''entrorove'\''&&value.version===version
   &&meta.name==='\''@entrorove/skill'\''&&meta.version===version&&!inCache(actual)&&fs.lstatSync(actual).isFile();
 }catch{return false}
}
function cacheReferenced(){
 const marker=path.join(os.homedir(),'\''.codex'\'','\''skills'\'','\''entrorove'\'','\''.entrorove-managed.json'\'');
 try{
  const stat=fs.lstatSync(marker);if(!stat.isFile()||stat.isSymbolicLink())return true;
  const value=JSON.parse(fs.readFileSync(marker,'\''utf8'\'')),cli=value.sdkRuntime?.cli;
  if(typeof cli!=='\''string'\''||!path.isAbsolute(cli))return true;
  return inCache(cli)||inCache(fs.realpathSync(cli));
 }catch(error){return error.code!=='\''ENOENT'\''}
}
try{
 const env={...process.env,npm_config_cache:cache,ENTROROVE_AUTO_UPDATE:'\''0'\''};
 const windows=process.platform==='\''win32'\'',command=windows?(process.env.ComSpec||'\''cmd.exe'\''):'\''npx'\'';
 const argv=windows?['\''/d'\'','\''/s'\'','\''/c'\'','\''npx.cmd '\''+args.join('\'' '\'')]:args;
 const result=cp.spawnSync(command,argv,{stdio:'\''inherit'\'',env,windowsHide:true});
 code=Number.isInteger(result.status)?result.status:1;
 reason=result.error?'\''installation-launch-failed'\'':result.signal?'\''installation-interrupted'\'':'\''installation-exited'\'';
 installationOutcome=reason;
}finally{
 try{
  persistent=persistentRuntime();
  if(!same(fs.lstatSync(root),owner)||!same(fs.lstatSync(cache),original))reason='\''cache-identity-changed'\'';
  else if(installationOutcome==='\''installation-interrupted'\'')reason='\''process-completion-unverified'\'';
  else if(cacheReferenced())reason='\''cache-reference-unverified'\'';
  else if(code===0&&!persistent)reason='\''persistent-sdk-unverified'\'';
  else{fs.rmSync(cache,{recursive:true});cleaned=true;reason='\''owned-cache-released'\''}
 }catch{reason='\''cache-cleanup-incomplete'\''}
 try{
  if(same(fs.lstatSync(root),owner)){
   fs.writeFileSync(receipt,JSON.stringify({schemaVersion:'\''entrorove.install-recovery-result/1.0'\'',version,
    exitCode:code,installationOutcome,sdkRuntimePersistent:persistent,cache,cleaned,reason,
    observedAt:new Date().toISOString(),rawLogsRetained:cleaned?false:'\''unverified'\''})+'\''\n'\'',{flag:'\''wx'\'',mode:0o600});
   process.stderr.write('\''Entrorove installation result: '\''+receipt+'\''\n'\'');
  }else process.stderr.write('\''ENTROROVE_INSTALL_CACHE_IDENTITY_CHANGED\n'\'');
 }catch{process.stderr.write('\''ENTROROVE_INSTALL_RESULT_NOT_RECORDED\n'\'')}
 process.exitCode=code;
}'
```

Windows PowerShell：

```powershell
node -e 'const fs=require(''node:fs''),os=require(''node:os''),path=require(''node:path''),cp=require(''node:child_process'');
const version=''0.2.76'',args=[''--ignore-scripts'',''--yes'',''--prefer-online'',''--registry=https://registry.npmjs.org'',''@entrorove/skill@0.2.76'',''install'',''--host'',''deepseek-harness'',''--no-hooks''];
const root=fs.mkdtempSync(path.join(os.tmpdir(),''entrorove-install-'')),cache=path.join(root,''cache'');
fs.chmodSync(root,0o700);fs.mkdirSync(cache,{mode:0o700});
const original=fs.lstatSync(cache),owner=fs.lstatSync(root),receipt=path.join(root,''result.json'');
const canonicalCache=fs.realpathSync(cache);
const same=(a,b)=>a.dev===b.dev&&a.ino===b.ino&&a.uid===b.uid&&a.isDirectory()&&!a.isSymbolicLink()
 &&(process.platform===''win32''||!(a.mode&0o022));
const inside=(parent,file)=>{const rel=path.relative(parent,file);return rel===''''||!rel.startsWith(''..''+path.sep)&&rel!==''..''&&!path.isAbsolute(rel)};
const inCache=file=>inside(cache,file)||inside(canonicalCache,file);
let code=1,reason=''installation-not-started'',cleaned=false,persistent=false,installationOutcome=''not-started'';
function persistentRuntime(){
 const marker=path.join(os.homedir(),''.codex'',''skills'',''entrorove'',''.entrorove-managed.json'');
 try{
  const stat=fs.lstatSync(marker);if(!stat.isFile()||stat.isSymbolicLink())return false;
  const value=JSON.parse(fs.readFileSync(marker,''utf8'')),cli=value.sdkRuntime?.cli;
  if(typeof cli!==''string''||!path.isAbsolute(cli)||inCache(cli))return false;
  const actual=fs.realpathSync(cli),meta=JSON.parse(fs.readFileSync(path.join(path.dirname(actual),''package.json''),''utf8''));
  return value.schemaVersion===''entrorove.managed-install/1.0''&&value.name===''entrorove''&&value.version===version
   &&meta.name===''@entrorove/skill''&&meta.version===version&&!inCache(actual)&&fs.lstatSync(actual).isFile();
 }catch{return false}
}
function cacheReferenced(){
 const marker=path.join(os.homedir(),''.codex'',''skills'',''entrorove'',''.entrorove-managed.json'');
 try{
  const stat=fs.lstatSync(marker);if(!stat.isFile()||stat.isSymbolicLink())return true;
  const value=JSON.parse(fs.readFileSync(marker,''utf8'')),cli=value.sdkRuntime?.cli;
  if(typeof cli!==''string''||!path.isAbsolute(cli))return true;
  return inCache(cli)||inCache(fs.realpathSync(cli));
 }catch(error){return error.code!==''ENOENT''}
}
try{
 const env={...process.env,npm_config_cache:cache,ENTROROVE_AUTO_UPDATE:''0''};
 const windows=process.platform===''win32'',command=windows?(process.env.ComSpec||''cmd.exe''):''npx'';
 const argv=windows?[''/d'',''/s'',''/c'',''npx.cmd ''+args.join('' '')]:args;
 const result=cp.spawnSync(command,argv,{stdio:''inherit'',env,windowsHide:true});
 code=Number.isInteger(result.status)?result.status:1;
 reason=result.error?''installation-launch-failed'':result.signal?''installation-interrupted'':''installation-exited'';
 installationOutcome=reason;
}finally{
 try{
  persistent=persistentRuntime();
  if(!same(fs.lstatSync(root),owner)||!same(fs.lstatSync(cache),original))reason=''cache-identity-changed'';
  else if(installationOutcome===''installation-interrupted'')reason=''process-completion-unverified'';
  else if(cacheReferenced())reason=''cache-reference-unverified'';
  else if(code===0&&!persistent)reason=''persistent-sdk-unverified'';
  else{fs.rmSync(cache,{recursive:true});cleaned=true;reason=''owned-cache-released''}
 }catch{reason=''cache-cleanup-incomplete''}
 try{
  if(same(fs.lstatSync(root),owner)){
   fs.writeFileSync(receipt,JSON.stringify({schemaVersion:''entrorove.install-recovery-result/1.0'',version,
    exitCode:code,installationOutcome,sdkRuntimePersistent:persistent,cache,cleaned,reason,
    observedAt:new Date().toISOString(),rawLogsRetained:cleaned?false:''unverified''})+''\n'',{flag:''wx'',mode:0o600});
   process.stderr.write(''Entrorove installation result: ''+receipt+''\n'');
  }else process.stderr.write(''ENTROROVE_INSTALL_CACHE_IDENTITY_CHANGED\n'');
 }catch{process.stderr.write(''ENTROROVE_INSTALL_RESULT_NOT_RECORDED\n'')}
 process.exitCode=code;
}'
```

`--no-hooks` 让这条引导安装命令不启用聊天监听或工具守卫。重复安装会更新未修改的受管内容；发现手工修改、同版本内容冲突或其他文件占用时明确报错或保留现有文件，不覆盖用户内容。不要自行清空目录再重装。

读取安装输出中的 `discovery.skillPath`，再读取其中的 `SKILL.md`。保留当前项目工作目录，使用该目录里的 `sdk-entry.sh`（macOS/Linux）或 `sdk-entry.ps1`（Windows）。SDK 记录自己的运行时和持久入口；不要把 npm 临时缓存地址写进市场引导。

每次 SDK 调用使用 `discovery.invokeEnvironment.ENTROROVE_IDE` 对应的真实软件身份。可靠的原生会话标记可继续自动识别；没有标记时显式设置实际软件，不借用其他 IDE 的会话编号。

## 首次自动开通

首次实际任务使用已安装受管目录的 `sdk-entry.sh connect` 或 `sdk-entry.ps1 connect`。已有个人凭证原样复用；没有凭证时，SDK 给出一次可见告知，生成本机安装身份，经服务端挑战验证后自动开通体验账号并保存有效期24小时的临时凭证，不打开网站。安装、`--dry-run`、`--version` 和管理命令不会自动开户。

所有支持 SDK 的办公软件和 IDE 均使用此规则；24小时后提示用户进入 https://entrorove.com 登录获得个人密钥，不自动续期。安装级账号不代表宿主真实用户，不默认获取昵称、邮箱或手机号；渠道仅是自报统计。体验仅开放有限分析和本地任务建议，不获得付费、后台、云模型或正式账号数据权限。额度耗尽或受限操作会明确说明，不要求反复配置密钥。可用 `ENTROROVE_AUTO_CONNECT=0` 关闭自动开通。

## 绑定已有正式账号（可选）

已配置时直接复用，不因新任务、会话或版本更新重复索要密钥。确实缺少凭证时，用户自行打开 [entrorove.com](https://entrorove.com)，完成账号登录并在账号界面复制个人密钥。密钥留在用户自己的环境，不发到对话中。

在与 SDK 相同的执行环境中运行：

```sh
npx --yes --prefer-online --registry=https://registry.npmjs.org @entrorove/skill@latest configure
```

通过该进程的私有标准输入传入 `{"token":"<个人密钥>"}`，再发送 EOF。macOS/Linux 终端通常按 Ctrl-D；Windows 控制台通常按 Ctrl-Z 再回车。宿主支持私有输入或秘密变量时使用其相应功能，不在公开工具记录中展开秘密。

不要使用含密钥的命令参数、URL、`echo` 命令、源码、截图或日志。桌面凭证不自动共享给云端沙箱；只在实际 SDK 运行环境配置一次，并遵从平台的秘密存储与连接器规则。

## 验证与更新

从安装输出指定的受管目录运行启动器的 `--version`，确认实际 SDK 版本。根据用户的实际任务调用一项相关能力，并保留真实结果或错误；`--version` 与目录检查不能代替能力执行。

市场引导目录可能没有启动器，不能把 `~/.dsh/skills/entrorove` 当作固定 SDK 路径；以安装返回的 `discovery.skillPath` 为准。本地命令使用 `sdk-entry.sh local capabilities` 查看操作名及输入结构；操作名放命令参数，标准输入只放该操作的 JSON 参数对象，不是 `{"operation":"capabilities"}`。例如 `preflight` 至少需要实际 `repositoryRoot`，`discipline-check` 还需要相对该目录的 `targetPath`；只按当前任务需要调用，不把它们作为固定流程。通过管道或输入重定向传入完整 JSON 并结束标准输入，具体示例见受管 SDK 的 `IDE-EXECUTION.md`。

更新时重新运行相同的 `install --host <实际软件> --no-hooks` 命令，或使用受管入口已有的后台更新机制。凭证和任务状态复用。原市场引导保持通用，不复制 npm 运行时，也不为每个宿主维护不同的版本包。
