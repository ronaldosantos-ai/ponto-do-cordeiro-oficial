export interface Simulation {
  id: string;
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  createdAt: Date;
}

export interface SimulationFormData {
  weightKg: number;
  pricePerKg: number;
}

export interface SimulationResult {
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  pricePerGram: number;
}

export interface UserSettings {
  defaultPricePerKg: number;
  isPremium: boolean;
}
