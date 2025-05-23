export interface EfficientFrontierResponse {
  risks: number[];
  returns: number[];
  optimal_weights: number[];
  expected_return: number;
  standard_deviation: number;
  message: string;
}