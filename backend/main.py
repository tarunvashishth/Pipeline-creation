# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI()

# --- CORS Configuration ---
# Define the origins that are allowed to make requests to this backend.
# Use ["*"] for development to allow all origins, but be more specific in production.
origins = [
    "http://localhost",         # Base origin
    "http://localhost:3000",    # Common React dev port
    "http://localhost:5173",    # Common Vite dev port
    # Add any other origins your frontend might be served from
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- Pydantic Models for Request Body ---

class NodeData(BaseModel):
    # Define fields you expect in node.data if you need to access them.
    # For now, a generic Dict is fine for the purpose of DAG checking and counting.
    # Example: text: Optional[str] = None, inputName: Optional[str] = None
    pass # Keep it simple unless specific data fields are needed by the backend

class Node(BaseModel):
    id: str
    type: Optional[str] = None # Type might not be strictly needed for this endpoint's logic
    position: Optional[Dict[str, float]] = None # Position might not be needed either
    data: Dict[str, Any] # Make data flexible, or use NodeData if more structure is desired

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class PipelinePayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

# --- Helper Function for DAG Check (Cycle Detection) ---

def is_cyclic_util(node_id: str, graph: Dict[str, List[str]], visited: Dict[str, bool], recursion_stack: Dict[str, bool]) -> bool:
    """
    Utility function for DFS based cycle detection.
    - graph: Adjacency list representation of the graph.
    - visited: Keeps track of visited nodes across all DFS paths.
    - recursion_stack: Keeps track of nodes in the current DFS path.
    """
    visited[node_id] = True
    recursion_stack[node_id] = True

    # Recur for all the vertices adjacent to this vertex
    if node_id in graph: # Check if the node has outgoing edges
        for neighbour in graph[node_id]:
            if not visited[neighbour]:
                if is_cyclic_util(neighbour, graph, visited, recursion_stack):
                    return True
            elif recursion_stack[neighbour]: # If neighbour is in recursion stack, cycle detected
                return True

    # The node is removed from recursion stack before function ends
    recursion_stack[node_id] = False
    return False

def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Checks if the given graph (nodes and edges) is a Directed Acyclic Graph.
    Returns True if it's a DAG, False otherwise (if a cycle is detected).
    """
    if not nodes:
        return True # An empty graph or a graph with no nodes is a DAG

    graph: Dict[str, List[str]] = {node.id: [] for node in nodes}
    node_ids = {node.id for node in nodes}

    for edge in edges:
        # Ensure source and target nodes exist to prevent KeyErrors,
        # though ideally, valid edges should always connect existing nodes.
        if edge.source in node_ids and edge.target in node_ids:
            graph[edge.source].append(edge.target)
        else:
            # Handle invalid edge if necessary, e.g., log a warning or raise error
            # For simplicity here, we'll ignore edges pointing to/from non-existent nodes
            # for DAG check, but this might affect num_edges if they aren't pre-filtered.
            print(f"Warning: Edge '{edge.id}' connects non-existent node(s). Source: '{edge.source}', Target: '{edge.target}'")


    visited: Dict[str, bool] = {node.id: False for node in nodes}
    recursion_stack: Dict[str, bool] = {node.id: False for node in nodes}

    for node_obj in nodes:
        node_id = node_obj.id
        if not visited[node_id]:
            if is_cyclic_util(node_id, graph, visited, recursion_stack):
                return False # Cycle detected
    return True # No cycles detected

# --- API Endpoints ---

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
async def parse_pipeline_endpoint(payload: PipelinePayload):
    """
    Receives pipeline data (nodes and edges), calculates node/edge counts,
    and checks if the pipeline is a Directed Acyclic Graph (DAG).
    """
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)

    # Perform DAG check
    is_dag = check_is_dag(payload.nodes, payload.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }

# If you want to run this with `python main.py` for simple testing (though uvicorn is preferred)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)