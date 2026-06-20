import { create } from 'zustand';
import { Member, Payment, SettledRoute } from '../lib/calculations';
import {
  addMemberAction,
  updateMemberAction,
  removeMemberAction,
  addPaymentAction,
  updatePaymentAction,
  removePaymentAction,
  toggleSettledRouteAction,
  setRoundUpAction
} from '@/app/actions';

interface AppState {
  groupId: string | null;
  members: Member[];
  payments: Payment[];
  roundUp: boolean;
  settledRoutes: SettledRoute[];
  
  initGroup: (groupId: string, members: Member[], payments: Payment[], roundUp: boolean, settledRoutes?: SettledRoute[]) => void;
  
  addMember: (member: Member) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  addPayment: (payment: Payment) => Promise<void>;
  updatePayment: (payment: Payment) => Promise<void>;
  removePayment: (id: string) => Promise<void>;
  toggleSettledRoute: (route: SettledRoute, isSettled: boolean) => Promise<void>;
  setRoundUp: (val: boolean) => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  groupId: null,
  members: [],
  payments: [],
  roundUp: false,
  settledRoutes: [],

  initGroup: (groupId, members, payments, roundUp, settledRoutes = []) => {
    set({ groupId, members, payments, roundUp, settledRoutes });
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

  updatePayment: async (payment) => {
    const { groupId } = get();
    if (!groupId) return;
    set((state) => ({
      payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
    }));
    await updatePaymentAction(groupId, payment);
  },

  removePayment: async (id) => {
    const { groupId } = get();
    if (!groupId) return;
    set((state) => ({ payments: state.payments.filter((p) => p.id !== id) }));
    await removePaymentAction(groupId, id);
  },

  toggleSettledRoute: async (route, isSettled) => {
    const { groupId, settledRoutes } = get();
    if (!groupId) return;
    
    let newRoutes;
    if (isSettled) {
      const exists = settledRoutes.some(r => r.from === route.from && r.to === route.to && r.amount === route.amount);
      newRoutes = exists ? settledRoutes : [...settledRoutes, route];
    } else {
      newRoutes = settledRoutes.filter(r => !(r.from === route.from && r.to === route.to && r.amount === route.amount));
    }
    
    set({ settledRoutes: newRoutes });
    await toggleSettledRouteAction(groupId, route, isSettled);
  },

  setRoundUp: async (val) => {
    const { groupId } = get();
    if (!groupId) return;
    set({ roundUp: val });
    await setRoundUpAction(groupId, val);
  },
}));
