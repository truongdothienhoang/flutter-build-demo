// api/deployment-status.js

let deploymentInfo = {
  status: "success",
  deploymentUrl: "https://flutter-build-demo-git-web-build-flutterpipes-projects.vercel.app",
  state: "READY",
};

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(deploymentInfo);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
