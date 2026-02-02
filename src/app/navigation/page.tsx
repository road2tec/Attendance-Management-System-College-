"use client";
import { useState } from "react";
import { CAMPUS_NODES, CAMPUS_GRAPH, findShortestPath, NodeId } from "@/lib/graph";
import { IconMapPin, IconNavigation, IconWalk, IconFlag, IconCurrentLocation } from "@tabler/icons-react";

export default function NavigationPage() {
    const [start, setStart] = useState<NodeId>("MAIN_GATE");
    const [end, setEnd] = useState<NodeId>("COMP_IT_DEPT");
    const [result, setResult] = useState<{ path: NodeId[], distance: number } | null>(null);

    const handleNavigate = () => {
        if (start === end) {
            alert("Start and Destination cannot be same!");
            return;
        }
        const res = findShortestPath(start, end);
        setResult(res);
    };

    const isEdgeInPath = (n1: NodeId, n2: NodeId) => {
        if (!result) return false;
        const path = result.path;
        for (let i = 0; i < path.length - 1; i++) {
            if ((path[i] === n1 && path[i + 1] === n2) || (path[i] === n2 && path[i + 1] === n1)) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-2 text-[#9d2222]">
                    <IconNavigation size={32} />
                    <h1 className="text-2xl font-bold tracking-tight">CampusNav</h1>
                </div>
                <a href="/" className="text-sm font-medium text-gray-500 hover:text-[#9d2222]">Exit Navigation</a>
            </header>

            <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row">

                {/* Floating Sidebar Controls */}
                <div className="md:w-96 bg-white shadow-xl z-10 flex flex-col h-full border-r border-gray-200">
                    <div className="p-6 space-y-4 shadow-sm z-20 bg-white">
                        <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg text-blue-700 border border-blue-100">
                            <IconCurrentLocation size={20} />
                            <span className="font-bold text-sm">Indoor Navigation System</span>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-green-600"><IconMapPin size={18} /></div>
                                <select
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium"
                                    value={start}
                                    onChange={(e) => setStart(e.target.value as NodeId)}
                                >
                                    {Object.entries(CAMPUS_NODES).map(([key, node]) => (
                                        <option key={key} value={key}>{node.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-center -my-2 relative z-10">
                                <div className="bg-gray-200 p-1 rounded-full text-gray-400">
                                    <div className="w-1 h-4 border-l-2 border-dashed border-gray-400 mx-auto"></div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-red-500"><IconMapPin size={18} /></div>
                                <select
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none appearance-none font-medium"
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value as NodeId)}
                                >
                                    {Object.entries(CAMPUS_NODES).map(([key, node]) => (
                                        <option key={key} value={key}>{node.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleNavigate}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                        >
                            <IconNavigation size={20} /> Start Navigation
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                        {result ? (
                            <div className="animate-fade-in-up">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-2xl font-bold text-gray-800">{result.distance}m</span>
                                    <span className="text-gray-500 text-sm font-medium">Total Distance</span>
                                </div>

                                <div className="relative border-l-2 border-gray-200 ml-4 space-y-6 pb-2">
                                    {result.path.map((node, i) => (
                                        <div key={i} className="pl-6 relative">
                                            {/* Timeline Dot */}
                                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${i === 0 ? 'bg-green-500' :
                                                    i === result.path.length - 1 ? 'bg-red-500' : 'bg-blue-400'
                                                }`}></div>

                                            <h4 className="font-bold text-gray-800 text-sm">{CAMPUS_NODES[node].label}</h4>

                                            {i < result.path.length - 1 && (
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <IconWalk size={12} /> Walk {CAMPUS_GRAPH[node]?.find(e => e.node === result.path[i + 1])?.weight} meters
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 mt-10">
                                <IconMapPin size={48} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Select locations to start</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Viewport */}
                <div className="flex-1 relative bg-[#e5e7eb] overflow-hidden">
                    {/* Background Pattern/Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none mix-blend-multiply"
                        style={{ backgroundImage: "url('/campus_bg.png')" }}
                    ></div>

                    {/* Interactive Layer */}
                    <div className="absolute inset-0 flex items-center justify-center p-10">
                        <div className="relative w-full max-w-3xl aspect-square">

                            {/* SVG Layer for Lines (Roads) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md z-0" viewBox="0 0 100 100">
                                {Object.entries(CAMPUS_GRAPH).map(([fromId, edges]) => (
                                    edges.map((edge) => {
                                        const fromNode = CAMPUS_NODES[fromId as NodeId];
                                        const toNode = CAMPUS_NODES[edge.node];
                                        const inPath = isEdgeInPath(fromId as NodeId, edge.node);

                                        if (fromId > edge.node) return null;

                                        return (
                                            <line
                                                key={`${fromId}-${edge.node}`}
                                                x1={fromNode.x} y1={fromNode.y}
                                                x2={toNode.x} y2={toNode.y}
                                                stroke={inPath ? "#3b82f6" : "#cbd5e1"}
                                                strokeWidth={inPath ? "1.5" : "1"}
                                                strokeLinecap="round"
                                                className="transition-all duration-500"
                                            />
                                        );
                                    })
                                ))}
                            </svg>

                            {/* HTML Layer for Pins/Markers (On Top) */}
                            {Object.entries(CAMPUS_NODES).map(([id, node]) => {
                                const isStart = id === start;
                                const isEnd = id === end;
                                const isInPath = result?.path.includes(id as NodeId);

                                return (
                                    <div
                                        key={id}
                                        className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 cursor-pointer group z-10`}
                                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                        onClick={() => !result && setStart(id as NodeId)}
                                    >
                                        {/* Pin Icon */}
                                        <div className={`flex flex-col items-center ${isStart || isEnd ? 'scale-110' : 'scale-100 hover:scale-110'}`}>
                                            <div className={`p-1.5 rounded-full shadow-lg border-2 border-white text-white ${isStart ? 'bg-green-600' :
                                                    isEnd ? 'bg-red-600' :
                                                        isInPath ? 'bg-blue-500' : 'bg-gray-400'
                                                }`}>
                                                <IconMapPin size={isStart || isEnd ? 24 : 16} fill="currentColor" />
                                            </div>

                                            {/* Label Bubble for Start/End/Hover */}
                                            <div className={`mt-1 bg-white px-2 py-0.5 rounded shadow-md text-[10px] font-bold whitespace-nowrap border border-gray-200 ${isStart || isEnd ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                }`}>
                                                {node.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Map Controls / Logo Overlays */}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
                            <IconNavigation className="text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
