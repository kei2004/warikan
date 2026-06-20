export type Member = {
  id: string;
  name: string;
  weight: number;
};

export type Payment = {
  id: string;
  payerId: string;
  purpose: string;
  amount: number;
  receiptImageUrl?: string;
  forWhom?: string[]; // IDs of members. If undefined or empty, it means everyone.
};

export type SettledRoute = {
  from: string;
  to: string;
  amount: number;
};

export type Balance = {
  memberId: string;
  paid: number;
  target: number;
  balance: number; // positive means they should receive money, negative means they should pay
};

export type Transaction = {
  from: string; // memberId
  to: string; // memberId
  amount: number;
};

export type Adjustment = {
  memberId: string;
  diff: number;
};

export function calculateBalances(members: Member[], payments: Payment[]): Balance[] {
  // If no weights or no active payments, everyone's balance is 0
  if (members.length === 0) {
    return [];
  }

  // Calculate how much each person paid and how much their target share is
  const balancesMap = new Map<string, { paid: number; target: number }>();
  members.forEach((m) => balancesMap.set(m.id, { paid: 0, target: 0 }));

  payments.forEach((p) => {
    // 支払者がまだメンバーにいる場合のみ支払い額を加算
    if (balancesMap.has(p.payerId)) {
      balancesMap.get(p.payerId)!.paid += p.amount;
    }

    // 誰のための支払いか（指定がなければ全員、いればそのメンバーだけ）
    let splitMembers = members;
    if (p.forWhom && p.forWhom.length > 0) {
      splitMembers = members.filter(m => p.forWhom!.includes(m.id));
      // もし対象者が全員削除されていたら、全体で分割するフォールバック
      if (splitMembers.length === 0) {
        splitMembers = members;
      }
    }

    const totalWeight = splitMembers.reduce((sum, m) => sum + m.weight, 0);
    
    if (totalWeight > 0) {
      splitMembers.forEach(m => {
        const share = (m.weight / totalWeight) * p.amount;
        balancesMap.get(m.id)!.target += share;
      });
    }
  });

  return members.map((m) => {
    const b = balancesMap.get(m.id)!;
    return {
      memberId: m.id,
      paid: b.paid,
      target: b.target,
      balance: b.paid - b.target,
    };
  });
}

export function calculateMinimumTransactions(balances: Balance[], roundUp: boolean = false): Transaction[] {
  // Separate into debtors (need to pay, balance < 0) and creditors (need to receive, balance > 0)
  const debtors = balances.filter((b) => b.balance < -0.01).map((b) => ({ ...b }));
  const creditors = balances.filter((b) => b.balance > 0.01).map((b) => ({ ...b }));

  // Sort by absolute balance descending (greedy approach)
  debtors.sort((a, b) => a.balance - b.balance); // Most negative first
  creditors.sort((a, b) => b.balance - a.balance); // Most positive first

  const transactions: Transaction[] = [];

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const amount = Math.min(-debtor.balance, creditor.balance);
    
    // Round if required
    let finalAmount = amount;
    if (roundUp) {
      finalAmount = Math.ceil(amount / 100) * 100;
    } else {
      finalAmount = Math.round(amount);
    }

    if (finalAmount > 0) {
      transactions.push({
        from: debtor.memberId,
        to: creditor.memberId,
        amount: finalAmount,
      });
    }

    // Since we rounded the transaction, the remaining balance is updated using the unrounded "amount"
    // so we can proceed with the loop correctly. Wait, if we use unrounded amount to update balances,
    // the greedy matching still works as if it wasn't rounded, which is exactly what we want to find the next pairs.
    debtor.balance += amount;
    creditor.balance -= amount;

    // Move to next if settled
    if (Math.abs(debtor.balance) < 0.01) {
      d++;
    }
    if (Math.abs(creditor.balance) < 0.01) {
      c++;
    }
  }

  return transactions;
}

export function calculateAdjustments(balances: Balance[], transactions: Transaction[]): Adjustment[] {
  const actualNet = new Map<string, number>();
  balances.forEach((b) => actualNet.set(b.memberId, 0));

  transactions.forEach((t) => {
    actualNet.set(t.from, actualNet.get(t.from)! - t.amount);
    actualNet.set(t.to, actualNet.get(t.to)! + t.amount);
  });

  return balances.map((b) => {
    const net = actualNet.get(b.memberId)!;
    const diff = net - b.balance;
    return {
      memberId: b.memberId,
      diff,
    };
  });
}
