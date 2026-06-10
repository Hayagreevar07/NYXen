import { useState, useEffect } from 'react';
import { Camera, Cpu, Check, AlertTriangle, Layers } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ImageUploader from '../components/ImageUploader';
import ConfidenceGauge from '../components/ConfidenceGauge';
import MeasurementTable from '../components/MeasurementTable';
import { api } from '../services/api';
import type { Measurement } from '../store/appStore';

interface AnalysisResult {
  imageId: string;
  originalName: string;
  analysis: {
    imageWidth: number;
    imageHeight: number;
    elements: Array<{
      type: string;
      confidence: number;
      material: string;
      estimatedDimensions: { length: number; width: number; height: number };
    }>;
    sceneType: string;
    constructionStage: string;
    imageQuality: string;
    gpsData: {
      latitude: number | null;
      longitude: number | null;
      altitude: number | null;
      camera: string | null;
      timestamp: string | null;
    };
  };
  measurements: Array<{
    itemCode: string;
    description: string;
    category: string;
    length: number;
    breadth: number;
    depth: number;
    quantity: number;
    unit: string;
    confidenceScore: number;
  }>;
}

type Stage = 'upload' | 'uploading' | 'analyzing' | 'complete';

export default function AnalysisPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<Stage>('upload');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    api.getProjects().then((data) => {
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0].id);
      }
    }).catch(console.error);
  }, []);

  const stages = [
    { id: 'upload', label: 'Upload', icon: Camera },
    { id: 'uploading', label: 'Processing', icon: Cpu },
    { id: 'analyzing', label: 'Analyzing', icon: Layers },
    { id: 'complete', label: 'Complete', icon: Check },
  ];

  const stageOrder = ['upload', 'uploading', 'analyzing', 'complete'];

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setError('');

    try {
      // Stage 1: Upload
      setStage('uploading');
      const uploadResult = await api.uploadImages(files);

      // Stage 2: Analyze
      setStage('analyzing');
      const imageIds = uploadResult.uploaded.map((u: any) => u.id);
      const analysisResult = await api.analyzeImages(imageIds, selectedProject);

      setResults(analysisResult.results || []);
      setStage('complete');
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
      setStage('upload');
    }
  };

  // Convert analysis measurements to table format
  const tableMeasurements: Measurement[] = results.flatMap((r, ri) =>
    r.measurements.map((m, mi) => ({
      id: `${ri}-${mi}`,
      sno: ri * 10 + mi + 1,
      description: m.description,
      category: m.category.charAt(0).toUpperCase() + m.category.slice(1),
      number: 1,
      length: m.length,
      breadth: m.breadth,
      depthOrHeight: m.depth,
      quantity: m.quantity,
      unit: m.unit,
      confidence: m.confidenceScore,
    }))
  );

  const avgConfidence = results.length > 0
    ? Math.round(
        results.flatMap((r) => r.measurements).reduce((s, m) => s + m.confidenceScore, 0) /
        Math.max(1, results.flatMap((r) => r.measurements).length)
      )
    : 0;

  return (
    <div className="flex-col">
      {/* Analysis Pipeline */}
      <div className="analysis-stages">
        {stages.map((s, i) => {
          const Icon = s.icon;
          const currentIdx = stageOrder.indexOf(stage);
          const stageIdx = stageOrder.indexOf(s.id);
          const isComplete = stageIdx < currentIdx;
          const isActive = stageIdx === currentIdx;

          return (
            <div key={s.id} className={`analysis-stage ${isComplete ? 'analysis-stage--complete' : ''} ${isActive ? 'analysis-stage--active' : ''}`}>
              <div className="analysis-stage__dot">
                {isComplete ? <Check size={14} /> : <Icon size={14} />}
              </div>
              <span className="analysis-stage__label">{s.label}</span>
              {i < stages.length - 1 && <div className="analysis-stage__connector" />}
            </div>
          );
        })}
      </div>

      {error && (
        <div style={{
          padding: 'var(--space-md)', background: 'var(--color-accent-red-dim)',
          border: '1px solid rgba(255,82,82,0.3)', borderRadius: 'var(--radius-md)',
          color: 'var(--color-accent-red)', fontSize: 'var(--font-size-sm)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
        }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Upload Section */}
      {stage === 'upload' && (
        <GlassCard title="Upload Site Photos" subtitle="Drag & drop construction site images" icon={Camera} iconColor="blue">
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              Select Project to Map Measurements
            </label>
            <select 
              className="select" 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <ImageUploader onFilesSelected={setFiles} maxFiles={10} />
          {files.length > 0 && (
            <div style={{ marginTop: 'var(--space-xl)', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={!selectedProject}>
                <Cpu size={18} /> Analyze {files.length} Image{files.length > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </GlassCard>
      )}

      {/* Processing */}
      {(stage === 'uploading' || stage === 'analyzing') && (
        <GlassCard title={stage === 'uploading' ? 'Uploading Images...' : 'AI Analysis in Progress...'} icon={Cpu} iconColor="purple">
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
            <div className="spinner" style={{ width: 48, height: 48, margin: '0 auto var(--space-lg)' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {stage === 'uploading'
                ? 'Processing and extracting EXIF/GPS data...'
                : 'Detecting construction elements and estimating dimensions...'}
            </p>
          </div>
        </GlassCard>
      )}

      {/* Results */}
      {stage === 'complete' && results.length > 0 && (
        <>
          {/* Summary */}
          <div className="grid-3">
            <GlassCard>
              <div style={{ textAlign: 'center' }}>
                <ConfidenceGauge score={avgConfidence} size={120} label="Overall Confidence" />
              </div>
            </GlassCard>

            <GlassCard title="Detection Summary" icon={Layers} iconColor="purple">
              <div className="flex-col" style={{ gap: 'var(--space-md)' }}>
                {results.map((r, i) => (
                  <div key={i}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                      {r.originalName}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                      {r.analysis.sceneType} · {r.analysis.elements.length} elements · {r.analysis.imageQuality} quality
                    </div>
                    {r.analysis.gpsData.latitude && (
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-emerald)', marginTop: '2px' }}>
                        📍 {r.analysis.gpsData.latitude.toFixed(4)}°N, {r.analysis.gpsData.longitude?.toFixed(4)}°E
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard title="Detected Elements" icon={Camera} iconColor="blue">
              <div className="flex-col" style={{ gap: 'var(--space-sm)' }}>
                {results.flatMap((r) => r.analysis.elements).slice(0, 8).map((el, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', textTransform: 'capitalize' }}>{el.type}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{el.material}</span>
                      <span style={{
                        fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)',
                        color: el.confidence >= 85 ? 'var(--color-accent-emerald)' : el.confidence >= 60 ? 'var(--color-accent-amber)' : 'var(--color-accent-red)',
                      }}>
                        {el.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Measurements Table */}
          <GlassCard title="Generated Measurements" subtitle="CPWD-format measurement entries from AI analysis" icon={Camera} iconColor="blue">
            {tableMeasurements.length > 0 ? (
              <MeasurementTable measurements={tableMeasurements} />
            ) : (
              <div className="empty-state">
                <p className="empty-state__text">No measurements generated</p>
              </div>
            )}
          </GlassCard>

          {/* New Analysis */}
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-secondary" onClick={() => { setStage('upload'); setResults([]); setFiles([]); }}>
              Analyze More Images
            </button>
          </div>
        </>
      )}
    </div>
  );
}
