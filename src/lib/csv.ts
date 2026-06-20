import Papa from 'papaparse';
import { Member, Payment, Transaction } from './calculations';

export function exportPaymentsToCSV(payments: Payment[], members: Member[]) {
  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  const data = payments.map((p) => ({
    '日付': new Date(p.createdAt).toLocaleDateString(),
    '支払者': memberMap.get(p.payerId) || '不明',
    '目的': p.purpose,
    '金額': p.amount,
  }));

  const csv = Papa.unparse(data);
  downloadCSV(csv, 'payments_history.csv');
}

export function exportSettlementsToCSV(transactions: Transaction[], members: Member[]) {
  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  const data = transactions.map((t) => ({
    '送金元': memberMap.get(t.from) || '不明',
    '送金先': memberMap.get(t.to) || '不明',
    '金額': t.amount,
  }));

  const csv = Papa.unparse(data);
  downloadCSV(csv, 'settlement_list.csv');
}

function downloadCSV(csv: string, filename: string) {
  // Add BOM for Excel compatibility in Japanese
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('url');
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
