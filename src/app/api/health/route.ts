export async function GET() {
  return Response.json({
    status: "ok",
    service: "sdoh-scout",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    tools: ["scan_sdoh_risks", "get_risk_details", "match_community_resources"],
  });
}
