import { Inject, Injectable } from '@nestjs/common';
import type { CachePort } from 'src/common/ports/cache/cache.ports';
import { CACHE_PORT } from 'src/modules/cache/di.tokens';

export function clientDetailVersionKey(uuid: string): string {
  return `clients:ver:${uuid}`;
}

export function clientsListVersionKey(): string {
  return `clients:list:version`;
}

@Injectable()
export class ClientCacheKeyBuilder {
  constructor(@Inject(CACHE_PORT) private readonly cache: CachePort) {}

  async buildDetailKey(uuid: string): Promise<string> {
    const version = (await this.cache.get(clientDetailVersionKey(uuid))) ?? '1';
    return `clients:detail:uuid:${uuid}:v${version}`;
  }

  async bumpDetailVersion(uuid: string): Promise<void> {
    await this.cache.incr(clientDetailVersionKey(uuid));
  }

  async bumpListVersion(): Promise<void> {
    await this.cache.incr(clientsListVersionKey());
  }
}
