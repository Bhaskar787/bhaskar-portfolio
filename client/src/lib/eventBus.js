import { EventEmitter } from "events";

class GlobalEventBus extends EventEmitter {}

if (!globalThis.__globalEventBus) {
  globalThis.__globalEventBus = new GlobalEventBus();
}

const eventBus = globalThis.__globalEventBus;
export default eventBus;
