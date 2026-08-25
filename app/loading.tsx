import { Container } from "@/components/layout/Container";
import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <Container>
      <LoadingState message="Đang tải dữ liệu..." />
    </Container>
  );
}
