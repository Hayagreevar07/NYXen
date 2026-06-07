/**
 * Project Model
 * 
 * Represents a construction project in the MBook system.
 * Includes JSON-file-based CRUD operations for persistence.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ENV from '../config/env';

// ─── Interface ────────────────────────────────────────────────────

export interface Project {
  /** Unique project identifier */
  id: string;
  /** Project name/title */
  name: string;
  /** Detailed project description */
  description: string;
  /** Associated land survey number */
  surveyNumber: string;
  /** Project location with GPS coordinates */
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  /** Contractor company/individual name */
  contractor: string;
  /** Supervising engineer name and qualifications */
  engineer: string;
  /** Current project status */
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  /** Project start date (ISO format) */
  startDate: string;
  /** Expected completion date (ISO format) */
  expectedCompletion: string;
  /** Total project budget in INR */
  totalBudget: number;
  /** Record creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

// ─── JSON File Store ──────────────────────────────────────────────

const DATA_FILE = path.join(process.cwd(), ENV.DATA_STORE_DIR, 'projects.json');

/**
 * Ensure the data store directory and file exist.
 */
function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Read all projects from the JSON store.
 */
function readAll(): Project[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

/**
 * Write all projects to the JSON store.
 */
function writeAll(projects: Project[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

// ─── CRUD Class ───────────────────────────────────────────────────

export class ProjectStore {
  /**
   * Get all projects.
   */
  static getAll(): Project[] {
    return readAll();
  }

  /**
   * Get a single project by ID.
   */
  static getById(id: string): Project | null {
    const projects = readAll();
    return projects.find((p) => p.id === id) || null;
  }

  /**
   * Create a new project.
   */
  static create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const projects = readAll();
    const now = new Date().toISOString();
    const project: Project = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    projects.push(project);
    writeAll(projects);
    return project;
  }

  /**
   * Update an existing project by ID.
   * Returns the updated project or null if not found.
   */
  static update(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
    const projects = readAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    writeAll(projects);
    return projects[index];
  }

  /**
   * Delete a project by ID.
   * Returns true if deleted, false if not found.
   */
  static delete(id: string): boolean {
    const projects = readAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    projects.splice(index, 1);
    writeAll(projects);
    return true;
  }

  /**
   * Search projects by name or survey number.
   */
  static search(query: string): Project[] {
    const projects = readAll();
    const lowerQuery = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.surveyNumber.toLowerCase().includes(lowerQuery) ||
        p.contractor.toLowerCase().includes(lowerQuery) ||
        p.location.address.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get projects by status.
   */
  static getByStatus(status: Project['status']): Project[] {
    const projects = readAll();
    return projects.filter((p) => p.status === status);
  }

  /**
   * Initialize the store with sample data if empty.
   */
  static initWithSamples(samples: Project[]): void {
    const existing = readAll();
    if (existing.length === 0) {
      writeAll(samples);
    }
  }
}

export default ProjectStore;
