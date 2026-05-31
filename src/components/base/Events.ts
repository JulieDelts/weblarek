type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
  eventName: string;
  data: unknown;
};

export interface IEvents {
  on<T = any>(event: EventName, callback: (data: T) => void): void;
  emit<T = any>(event: string, data?: T): void;
  trigger<T = any>(event: string, context?: Partial<T>): (data: T) => void;
}

export class EventEmitter implements IEvents {
  _events: Map<EventName, Set<Subscriber>>;

  constructor() {
    this._events = new Map<EventName, Set<Subscriber>>();
  }

  on<T = any>(eventName: EventName, callback: (event: T) => void) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set<Subscriber>());
    }
    this._events.get(eventName)?.add(callback);
  }

  off(eventName: EventName, callback: Subscriber) {
    if (this._events.has(eventName)) {
      this._events.get(eventName)!.delete(callback);
      if (this._events.get(eventName)?.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  emit<T = any>(eventName: string, data?: T) {
    this._events.forEach((subscribers, name) => {
      if (name === "*")
        subscribers.forEach((callback) =>
          callback({
            eventName,
            data,
          }),
        );
      if (
        (name instanceof RegExp && name.test(eventName)) ||
        name === eventName
      ) {
        subscribers.forEach((callback) => callback(data));
      }
    });
  }

  onAll(callback: (event: EmitterEvent) => void) {
    this.on("*", callback);
  }

  offAll() {
    this._events = new Map<string, Set<Subscriber>>();
  }

  trigger<T = any>(eventName: string, context?: Partial<T>) {
    return (data: T) => {
      const dataObject =
        typeof data === "object" && data !== null ? data : { value: data };
      this.emit(eventName, {
        ...dataObject,
        ...(context || {}),
      });
    };
  }
}
