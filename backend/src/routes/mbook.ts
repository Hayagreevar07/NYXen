/**
 * MBook Routes
 * GET  /api/mbook/:projectId             — Get MBook for project
 * PUT  /api/mbook/:projectId/entries/:id — Update entry
 * GET  /api/mbook/:projectId/export      — Export as JSON/CSV
 */

import { Router, Request, Response } from 'express';
import { MeasurementStore } from '../models/Measurement';
import { ProjectStore } from '../models/Project';

const router = Router();

/**
 * GET /api/mbook/:projectId
 */
router.get('/:projectId', (req: Request, res: Response) => {
  try {
    const project = ProjectStore.getById(req.params.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const measurements = MeasurementStore.getByProjectId(req.params.projectId);
    const summary = MeasurementStore.getProjectSummary(req.params.projectId);

    res.json({
      project: {
        id: project.id,
        name: project.name,
        contractor: project.contractor,
        engineer: project.engineer,
        location: project.location,
        surveyNumber: project.surveyNumber,
      },
      measurements,
      summary,
    });
  } catch (error) {
    console.error('Error fetching MBook:', error);
    res.status(500).json({ message: 'Failed to fetch MBook' });
  }
});

/**
 * PUT /api/mbook/:projectId/entries/:entryId
 */
router.put('/:projectId/entries/:entryId', (req: Request, res: Response) => {
  try {
    const updated = MeasurementStore.update(req.params.entryId, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Measurement entry not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

/**
 * GET /api/mbook/:projectId/export
 * Query: ?format=json|csv
 */
router.get('/:projectId/export', (req: Request, res: Response) => {
  try {
    const format = (req.query.format as string) || 'json';
    const measurements = MeasurementStore.getByProjectId(req.params.projectId);
    const project = ProjectStore.getById(req.params.projectId);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (format === 'csv') {
      const headers = [
        'S.No', 'Item Code', 'Description', 'Category', 'Location',
        'Number', 'Length', 'Breadth', 'Depth', 'Quantity', 'Unit',
        'Rate', 'Amount', 'Confidence', 'Source',
      ];

      const rows = measurements.map((m, i) =>
        [
          i + 1, m.itemCode, `"${m.description}"`, m.category, `"${m.location}"`,
          m.number, m.length, m.breadth, m.depth, m.quantity, m.unit,
          m.rate, m.amount, m.confidenceScore, m.source,
        ].join(',')
      );

      const csv = [headers.join(','), ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="MBook_${project.name.replace(/\s+/g, '_')}.csv"`
      );
      res.send(csv);
    } else {
      res.json({
        project: {
          name: project.name,
          surveyNumber: project.surveyNumber,
          contractor: project.contractor,
          engineer: project.engineer,
        },
        measurements,
        exportedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

export default router;
