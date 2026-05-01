// server/src/controllers/syncLog.controller.js
import { getSyncLogs, addSyncLog } from '../repositories/syncLog.repository.js'

export async function getLogs(req, res, next) {
  try {
    const logs = await getSyncLogs(req.query)

    res.json({
      success: true,
      count: logs.length,
      logs,
    })
  } catch (error) {
    next(error)
  }
}

export async function createLog(req, res, next) {
  try {
    const log = await addSyncLog(req.body)

    res.status(201).json({
      success: true,
      log,
    })
  } catch (error) {
    next(error)
  }
}