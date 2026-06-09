import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');
  const eventId = searchParams.get('eventId');
  const memberId = searchParams.get('memberId');

  if (!bookingId || !eventId || !memberId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Create unique ticket data
  const ticketData = JSON.stringify({
    bookingId,
    eventId,
    memberId,
    timestamp: Date.now(),
    hash: Buffer.from(`${bookingId}-${eventId}-${memberId}`).toString('base64')
  });

  try {
    const qrCode = await QRCode.toDataURL(ticketData);
    return NextResponse.json({ qrCode, ticketData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}
