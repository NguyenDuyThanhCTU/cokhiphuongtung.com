import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { routes } from "@/lib/constants/routes";

export default function NotFound() {
  return (
    <Container className="py-12">
      <EmptyState title="Không tìm thấy trang." />
      <div className="mt-6 text-center">
        <Link href={routes.home} className="text-sm font-medium text-zinc-950 underline">
          Về trang chủ
        </Link>
      </div>
    </Container>
  );
}
