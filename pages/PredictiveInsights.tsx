import { useEffect, useState } from "react";
import vehicleService from "../services/vehicle.service";
import type { RCAData } from "../types";

export default function PredictiveInsightsPage() {
  const [rca, setRCA] = useState<RCAData | null>(null);

  useEffect(() => {
    const fetchRCA = async () => {
      const data = await vehicleService.getVehicleRCA("EV-001");
      setRCA(data);
    };
    fetchRCA();
    const interval = setInterval(fetchRCA, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (!rca) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Predictive Insights</h1>
        <p className="text-slate-400">Loading RCA data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold mb-4">Predictive Insights</h1>

      {/* Executive Summary */}
      <div className="rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h2 className="text-sm font-semibold text-cyan-400">Executive Summary</h2>
        <p className="text-xs text-slate-300 mt-1">{rca.executiveSummary}</p>
      </div>

      {/* Root Cause */}
      <div className="space-y-1">
        <p className="text-xs text-slate-400">
          <strong>Root Cause:</strong> {rca.rootCause}
        </p>
        <p className="text-xs text-slate-400">
          <strong>Failure Type:</strong> {rca.failureType} | <strong>Severity:</strong> {rca.severity} | <strong>Confidence:</strong> {rca.confidence}
        </p>
        <p className="text-xs text-slate-400">
          <strong>At‑Risk Component:</strong> {rca.atRiskComponent}
        </p>
      </div>

      {/* Incident Timeline */}
      <div>
        <h2 className="text-sm font-semibold text-cyan-400">Incident Timeline</h2>
        <ul className="list-disc list-inside text-xs text-slate-300">
          {rca.incidentTimeline.map((event, idx) => (
            <li key={idx}>{event}</li>
          ))}
        </ul>
      </div>

      {/* Supporting Evidence */}
      <div>
        <h2 className="text-sm font-semibold text-cyan-400">Supporting Evidence</h2>
        <ul className="list-disc list-inside text-xs text-slate-300">
          {rca.supportingEvidence.map((evidence, idx) => (
            <li key={idx}>{evidence}</li>
          ))}
        </ul>
      </div>

      {/* Recommended Maintenance */}
      <div className="rounded-lg bg-red-900/30 border border-red-700 p-4">
        <h2 className="text-sm font-semibold text-red-400">Recommended Maintenance</h2>
        <p className="text-xs text-slate-200 mt-1">{rca.recommendedMaintenance}</p>
      </div>

      {/* Preventive Actions */}
      <div>
        <h2 className="text-sm font-semibold text-cyan-400">Preventive Actions</h2>
        <ul className="list-disc list-inside text-xs text-slate-300">
          {rca.preventiveActions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
