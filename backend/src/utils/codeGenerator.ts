import prisma from '../config/database.js';

export async function generateAlertCode(): Promise<string> {
  const latest = await prisma.alert.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { alertCode: true },
  });
  if (!latest || !latest.alertCode) return 'ALT-0001';
  const currentNumber = parseInt(latest.alertCode.split('-').pop() || '0');
  return `ALT-${String(currentNumber + 1).padStart(4, '0')}`;
}

export async function generateTicketCode(): Promise<string> {
  const latest = await prisma.faultTicket.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { ticketCode: true },
  });
  if (!latest || !latest.ticketCode) return 'FLT-0001';
  const currentNumber = parseInt(latest.ticketCode.split('-').pop() || '0');
  return `FLT-${String(currentNumber + 1).padStart(4, '0')}`;
}

