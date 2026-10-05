/** A blocking TTL cache: concurrent misses share a loader, expired data is not served. */
export class SharedTtlCache<T> {
  private entry?: { value: T; expiresAt: number };
  private pending?: Promise<T>;
  private revision = 0;

  constructor(
    private readonly ttlMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  get(load: () => Promise<T>): Promise<T> {
    if (this.entry && this.entry.expiresAt > this.now()) {
      return Promise.resolve(this.entry.value);
    }
    if (this.pending) return this.pending;

    const revision = this.revision;
    const pending = Promise.resolve().then(load).then((value) => {
      if (revision === this.revision) {
        this.entry = { value, expiresAt: this.now() + this.ttlMs };
      }
      return value;
    }).finally(() => {
      if (this.pending === pending) this.pending = undefined;
    });
    this.pending = pending;
    return pending;
  }

  invalidate(): void {
    this.revision += 1;
    this.entry = undefined;
    this.pending = undefined;
  }
}
