export enum EventType {
  TEMPERATURE = "TEMPERATURE",
  LIGHT = "LIGHT",
  DOOR = "DOOR",
  HEAT = "HEAT",
}

export interface HomeState {
  temperature: string;
  light: boolean;
  door: boolean;
  heat: boolean;
}

export interface WSMessage {
  type: "INIT" | "UPDATE";
  data: HomeState | StateUpdate;
}

export interface StateUpdate {
  type: EventType;
  value: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
  ip: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
}

export interface HistoryEvent {
  id: number;
  type: "DOOR" | "LIGHT" | "HEAT" | "TEMPERATURE";
  value: string;
  createdAt: string;
}

export interface HistoryResponse {
  data: HistoryEvent[];
}
