// async getVehicleRCA(vehicleId: string = VEHICLE_ID): Promise<RCAData | null> {
//   if (USE_MOCK) {
//     await delay(200);
//     return {
//       executiveSummary:
//         "Vehicle EV-001 is flagged with a critical health status and a high probability of failure, indicating an imminent issue. While no specific major component failure is identified by the rule engine, the ML prediction suggests a high risk, necessitating immediate investigation.",
//       rootCause:
//         "The ML model predicts a high probability of failure (93.57%) with critical health status. This prediction is not directly supported by a specific component failure indicated by the rule engine, which recommends continued monitoring. However, the presence of detected anomalies and diagnostic trouble codes, coupled with a recorded failure history, suggests underlying issues that may not yet be fully characterized by the rule engine but are significant enough to trigger the ML prediction.",
//       incidentTimeline: [
//         "ML model predicts 93.57% failure probability with critical health status.",
//         "Rule engine analysis identifies 'No Major Issue' and recommends continued monitoring.",
//         "Telemetry data shows 2 detected anomalies and 1 diagnostic trouble code.",
//       ],
//       supportingEvidence: [
//         "ML Predicted Failure Probability: 93.57%",
//         "ML Health Status: Critical",
//         "Detected Anomalies: 2",
//         "Diagnostic Trouble Codes: 1",
//         "Failure History: 1",
//       ],
//       atRiskComponent: "General Vehicle",
//       failureType: "Predicted failure",
//       severity: "Critical",
//       confidence: "High",
//       recommendedMaintenance:
//         "Perform a comprehensive diagnostic scan to identify the cause of the detected anomalies and diagnostic trouble codes. Investigate the vehicle's failure history for recurring issues. If no immediate cause is found, continue close monitoring of all telemetry data, especially those related to battery, motor, and braking systems.",
//       preventiveActions: [
//         "Implement enhanced real-time anomaly detection algorithms.",
//         "Regularly update ML models with new telemetry data and failure patterns.",
//         "Establish a proactive diagnostic schedule for vehicles with elevated failure history or DTCs.",
//       ],
//     };
//   }

//   // ✅ Live API call
//   const { data } = await api.get(`/vehicle/${vehicleId}`);
//   const backend = data.vehicle;

//   return {
//     executiveSummary: backend.rca_executive_summary || "",
//     rootCause: backend.rca_root_cause || "",
//     incidentTimeline: backend.rca_incident_timeline || [],
//     supportingEvidence: backend.rca_supporting_evidence || [],
//     atRiskComponent: backend.rca_at_risk_component || "General Vehicle",
//     failureType: backend.rca_failure_type || "Unknown",
//     severity: backend.rca_severity || "Unknown",
//     confidence: backend.rca_confidence || "Low",
//     recommendedMaintenance: backend.rca_recommended_maintenance || "",
//     preventiveActions: backend.rca_preventive_actions || [],
//   };
// }
