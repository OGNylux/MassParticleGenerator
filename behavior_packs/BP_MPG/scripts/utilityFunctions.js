import { world, system } from "@minecraft/server"

export function checkDirection(x, y) {
	const result = y - x;	
	if(result < 0) return -1;
	return 1;
}

export const isBetween = (entityLocation, firstLocation, secondLocation) => {
	return entityLocation.x.between(firstLocation.x, secondLocation.x, true) && entityLocation.z.between(firstLocation.z, secondLocation.z, true) && entityLocation.y.between(firstLocation.y, secondLocation.y, true);
}

Number.prototype.between = function(a, b, inclusive) {
  let min = Math.min(a, b),
      max = Math.max(a, b);

  return inclusive ? this >= min && this <= max : this > min && this < max;
}

export function sleep(ticks) {
    return new Promise(resolve => {
        system.run(function runnable() {
            if (ticks-- > 0)
                system.run(runnable);
            else
                resolve();
        })
    })
}