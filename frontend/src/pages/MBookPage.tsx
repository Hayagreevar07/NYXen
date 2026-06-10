import { useEffect, useState } from 'react';
import { BookOpen, Download, FileText, ChevronDown } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import MeasurementTable from '../components/MeasurementTable';
import { api } from '../services/api';
import type { Measurement } from '../store/appStore';

interface ProjectOption {
  id: string;
  name: string;
}

interface MBookData {
  project: {
    id: string; name: string; contractor: string; engineer: string;
    location: { lat: number; lng: number; address: string }; surveyNumber: string;
    contractorDetails?: { licenseNumber: string; contactPerson: string; phone: string; };
    agreement?: { agreementNumber: string; dateOfAgreement: string; approvedMaterials: string[]; blueprintDimensions: Record<string, number> };
  };
  measurements: Array<{
    id: string; itemCode: string; description: string; category: string;
    location: string; number: number; length: number; breadth: number;
    depth: number; quantity: number; unit: string; rate: number; amount: number;
    confidenceScore: number; source: string;
    aiDimensions?: { quantity: number; }; manualDimensions?: { quantity: number; };
    materialsCheck?: { materialUsed: string; engineerVerified: boolean; constructorVerified: boolean; };
    violationWarning?: string | null;
  }>;
  summary: {
    totalMeasurements: number; totalAmount: number; verifiedCount: number;
    aiEstimatedCount: number; averageConfidence: number;
    categorySummary: Record<string, { count: number; amount: number }>;
  };
}

export default function MBookPage() {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [mbookData, setMbookData] = useState<MBookData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getProjects().then((data) => {
      setProjects(data.map((p: any) => ({ id: p.id, name: p.name })));
      if (data.length > 0) {
        setSelectedProject(data[0].id);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    api.getMBook(selectedProject)
      .then(setMbookData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedProject]);

  const handleExport = async (format: 'json' | 'csv') => {
    if (!selectedProject) return;
    try {
      const data = await api.exportMBook(selectedProject, format);
      const blob = new Blob(
        [format === 'csv' ? data : JSON.stringify(data, null, 2)],
        { type: format === 'csv' ? 'text/csv' : 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MBook_${mbookData?.project.name || 'export'}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const formatCurrency = (v: number) => '₹' + v.toLocaleString('en-IN');

  // Convert to MeasurementTable format
  const tableMeasurements: Measurement[] = (mbookData?.measurements || []).map((m, i) => ({
    id: m.id,
    sno: i + 1,
    description: m.description,
    category: m.category.charAt(0).toUpperCase() + m.category.slice(1),
    number: m.number,
    length: m.length,
    breadth: m.breadth,
    depthOrHeight: m.depth,
    quantity: m.quantity,
    aiQuantity: m.aiDimensions?.quantity,
    manualQuantity: m.manualDimensions?.quantity,
    unit: m.unit,
    confidence: m.confidenceScore,
    rate: m.rate,
    amount: m.amount,
    materialsCheck: m.materialsCheck,
    violationWarning: m.violationWarning,
  }));

  return (
    <div className="flex-col">
      {/* Project Selector */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="input-group" style={{ minWidth: '300px' }}>
            <select className="select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="export-group">
          <button className="btn btn-secondary btn-sm" onClick={() => handleExport('json')}>
            <Download size={14} /> JSON
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleExport('csv')}>
            <FileText size={14} /> CSV
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3xl)' }}>
          <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      )}

      {mbookData && !loading && (
        <>
          {/* MBook Header */}
          <div className="mbook-view">
            <div className="mbook-header">
              <div className="mbook-header__title">
                MEASUREMENT BOOK
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                (As per CPWD Works Manual 2019 — Form 23)
              </div>
              
              <div className="mbook-header__meta" style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                <div className="mbook-header__meta-item">
                  <span className="mbook-header__meta-label">Project:</span>
                  <span>{mbookData.project.name}</span>
                </div>
                <div className="mbook-header__meta-item">
                  <span className="mbook-header__meta-label">Survey No:</span>
                  <span>{mbookData.project.surveyNumber}</span>
                </div>
                
                {mbookData.project.agreement && (
                  <>
                    <div className="mbook-header__meta-item">
                      <span className="mbook-header__meta-label">Agreement No:</span>
                      <span style={{ color: 'var(--color-accent-amber)' }}>{mbookData.project.agreement.agreementNumber}</span>
                    </div>
                    <div className="mbook-header__meta-item">
                      <span className="mbook-header__meta-label">Agreement Date:</span>
                      <span>{new Date(mbookData.project.agreement.dateOfAgreement).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
                
                <div className="mbook-header__meta-item">
                  <span className="mbook-header__meta-label">Engineer:</span>
                  <span>{mbookData.project.engineer}</span>
                </div>
              </div>

              <div className="mbook-header__meta" style={{ marginTop: '16px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div className="mbook-header__meta-item" style={{ width: '100%' }}>
                  <span className="mbook-header__meta-label">Contractor:</span>
                  <span style={{ fontWeight: 600 }}>{mbookData.project.contractor}</span>
                </div>
                {mbookData.project.contractorDetails && (
                  <>
                    <div className="mbook-header__meta-item">
                      <span className="mbook-header__meta-label">License:</span>
                      <span>{mbookData.project.contractorDetails.licenseNumber}</span>
                    </div>
                    <div className="mbook-header__meta-item">
                      <span className="mbook-header__meta-label">Contact:</span>
                      <span>{mbookData.project.contractorDetails.contactPerson}</span>
                    </div>
                    <div className="mbook-header__meta-item">
                      <span className="mbook-header__meta-label">Phone:</span>
                      <span>{mbookData.project.contractorDetails.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Measurement Table */}
            <MeasurementTable measurements={tableMeasurements} editable={false} />
          </div>

          {/* Summary */}
          <div className="grid-3">
            <GlassCard title="Summary" icon={BookOpen} iconColor="amber">
              <div className="flex-col" style={{ gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Entries</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mbookData.summary.totalMeasurements}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Amount</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-accent-emerald)' }}>
                    {formatCurrency(mbookData.summary.totalAmount)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Verified</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mbookData.summary.verifiedCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>AI Estimated</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mbookData.summary.aiEstimatedCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Avg Confidence</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{Math.round(mbookData.summary.averageConfidence)}%</span>
                </div>
              </div>
            </GlassCard>

            {/* Category Breakdown */}
            <GlassCard title="Category Breakdown" icon={ChevronDown} iconColor="purple" style={{ gridColumn: 'span 2' }}>
              <div className="summary-grid">
                {Object.entries(mbookData.summary.categorySummary).map(([cat, info]) => (
                  <div key={cat} className="summary-item">
                    <div className="summary-item__label">{cat}</div>
                    <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {info.count}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-emerald)', marginTop: '2px' }}>
                      {formatCurrency(info.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
