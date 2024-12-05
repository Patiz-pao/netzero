export interface Calculation {
  province: string;
  tumbol: string;
  area: string;
  customAreaValue?: string;
  customArea?: boolean;
  type: string;
  treeType: string;
}

export interface CalculationDebug {
  province: string;
  tumbol: string;
  area: string;
  customAreaValue?: string;
  customArea?: boolean;
  type: string;
  treeType: string;
  electric: string;
  solarEnergyIntensity: string;
  solarCell?: string;
  day: string;
}
