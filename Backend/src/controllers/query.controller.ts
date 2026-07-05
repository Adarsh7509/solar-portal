import { Request, Response, NextFunction } from 'express';
import { QueryModel, QueryStatus } from '../models/Query';
import { AuditLogModel } from '../models/AuditLog';
import { submitLeadSchema, updateLeadStatusSchema } from '../validation/query.validator';
import { sendQueryEmail } from '../utils/mailer';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import logger from '../utils/logger';

// 1. Submit lead query (Public)
export async function submitLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { error, value } = submitLeadSchema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    const {
      name,
      email,
      phone,
      address,
      city,
      monthlyElectricityBill,
      solarCapacityInterested,
      message,
    } = value;

    const newQuery = await QueryModel.create({
      name,
      email,
      phone,
      address,
      city,
      monthlyElectricityBill,
      solarCapacityInterested,
      message,
      status: QueryStatus.PENDING,
    });

    logger.info(`Customer query saved successfully. ID: ${newQuery.id}`);

    // Send email notification asynchronously
    sendQueryEmail({
      name,
      email,
      phone,
      address,
      city,
      monthlyElectricityBill,
      solarCapacityInterested,
      message,
    }).catch((err) => {
      logger.error(`Deferred email send failed for query ID: ${newQuery.id}`, {
        error: err.message,
      });
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your request. Our Solar Experts will contact you shortly.',
      queryId: newQuery.id,
    });
  } catch (error) {
    next(error);
  }
}

// 2. Get all lead queries (Admin)
export async function getAllLeads(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const leads = await QueryModel.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
}

// 3. Get single lead query by ID (Admin)
export async function getLeadById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const lead = await QueryModel.findByPk(id, {
      include: [
        {
          model: AuditLogModel,
          as: 'auditLogs',
        },
      ],
    });

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead query not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

// 4. Update status and add notes (Admin)
export async function updateLeadStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { error, value } = updateLeadStatusSchema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    const { status, adminNotes } = value;
    const lead = await QueryModel.findByPk(id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead query not found' });
      return;
    }

    const previousStatus = lead.status;
    const adminId = req.user?.id || null;

    // Update query fields
    lead.status = status;
    if (adminNotes !== undefined) {
      lead.adminNotes = adminNotes;
    }
    if (adminId) {
      lead.assignedAdminId = adminId;
    }

    await lead.save();

    // Log the change in the AuditLogs table
    if (previousStatus !== status) {
      await AuditLogModel.create({
        queryId: lead.id,
        changedByUserId: adminId,
        previousStatus,
        newStatus: status,
        comments: adminNotes ? `Status updated. Admin Notes: ${adminNotes}` : 'Status updated.',
      });
      logger.info(`Lead status updated. ID: ${lead.id}. ${previousStatus} -> ${status}`);
    } else {
      logger.info(`Lead notes updated. ID: ${lead.id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}
