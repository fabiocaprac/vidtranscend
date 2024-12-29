import { useEffect, useRef } from "react";

interface MindMapNode {
  id: string;
  text: string;
  children?: MindMapNode[];
}

interface MindMapProps {
  data: MindMapNode;
}

export const MindMap = ({ data }: MindMapProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderNode = (node: MindMapNode, level: number = 0, parentX?: number, parentY?: number) => {
      const nodeElement = document.createElement("div");
      nodeElement.className = `absolute p-3 rounded-lg bg-white shadow-lg border border-gray-200 
        transition-all duration-300 animate-fade-in`;
      nodeElement.style.maxWidth = "200px";
      nodeElement.textContent = node.text;

      const x = level === 0 ? canvasRef.current!.clientWidth / 2 : (parentX || 0) + 250;
      const y = level === 0 ? canvasRef.current!.clientHeight / 2 : 
        (parentY || 0) + (node.children ? node.children.length * 60 : 0);

      nodeElement.style.left = `${x}px`;
      nodeElement.style.top = `${y}px`;
      nodeElement.style.transform = "translate(-50%, -50%)";

      canvasRef.current!.appendChild(nodeElement);

      if (parentX !== undefined && parentY !== undefined) {
        const line = document.createElement("div");
        line.className = "absolute bg-gray-300 transform-origin-left animate-fade-in";
        line.style.height = "2px";
        line.style.left = `${parentX}px`;
        line.style.top = `${parentY}px`;
        line.style.width = `${Math.abs(x - parentX)}px`;
        canvasRef.current!.appendChild(line);
      }

      node.children?.forEach((child, index) => {
        renderNode(child, level + 1, x, y + (index - (node.children!.length - 1) / 2) * 80);
      });
    };

    canvasRef.current.innerHTML = "";
    renderNode(data);
  }, [data]);

  return (
    <div 
      ref={canvasRef} 
      className="w-full h-[600px] relative bg-gray-50 rounded-xl overflow-auto p-4"
    />
  );
};