"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type ProductSearchBoxProps = {
  defaultValue?: string;
};

export function ProductSearchBox({ defaultValue = "" }: ProductSearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/danh-muc?${params.toString()}`);
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Input
        aria-label="Tìm kiếm sản phẩm"
        name="q"
        placeholder="Tìm kiếm"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit">Tìm</Button>
    </form>
  );
}
