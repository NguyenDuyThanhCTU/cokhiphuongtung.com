export default function BlogsH1({ Content }: { Content: string; description?: string }) {
  return <h1 className="mb-3 text-[30px] font-normal text-mainColorHover">{Content}</h1>;
}
