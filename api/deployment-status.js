// This is a simple serverless function example
let latestDeployment = {
  status: "pending",
  deploymentUrl: null,
  state: "BUILDING"
};

// This would normally be updated by your webhook handler when deployment finishes
// For example purposes, we just return the current object

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(latestDeployment);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
