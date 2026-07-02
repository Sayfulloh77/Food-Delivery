// Single source of truth for order status labels, colors and pipeline order.
// Used by customer, admin and courier order views.

export const ORDER_STEPS = ['CREATED', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED']

export const ORDER_STATUS_STYLE = {
  CREATED: 'background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3)',
  CONFIRMED: 'background:rgba(249,115,22,0.15);color:#fb923c;border:1px solid rgba(249,115,22,0.3)',
  PREPARING: 'background:rgba(234,179,8,0.15);color:#facc15;border:1px solid rgba(234,179,8,0.3)',
  READY: 'background:rgba(168,85,247,0.15);color:#c084fc;border:1px solid rgba(168,85,247,0.3)',
  DELIVERING: 'background:rgba(249,115,22,0.2);color:#f97316;border:1px solid rgba(249,115,22,0.4)',
  DELIVERED: 'background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3)',
  CANCELLED: 'background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2)',
}

export const ORDER_STATUS_LABEL = {
  CREATED: 'Order placed',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready for pickup',
  DELIVERING: 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export function orderStatusStyle(status) {
  return ORDER_STATUS_STYLE[status] ?? 'background:#1a2d4d;color:#94a3b8'
}
