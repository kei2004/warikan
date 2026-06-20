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
  createdAt: Date;
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
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalWeight = members.reduce((sum, m) => sum + m.weight, 0);

  // If no weights or no payments, everyone's balance is 0
  if (totalWeight === 0 || totalAmount === 0 || members.length === 0) {
    return members.map((m) => ({ memberId: m.id, paid: 0, target: 0, balance: 0 }));
  }

  // Calculate how much each person paid
  const paidAmounts = new Map<string, number>();
  members.forEach((m) => paidAmounts.set(m.id, 0));
  payments.forEach((p) => {
    if (paidAmounts.has(p.payerId)) {
      paidAmounts.set(p.payerId, paidAmounts.get(p.payerId)! + p.amount);
    }
  });

  return members.map((m) => {
    const paid = paidAmounts.get(m.id) || 0;
    const target = (m.weight / totalWeight) * totalAmount;
    const balance = paid - target;
    return {
      memberId: m.id,
      paid,
      target,
      balance,
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
