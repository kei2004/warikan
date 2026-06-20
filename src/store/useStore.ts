import { create } from 'zustand';
import { Member, Payment } from '../lib/calculations';
import {
  addMemberAction,
  updateMemberAction,
  removeMemberAction,
  addPaymentAction,
  removePaymentAction,
  setRoundUpAction
} from '@/app/actions';

interface AppState {
  groupId: string | null;
  members: Member[];
  payments: Payment[];
  roundUp: boolean;
  
  initGroup: (groupId: string, members: Member[], payments: Payment[], roundUp: boolean) => void;
  
  addMember: (member: Member) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  addPayment: (payment: Payment) => Promise<void>;
  removePayment: (id: string) => Promise<void>;
  setRoundUp: (val: boolean) => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  groupId: null,
  members: [],
  payments: [],
  roundUp: false,

  initGroup: (groupId, members, payments, roundUp) => {
    set({ groupId, members, payments, roundUp });
  },

  addMember: async (member) => {
    const { groupId } = get();
    if (!groupId) return;
    // Optimistic update
    set((state) => ({ members: [...state.members, member] }));
    await addMemberAction(groupId, member);
  },
  
  updateMember: async (member) => {
    const { groupId } = get();
    if (!groupId) return;
    set((state) => ({
      members: state.members.map((m) => (m.id === member.id ? member : m)),
    }));
    await updateMemberAction(groupId, member);
  },

  removeMember: async (id) => {
    const { groupId } = get();
    if (!groupId) return;
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
      payments: state.payments.filter((p) => p.payerId !== id),
    }));
    await removeMemberAction(groupId, id);
  },

  addPayment: async (payment) => {
    const { groupId } = get();
    if (!groupId) return;
    set((state) => ({ payments: [...state.payments, payment] }));
    await addPaymentAction(groupId, payment);
  },

  removePayment: async (id) => {
    const { groupId } = get();
    if (!groupId) return;
    set((state) => ({ payments: state.payments.filter((p) => p.id !== id) }));
    await removePaymentAction(groupId, id);
  },

  setRoundUp: async (val) => {
    const { groupId } = get();
    if (!groupId) return;
    set({ roundUp: val });
    await setRoundUpAction(groupId, val);
  },
}));
