import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const name = 'entrorove-setup';
export const inject = ['skills'];
const providerName = 'entrorove-installation-guide';
const directory = fileURLToPath(new URL('./skills/entrorove-setup/', import.meta.url));
const guideFile = new URL('./skills/entrorove-setup/SKILL.md', import.meta.url);
const descriptorFile = new URL('./guide.json', import.meta.url);
const hostContext = '\n\n## DeepSeek Harness host\n\n'
  + 'This guide is running in DeepSeek Harness. Select `--host deepseek-harness --no-hooks` for installation. '
  + 'Use the returned `discovery.skillPath` and `discovery.invokeEnvironment`; the plugin itself has no SDK launcher. '
  + 'Respect the actual host command permissions and `DSH_HOME`. Missing command access remains unperformed. '
  + 'The installed official SDK provides the task capabilities, credentials and updates.\n';

function checkAbort(options, control) {
  options?.signal?.throwIfAborted();
  control.signal.throwIfAborted();
}
async function descriptor(options, control) {
  checkAbort(options, control);
  const value = JSON.parse(await readFile(descriptorFile, { encoding: 'utf8', signal: options?.signal ?? control.signal }));
  if (value.name !== name || typeof value.description !== 'string' || !value.description.trim()) {
    throw new Error('Entrorove plugin guide metadata is invalid; reinstall the same official plugin release.');
  }
  checkAbort(options, control);
  return value;
}
function summary(value) {
  return { name, description: value.description, provider: providerName, source: 'bundled',
    invocation: { modelInvocable: true, userInvocable: true }, path: fileURLToPath(guideFile),
    resourceBase: { kind: 'directory', path: directory.split(path.sep).join('/') } };
}
export function apply(ctx) {
  if (typeof ctx?.skills?.registerProvider !== 'function') {
    throw new Error('Entrorove setup requires the DeepSeek Harness skills service.');
  }
  ctx.skills.registerProvider(control => ({
    name: providerName,
    async list(options) {
      const value = await descriptor(options, control);
      return [{ ...summary(value), rank: 600, locator: name }];
    },
    async get(candidate, options) {
      if (candidate?.name !== name || candidate.locator !== name) return undefined;
      const value = await descriptor(options, control);
      const raw = await readFile(guideFile, { encoding: 'utf8', signal: options?.signal ?? control.signal });
      const header = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u.exec(raw);
      if (!header || raw.length > 65536) throw new Error('Entrorove installation guide is missing or invalid.');
      checkAbort(options, control);
      return { ...summary(value), content: raw.slice(header[0].length).trim() + hostContext };
    },
  }));
}
