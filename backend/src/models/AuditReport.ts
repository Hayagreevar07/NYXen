/**
 * Audit Report Model
 * 
 * Represents a comprehensive audit report for a construction project.
 * Audit reports cross-reference GPS data, land registry records,
 * measurement accuracy, and compliance standards to generate findings.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ENV from '../config/env';

// ─── Interfaces ───────────────────────────────────────────────────

export interface AuditFinding {
  /** Severity level of the finding */
  severity: 'critical' | 'warning' | 'info';
  /** Short title of the finding */
  title: string;
  /** Detailed description of the issue */
  description: string;
  /** Recommended corrective action */
  recommendation: string;
}

export interface AuditValidation {
  /** Status label (e.g., 'pass', 'fail', 'partial') */
  status: string;
  /** Numeric score (0-100) */
  score: number;
  /** Detailed explanation */
  details: string;
}

export interface AuditReport {
  /** Unique report identifier */
  id: string;
  /** Associated project ID */
  projectId: string;
  /** Type of audit performed */
  type: 'comprehensive' | 'measurement' | 'location' | 'compliance';
  /** Overall audit score (0-100) */
  overallScore: number;
  /** GPS/location validation results */
  gpsValidation: AuditValidation;
  /** Land registry cross-reference results */
  registryVerification: AuditValidation;
  /** Measurement accuracy assessment */
  measurementAccuracy: AuditValidation;
  /** List of audit findings */
  findings: AuditFinding[];
  /** High-level recommendations */
  recommendations: string[];
  /** Report generation timestamp */
  generatedAt: string;
  /** User who generated the report */
  generatedBy: string;
}

// ─── JSON File Store ──────────────────────────────────────────────

const DATA_FILE = path.join(process.cwd(), ENV.DATA_STORE_DIR, 'audit-reports.json');

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readAll(): AuditReport[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as AuditReport[];
  } catch {
    return [];
  }
}

function writeAll(reports: AuditReport[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf-8');
}

// ─── CRUD Class ───────────────────────────────────────────────────

export class AuditReportStore {
  static getAll(): AuditReport[] {
    return readAll();
  }

  static getById(id: string): AuditReport | null {
    return readAll().find((r) => r.id === id) || null;
  }

  /**
   * Get all audit reports for a specific project.
   */
  static getByProjectId(projectId: string): AuditReport[] {
    return readAll().filter((r) => r.projectId === projectId);
  }

  /**
   * Get the latest audit report for a project.
   */
  static getLatestForProject(projectId: string): AuditReport | null {
    const reports = this.getByProjectId(projectId);
    if (reports.length === 0) return null;
    return reports.sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    )[0];
  }

  /**
   * Save a new audit report.
   */
  static create(data: Omit<AuditReport, 'id' | 'generatedAt'>): AuditReport {
    const reports = readAll();
    const report: AuditReport = {
      ...data,
      id: uuidv4(),
      generatedAt: new Date().toISOString(),
    };
    reports.push(report);
    writeAll(reports);
    return report;
  }

  /**
   * Delete an audit report.
   */
  static delete(id: string): boolean {
    const reports = readAll();
    const index = reports.findIndex((r) => r.id === id);
    if (index === -1) return false;
    reports.splice(index, 1);
    writeAll(reports);
    return true;
  }

  /**
   * Get reports filtered by type.
   */
  static getByType(type: AuditReport['type']): AuditReport[] {
    return readAll().filter((r) => r.type === type);
  }

  /**
   * Get summary statistics across all reports.
   */
  static getOverallStats(): {
    totalReports: number;
    averageScore: number;
    criticalFindings: number;
    warningFindings: number;
  } {
    const reports = readAll();
    let totalScore = 0;
    let criticalFindings = 0;
    let warningFindings = 0;

    for (const r of reports) {
      totalScore += r.overallScore;
      for (const f of r.findings) {
        if (f.severity === 'critical') criticalFindings++;
        if (f.severity === 'warning') warningFindings++;
      }
    }

    return {
      totalReports: reports.length,
      averageScore: reports.length > 0 ? totalScore / reports.length : 0,
      criticalFindings,
      warningFindings,
    };
  }
}

export default AuditReportStore;
