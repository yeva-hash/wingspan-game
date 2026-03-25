export class ServiceLocator {
  private readonly services = new Map<symbol, unknown>();

  register<T>(key: symbol, service: T): void {
    if (this.services.has(key)) {
      throw new Error(`Service already registered: ${String(key)}`);
    }
    this.services.set(key, service);
  }

  get<T>(key: symbol): T {
    const service = this.services.get(key);
    if (service === undefined) {
      throw new Error(`Service not found: ${String(key)}`);
    }
    return service as T;
  }

  tryGet<T>(key: symbol): T | undefined {
    return this.services.get(key) as T | undefined;
  }
}
