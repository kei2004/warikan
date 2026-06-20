import { Member, Payment } from './calculations';
import { getRequestContext } from '@cloudflare/next-on-pages';

export type Group = {
  id: string;
  name: string;
  createdAt: string;
  members: Member[];
  payments: Payment[];
  roundUp: boolean;
};

// getKV() ヘルパー関数: Cloudflare KV のインスタンスを取得
function getKV(): KVNamespace {
  const env = getRequestContext().env as CloudflareEnv;
  if (!env || !env.WARIKAN_DB) {
    throw new Error('WARIKAN_DB is not bound. Please run with wrangler pages:dev or check Cloudflare settings.');
  }
  return env.WARIKAN_DB;
}

export async function getGroup(id: string): Promise<Group | null> {
  const kv = getKV();
  const data = await kv.get(id);
  
  if (!data) return null;

  const group = JSON.parse(data) as Group;

  // 30日経過チェック
  const createdDate = new Date(group.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    // 期限切れの場合はKVから削除してnullを返す
    await kv.delete(id);
    return null;
  }

  return group;
}

export async function createGroup(name: string, members: Member[]): Promise<Group> {
  const kv = getKV();
  const id = crypto.randomUUID();
  const newGroup: Group = {
    id,
    name,
    createdAt: new Date().toISOString(),
    members,
    payments: [],
    roundUp: false,
  };
  
  // KVに保存 (JSON形式の文字列に変換)
  await kv.put(id, JSON.stringify(newGroup));
  return newGroup;
}

export async function updateGroup(id: string, updateFn: (group: Group) => Group): Promise<Group | null> {
  const kv = getKV();
  const data = await kv.get(id);
  
  if (!data) return null;

  const group = JSON.parse(data) as Group;
  const updatedGroup = updateFn(group);
  
  await kv.put(id, JSON.stringify(updatedGroup));
  return updatedGroup;
}
