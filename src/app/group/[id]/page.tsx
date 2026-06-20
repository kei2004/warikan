export const runtime = 'edge';

import { getGroup } from '@/lib/db';
import { notFound } from 'next/navigation';
import { GroupDashboard } from '@/components/GroupDashboard';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroupPage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);

  if (!group) {
    // 存在しないか、30日経過で削除された場合
    notFound();
  }

  return <GroupDashboard group={group} />;
}
