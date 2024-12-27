/* eslint-disable @next/next/no-img-element */
interface ImageProps {
  data: string | Uint8Array | ArrayBuffer | Buffer | URL;
}

export function ImageMessage({ data }: ImageProps) {
  return (
    <div>
      <div>{/* <img src={data} alt="attachment-image" /> */}</div>
    </div>
  );
}
