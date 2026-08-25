"use client";

import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/ui/ErrorState";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <Container className="py-12">
      <ErrorState
        title="Không thể tải dữ liệu."
        message="Vui lòng thử lại."
        onRetry={reset}
      />
    </Container>
  );
}
