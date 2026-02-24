
// Graph Data Structure for JSPM's Narhe Technical Campus
export type NodeId =
    | "MAIN_GATE" | "ADMIN_BUILDING" | "LIBRARY" | "CANTEEN"
    | "COMP_IT_DEPT" | "ENTC_DEPT" | "MECH_CIVIL_DEPT"
    | "WORKSHOP" | "SPORTS_GROUND" | "HOSTEL";

interface Edge {
    node: NodeId;
    weight: number; // Distance in meters
}

export interface NodeData {
    label: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100 (where 0 is top)
}

export const CAMPUS_NODES: Record<NodeId, NodeData> = {
    "MAIN_GATE": { label: "Main Gate", x: 50, y: 90 },
    "ADMIN_BUILDING": { label: "Admin Bldg", x: 50, y: 60 },
    "LIBRARY": { label: "Library", x: 30, y: 60 },
    "CANTEEN": { label: "Canteen", x: 70, y: 60 },
    "COMP_IT_DEPT": { label: "Comp/IT Dept", x: 35, y: 35 },
    "ENTC_DEPT": { label: "E&TC Dept", x: 65, y: 35 },
    "MECH_CIVIL_DEPT": { label: "Mech/Civil", x: 50, y: 25 },
    "WORKSHOP": { label: "Workshop", x: 20, y: 25 },
    "SPORTS_GROUND": { label: "Sports Ground", x: 80, y: 80 },
    "HOSTEL": { label: "Hostel", x: 90, y: 20 }
};

// Adjacency List representing the Campus Map
export const CAMPUS_GRAPH: Record<NodeId, Edge[]> = {
    "MAIN_GATE": [
        { node: "ADMIN_BUILDING", weight: 50 },
        { node: "SPORTS_GROUND", weight: 100 }
    ],
    "ADMIN_BUILDING": [
        { node: "MAIN_GATE", weight: 50 },
        { node: "LIBRARY", weight: 30 },
        { node: "CANTEEN", weight: 30 },
        { node: "COMP_IT_DEPT", weight: 40 },
        { node: "ENTC_DEPT", weight: 40 },
        { node: "MECH_CIVIL_DEPT", weight: 60 }
    ],
    "LIBRARY": [
        { node: "ADMIN_BUILDING", weight: 30 },
        { node: "CANTEEN", weight: 40 },
        { node: "COMP_IT_DEPT", weight: 20 },
        { node: "WORKSHOP", weight: 30 }
    ],
    "COMP_IT_DEPT": [
        { node: "ADMIN_BUILDING", weight: 40 },
        { node: "LIBRARY", weight: 20 },
        { node: "MECH_CIVIL_DEPT", weight: 30 },
        { node: "ENTC_DEPT", weight: 30 }
    ],
    "ENTC_DEPT": [
        { node: "ADMIN_BUILDING", weight: 40 },
        { node: "COMP_IT_DEPT", weight: 30 },
        { node: "CANTEEN", weight: 30 },
        { node: "HOSTEL", weight: 60 }
    ],
    "MECH_CIVIL_DEPT": [
        { node: "ADMIN_BUILDING", weight: 60 },
        { node: "COMP_IT_DEPT", weight: 30 },
        { node: "WORKSHOP", weight: 20 }
    ],
    "WORKSHOP": [
        { node: "MECH_CIVIL_DEPT", weight: 20 },
        { node: "LIBRARY", weight: 30 }
    ],
    "CANTEEN": [
        { node: "ADMIN_BUILDING", weight: 30 },
        { node: "LIBRARY", weight: 40 },
        { node: "ENTC_DEPT", weight: 30 },
        { node: "SPORTS_GROUND", weight: 50 },
        { node: "HOSTEL", weight: 40 }
    ],
    "SPORTS_GROUND": [
        { node: "MAIN_GATE", weight: 100 },
        { node: "CANTEEN", weight: 50 }
    ],
    "HOSTEL": [
        { node: "CANTEEN", weight: 40 },
        { node: "ENTC_DEPT", weight: 60 }
    ]
};

// Dijkstra's Algorithm
export function findShortestPath(start: NodeId, end: NodeId) {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const queue: string[] = [];

    // Initialize
    for (const node in CAMPUS_GRAPH) {
        if (node === start) {
            distances[node] = 0;
            queue.unshift(node);
        } else {
            distances[node] = Infinity;
            queue.push(node);
        }
        previous[node] = null;
    }

    while (queue.length > 0) {
        queue.sort((a, b) => distances[a] - distances[b]);
        const current = queue.shift() as NodeId;

        if (current === end) break;
        if (distances[current] === Infinity) break;

        const neighbors = CAMPUS_GRAPH[current] || [];
        for (const neighbor of neighbors) {
            const alt = distances[current] + neighbor.weight;
            if (alt < distances[neighbor.node]) {
                distances[neighbor.node] = alt;
                previous[neighbor.node] = current;
            }
        }
    }

    // Reconstruct Path
    const path: NodeId[] = [];
    let u: string | null = end;

    if (previous[u] || u === start) {
        while (u) {
            path.unshift(u as NodeId);
            u = previous[u];
        }
    }

    return { path, distance: distances[end] };
}
