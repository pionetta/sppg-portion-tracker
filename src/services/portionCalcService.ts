import type { DistributionPeriod, MenuPortionStatus } from '../types';

/**
 * Calculates used portions for a single container.
 * Formula: used_portions = current_cumulative_portions - previous_cumulative_portions
 * For the first container, previous_cumulative_portions is 0.
 */
export function calculateContainerUsage(
  currentCumulative: number,
  previousCumulative: number = 0
): number {
  if (isNaN(currentCumulative)) return 0;
  if (isNaN(previousCumulative)) previousCumulative = 0;
  return Math.max(0, currentCumulative - previousCumulative);
}

/**
 * Calculates portion split for dual containers (specifically for staple food / rice).
 * Splits the total portion increment evenly between 2 containers.
 * Formula:
 * - container 1 used: Math.ceil(increment / 2)
 * - container 2 used: Math.floor(increment / 2)
 * - container 1 cumulative: previousCumulative + container 1 used
 * - container 2 cumulative: previousCumulative + total increment
 */
export function calculateDualContainerSplit(
  totalIncrement: number,
  previousCumulative: number = 0
): {
  container1: { used_portions: number; cumulative_portions: number };
  container2: { used_portions: number; cumulative_portions: number };
} {
  const inc = Math.max(0, totalIncrement);
  const prev = Math.max(0, previousCumulative);
  const used1 = Math.ceil(inc / 2);
  const used2 = Math.floor(inc / 2);
  const cumul1 = prev + used1;
  const cumul2 = prev + inc;

  return {
    container1: { used_portions: used1, cumulative_portions: cumul1 },
    container2: { used_portions: used2, cumulative_portions: cumul2 },
  };
}

/**
 * Calculates total portions for a menu based on its containers.
 * Total portion of a menu = cumulative_portions of the last container in sequence.
 * Returns 0 if there are no containers.
 */
export function calculateMenuTotal(
  containers: Array<{ cumulative_portions: number }>
): number {
  if (!containers || containers.length === 0) return 0;
  const lastContainer = containers[containers.length - 1];
  return Math.max(0, lastContainer.cumulative_portions || 0);
}

/**
 * Calculates menu portion status based on actual vs target.
 */
export function calculateMenuPortionStatus(
  containerCount: number,
  actual: number,
  target: number
): MenuPortionStatus {
  if (containerCount === 0) return 'belum_dimulai';
  if (actual < target) return 'dalam_proses';
  if (actual === target) return 'selesai';
  return 'melebihi_target';
}

/**
 * Calculates the daily total actual portions across menus.
 */
export function calculateDailyTotal(menuTotals: number[]): number {
  if (!menuTotals || menuTotals.length === 0) return 0;
  const validTotals = menuTotals.filter((t) => !isNaN(t) && t >= 0);
  if (validTotals.length === 0) return 0;
  const sum = validTotals.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / validTotals.length);
}

/**
 * Calculates remaining portions needed to reach the target.
 * Returns 0 if actual >= target.
 */
export function calculateRemainingPortions(
  target: number,
  actual: number
): number {
  if (isNaN(target) || isNaN(actual)) return 0;
  return Math.max(0, target - actual);
}

/**
 * Calculates percentage progress of portioning.
 * Clamped between 0% and 100%.
 */
export function calculateProgress(target: number, actual: number): number {
  if (!target || target <= 0) return actual > 0 ? 100 : 0;
  if (isNaN(actual) || actual <= 0) return 0;
  const pct = Math.round((actual / target) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Calculates total allocation from school lists, optionally filtered by distribution period (Pagi, Siang).
 */
export function calculateSchoolAllocation(
  schools: Array<{
    portions: number;
    distribution_period?: DistributionPeriod;
    morning_portions?: number;
    afternoon_portions?: number;
  }>,
  filterPeriod?: DistributionPeriod
): number {
  if (!schools || schools.length === 0) return 0;

  return schools.reduce((total, school) => {
    const totalPortions = Number(school.portions) || 0;
    const hasSplit =
      typeof school.morning_portions === 'number' ||
      typeof school.afternoon_portions === 'number';

    const morning =
      typeof school.morning_portions === 'number'
        ? Number(school.morning_portions) || 0
        : school.distribution_period === 'Pagi' || school.distribution_period === 'Keduanya'
        ? totalPortions
        : 0;

    const afternoon =
      typeof school.afternoon_portions === 'number'
        ? Number(school.afternoon_portions) || 0
        : school.distribution_period === 'Siang' || school.distribution_period === 'Keduanya'
        ? totalPortions
        : 0;

    if (!filterPeriod) {
      if (hasSplit) {
        return total + ((Number(school.morning_portions) || 0) + (Number(school.afternoon_portions) || 0));
      }
      return total + totalPortions;
    }

    if (filterPeriod === 'Pagi') {
      return total + morning;
    } else if (filterPeriod === 'Siang') {
      return total + afternoon;
    } else if (filterPeriod === 'Keduanya') {
      if (school.distribution_period === 'Keduanya' || (morning > 0 && afternoon > 0)) {
        return total + (hasSplit ? morning + afternoon : totalPortions);
      }
    }

    return total;
  }, 0);
}

export interface ValidationResult {
  isValid: boolean;
  errorIndex?: number;
  errorMessage?: string;
}

/**
 * Validates a sequence of containers to ensure:
 * 1. Cumulative portions are non-negative.
 * 2. Cumulative portions do not decrease (each container >= previous container).
 */
export function validateContainerSequence(
  containers: Array<{ container_number: number; cumulative_portions: number }>
): ValidationResult {
  if (!containers || containers.length === 0) {
    return { isValid: true };
  }

  let previousCumulative = 0;

  for (let i = 0; i < containers.length; i++) {
    const current = containers[i];
    const val = Number(current.cumulative_portions);

    if (isNaN(val) || val < 0) {
      return {
        isValid: false,
        errorIndex: i,
        errorMessage: `Wadah ${current.container_number}: Jumlah porsi tidak boleh bernilai negatif.`
      };
    }

    if (val < previousCumulative) {
      return {
        isValid: false,
        errorIndex: i,
        errorMessage: 'Jumlah porsi kumulatif tidak boleh lebih kecil dari pencatatan sebelumnya.'
      };
    }

    previousCumulative = val;
  }

  return { isValid: true };
}

/**
 * Recalculates an array of cumulative values into structured container records with used_portions.
 */
export function recalculateContainersList(
  cumulativeList: number[]
): Array<{ container_number: number; cumulative_portions: number; used_portions: number }> {
  let previousCumulative = 0;

  return cumulativeList.map((cumulative, index) => {
    const currentVal = Math.max(0, Number(cumulative) || 0);
    const used = calculateContainerUsage(currentVal, previousCumulative);
    previousCumulative = currentVal;

    return {
      container_number: index + 1,
      cumulative_portions: currentVal,
      used_portions: used
    };
  });
}

/**
 * Evaluates temperature reading against SOP configurations.
 * Terminology: 'sesuai' ("Sesuai batas konfigurasi") vs 'di_luar' ("Di luar batas konfigurasi").
 */
export function calculateTemperatureStatus(
  temperature: number,
  isColdDish: boolean,
  minHotTemp: number = 60.0,
  maxColdTemp: number = 10.0
): 'sesuai' | 'di_luar' {
  if (isColdDish) {
    return temperature <= maxColdTemp ? 'sesuai' : 'di_luar';
  }
  return temperature >= minHotTemp ? 'sesuai' : 'di_luar';
}
