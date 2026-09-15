export interface EditLog {
  id: string;
  orderId: string;
  orderNumber: string;
  field: string;
  oldValue: string;
  newValue: string;
  editedBy: string;
  editorRole: string;
  timestamp: string;
}

export const editLogs: EditLog[] = [
  {
    id: 'log-1',
    orderId: 'ord-1',
    orderNumber: 'FLR-2026-1847',
    field: 'Status',
    oldValue: 'Confirmed',
    newValue: 'Shipped',
    editedBy: 'أحمد الإداري',
    editorRole: 'Admin',
    timestamp: '2026-08-22T09:15:00Z',
  },
  {
    id: 'log-2',
    orderId: 'ord-1',
    orderNumber: 'FLR-2026-1847',
    field: 'Shipment Code',
    oldValue: '—',
    newValue: 'SMSA-882910-FLR',
    editedBy: 'أحمد الإداري',
    editorRole: 'Admin',
    timestamp: '2026-08-22T09:15:00Z',
  },
];
