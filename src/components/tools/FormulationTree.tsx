"use client";

interface FormulationNode {
  label: string;
  children?: FormulationNode[];
}

interface FormulationTreeProps {
  diagramJson: string;
}

function renderNode(node: FormulationNode): JSX.Element {
  return (
    <li>
      {node.label}
      {node.children && node.children.length > 0 && (
        <ul className="ml-4 list-disc">
          {node.children.map((child, idx) => (
            <div key={idx}>{renderNode(child)}</div>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FormulationTree({ diagramJson }: FormulationTreeProps) {
  const data = JSON.parse(diagramJson) as FormulationNode;
  return (
    <ul className="list-disc space-y-2">
      {renderNode(data)}
    </ul>
  );
}
