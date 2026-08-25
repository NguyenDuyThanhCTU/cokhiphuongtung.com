import type { ActiveModule } from "@/lib/types/shared";

export function isActiveModule(
  modules: readonly ActiveModule[] | undefined,
  module: ActiveModule,
): boolean {
  return Array.isArray(modules) && modules.includes(module);
}
