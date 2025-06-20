// frontend/src/submit.js
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

export const SubmitButton = () => {
  const { nodes, edges } = useStore((state) => {
    return {
      nodes: state.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data || {},
      })),
      edges: state.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
    };
  }, shallow);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert(
        "The pipeline is empty. Please add and connect some nodes before submitting."
      );
      return;
    }

    for (const node of nodes) {
      if (
        node.type === "text" &&
        (!node.data.text || node.data.text.trim() === "")
      ) {
        alert(
          `Error: Text node "${node.id}" cannot be empty. Please enter some text or connect variables.`
        );
        return;
      }
    }

    console.log("Submitting pipeline data:", { nodes, edges });

    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        // Use the backend's address
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        let errorDetail = `HTTP error ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetail =
            errorData.detail || JSON.stringify(errorData) || errorDetail;
        } catch (e) {
          errorDetail = `${errorDetail}: ${response.statusText}`;
        }
        throw new Error(errorDetail);
      }

      const result = await response.json();

      alert(
        `Pipeline Analysis Results:
            -----------------------------
            Number of Nodes: ${result.num_nodes}
            Number of Edges: ${result.num_edges}
            Is DAG (Directed Acyclic Graph): ${result.is_dag ? "Yes" : "No"}${
          result.is_dag ? "" : " (Cycles detected!)"
        }`
      );
    } catch (error) {
      console.error("Failed to submit pipeline:", error);
      alert(
        `Error submitting pipeline: ${error.message}\n\nPlease ensure the backend server is running and accessible at http://localhost:8000.`
      );
    }
  };

  return (
    <div className="submit-button-container">
      <button type="button" onClick={handleSubmit}>
        Submit Pipeline
      </button>
    </div>
  );
};
