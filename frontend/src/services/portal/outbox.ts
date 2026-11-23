/** Demo outbox: stands in for the SMS / email ESSI would send. */
import { nowStamp } from '@/utils/format';
import { readJson, STORAGE_KEYS, writeJson } from './storage';
import type { Account, OutboxMessage } from './types';

export function sendMessage(acc: Account, subject: string, body: string): void {
  const list = readJson<OutboxMessage[]>(STORAGE_KEYS.outbox, []);
  list.unshift({ t: nowStamp(), mobile: acc.mobile, email: acc.email, subject, body });
  writeJson(STORAGE_KEYS.outbox, list);
}

export function getMessages(): OutboxMessage[] {
  return readJson<OutboxMessage[]>(STORAGE_KEYS.outbox, []);
}
