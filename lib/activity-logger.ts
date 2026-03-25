import { NextRequest } from 'next/server'
import { getSession } from './auth'
import { recordActivityLog, type AuditAction } from './audit-log'

type TrackAction = 'CREATE' | 'UPDATE' | 'EDIT' | 'DELETE'

function mapAction(action: TrackAction): AuditAction {
  if (action === 'UPDATE') return 'EDIT'
  return action === 'EDIT' ? 'EDIT' : action
}

/**
 * Global helper: single-line activity logging for CRUD.
 * Handles session lookup (admin/superadmin only), IP resolution (incl. ::1), geo lookup, and JSON storage.
 */
export async function trackActivity(
  request: NextRequest,
  action: TrackAction,
  targetTable: string,
  oldData: unknown,
  newData: unknown,
) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) return

    await recordActivityLog({
      request,
      adminEmail: session.email,
      action: mapAction(action),
      targetTable,
      oldData,
      newData,
    })
  } catch (err) {
    console.error('trackActivity failed', err)
  }
}

export type { TrackAction }