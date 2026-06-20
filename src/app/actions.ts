'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createGroup, updateGroup } from '@/lib/db';
import { Member, Payment } from '@/lib/calculations';

export async function createGroupAction(formData: FormData) {
  const name = formData.get('name') as string;
  const memberNames = formData.getAll('members') as string[];
  
  if (!name || memberNames.length === 0) {
    throw new Error('グループ名と初期メンバーは必須です');
  }

  const initialMembers: Member[] = memberNames
    .filter((n) => n.trim() !== '')
    .map((name) => ({
      id: crypto.randomUUID(),
      name: name.trim(),
      weight: 1.0,
    }));

  const group = await createGroup(name, initialMembers);
  redirect(`/group/${group.id}`);
}

export async function addMemberAction(groupId: string, member: Member) {
  await updateGroup(groupId, (group) => ({
    ...group,
    members: [...group.members, member],
  }));
  revalidatePath(`/group/${groupId}`);
}

export async function updateMemberAction(groupId: string, member: Member) {
  await updateGroup(groupId, (group) => ({
    ...group,
    members: group.members.map((m) => (m.id === member.id ? member : m)),
  }));
  revalidatePath(`/group/${groupId}`);
}

export async function removeMemberAction(groupId: string, memberId: string) {
  await updateGroup(groupId, (group) => ({
    ...group,
    members: group.members.filter((m) => m.id !== memberId),
    payments: group.payments.filter((p) => p.payerId !== memberId),
  }));
  revalidatePath(`/group/${groupId}`);
}

export async function addPaymentAction(groupId: string, payment: Payment) {
  await updateGroup(groupId, (group) => ({
    ...group,
    payments: [...group.payments, payment],
  }));
  revalidatePath(`/group/${groupId}`);
}

export async function removePaymentAction(groupId: string, paymentId: string) {
  await updateGroup(groupId, (group) => ({
    ...group,
    payments: group.payments.filter((p) => p.id !== paymentId),
  }));
  revalidatePath(`/group/${groupId}`);
}

export async function setRoundUpAction(groupId: string, roundUp: boolean) {
  await updateGroup(groupId, (group) => ({
    ...group,
    roundUp,
  }));
  revalidatePath(`/group/${groupId}`);
}
