export default function TavilyUI({ content }: { content: string }) {
  return (
    <div className="overflow-x-auto">
      <pre className="text-sm">{content}</pre>
    </div>
  );
}
