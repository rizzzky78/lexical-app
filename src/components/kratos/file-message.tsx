interface FileProps {
  data: string | Uint8Array | ArrayBuffer | Buffer | URL;
}

export function FileMessage({ data }: FileProps) {
  return (
    <div>
      <div>SOME FILE HERE</div>
    </div>
  );
}
