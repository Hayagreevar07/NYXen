/**
 * Measurement Model
 * 
 * Represents a single measurement entry in a construction MBook.
 * Follows CPWD (Central Public Works Department) measurement recording standards.
 * 
 * The measurement formula follows the standard:
 *   Quantity = Number × Length × Breadth × Depth/Height
 *   Amount = Quantity × Rate
 * 
 * For items measured in Sqm, depth is typically the thickness.
 * For items measured in Rmt (running metres), only length is used.
 * For items measured in Nos (numbers), number field is the count.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ENV from '../config/env';

// ─── Interface ────────────────────────────────────────────────────

export interface Measurement {
  /** Unique measurement identifier */
  id: string;
  /** Associated project ID */
  projectId: string;
  /** CPWD DSR (Delhi Schedule of Rates) item code */
  itemCode: string;
  /** Detailed description of the work item */
  description: string;
  /** Work category classification */
  category:
    | 'earthwork'
    | 'concrete'
    | 'masonry'
    | 'steel'
    | 'plastering'
    | 'painting'
    | 'woodwork'
    | 'flooring'
    | 'roofing'
    | 'plumbing'
    | 'electrical';
  /** Location within the project site where measurement was taken */
  location: string;
  /** Number of similar items (multiplier) */
  number: number;
  /** Length in metres */
  length: number;
  /** Breadth/width in metres */
  breadth: number;
  /** Depth/height in metres */
  depth: number;
  /** Calculated quantity (Number × L × B × D, or directly specified) */
  quantity: number;
  /** Unit of measurement */
  unit: 'Cum' | 'Sqm' | 'Rmt' | 'Kg' | 'Nos' | 'LS';
  /** Rate per unit in INR (from DSR or negotiated) */
  rate: number;
  /** Total amount = Quantity × Rate, in INR */
  amount: number;
  /** AI confidence score (0-100) for estimated measurements */
  confidenceScore: number;
  /** Source/method of measurement */
  source: 'ai-estimated' | 'manual' | 'verified';
  /** Associated image file paths */
  images: string[];
  /** GPS data from where the measurement was recorded */
  gpsData: {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: string;
  } | null;
  /** User who recorded the measurement */
  recordedBy: string;
  /** User who verified (null if unverified) */
  verifiedBy: string | null;
  /** Creation timestamp */
  createdAt: string;
}

// ─── JSON File Store ──────────────────────────────────────────────

const DATA_FILE = path.join(process.cwd(), ENV.DATA_STORE_DIR, 'measurements.json');

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readAll(): Measurement[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as Measurement[];
  } catch {
    return [];
  }
}

function writeAll(measurements: Measurement[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(measurements, null, 2), 'utf-8');
}

// ─── CRUD Class ───────────────────────────────────────────────────

export class MeasurementStore {
  static getAll(): Measurement[] {
    return readAll();
  }

  static getById(id: string): Measurement | null {
    return readAll().find((m) => m.id === id) || null;
  }

  /**
   * Get all measurements for a specific project.
   */
  static getByProjectId(projectId: string): Measurement[] {
    return readAll().filter((m) => m.projectId === projectId);
  }

  /**
   * Get measurements filtered by category.
   */
  static getByCategory(projectId: string, category: Measurement['category']): Measurement[] {
    return readAll().filter((m) => m.projectId === projectId && m.category === category);
  }

  /**
   * Create a new measurement entry.
   * Automatically calculates quantity and amount if not provided.
   */
  static create(data: Omit<Measurement, 'id' | 'createdAt'>): Measurement {
    const measurements = readAll();

    // Auto-calculate quantity if zero (using CPWD formula: N × L × B × D)
    let quantity = data.quantity;
    if (quantity === 0 && data.number > 0) {
      if (data.unit === 'Cum') {
        quantity = data.number * data.length * data.breadth * data.depth;
      } else if (data.unit === 'Sqm') {
        quantity = data.number * data.length * data.breadth;
      } else if (data.unit === 'Rmt') {
        quantity = data.number * data.length;
      } else if (data.unit === 'Nos') {
        quantity = data.number;
      } else if (data.unit === 'Kg') {
        quantity = data.number * data.length; // weight calculation varies
      }
    }

    const amount = data.amount || quantity * data.rate;

    const measurement: Measurement = {
      ...data,
      id: uuidv4(),
      quantity,
      amount,
      createdAt: new Date().toISOString(),
    };

    measurements.push(measurement);
    writeAll(measurements);
    return measurement;
  }

  static update(id: string, data: Partial<Omit<Measurement, 'id' | 'createdAt'>>): Measurement | null {
    const measurements = readAll();
    const index = measurements.findIndex((m) => m.id === id);
    if (index === -1) return null;

    measurements[index] = { ...measurements[index], ...data };

    // Recalculate amount if rate or quantity changed
    if (data.rate !== undefined || data.quantity !== undefined) {
      const m = measurements[index];
      measurements[index].amount = m.quantity * m.rate;
    }

    writeAll(measurements);
    return measurements[index];
  }

  static delete(id: string): boolean {
    const measurements = readAll();
    const index = measurements.findIndex((m) => m.id === id);
    if (index === -1) return false;
    measurements.splice(index, 1);
    writeAll(measurements);
    return true;
  }

  /**
   * Verify a measurement — update source to 'verified' and set verifiedBy.
   */
  static verify(id: string, verifiedBy: string): Measurement | null {
    return this.update(id, { source: 'verified', verifiedBy });
  }

  /**
   * Get summary statistics for a project.
   */
  static getProjectSummary(projectId: string): {
    totalMeasurements: number;
    totalAmount: number;
    verifiedCount: number;
    aiEstimatedCount: number;
    averageConfidence: number;
    categorySummary: Record<string, { count: number; amount: number }>;
  } {
    const measurements = this.getByProjectId(projectId);
    const categorySummary: Record<string, { count: number; amount: number }> = {};

    let totalAmount = 0;
    let totalConfidence = 0;
    let verifiedCount = 0;
    let aiEstimatedCount = 0;

    for (const m of measurements) {
      totalAmount += m.amount;
      totalConfidence += m.confidenceScore;
      if (m.source === 'verified') verifiedCount++;
      if (m.source === 'ai-estimated') aiEstimatedCount++;

      if (!categorySummary[m.category]) {
        categorySummary[m.category] = { count: 0, amount: 0 };
      }
      categorySummary[m.category].count++;
      categorySummary[m.category].amount += m.amount;
    }

    return {
      totalMeasurements: measurements.length,
      totalAmount,
      verifiedCount,
      aiEstimatedCount,
      averageConfidence: measurements.length > 0 ? totalConfidence / measurements.length : 0,
      categorySummary,
    };
  }

  /**
   * Initialize store with sample measurements if empty.
   */
  static initWithSamples(samples: Measurement[]): void {
    const existing = readAll();
    if (existing.length === 0) {
      writeAll(samples);
    }
  }
}

export default MeasurementStore;
