import { world } from "@minecraft/server"
import { massParticleGenerator } from "./data";

export function spawnEntity(player, x, z) {
	const firstPosition = massParticleGenerator.getFirstPosition();
	const secondPosition = massParticleGenerator.getSecondPosition();
	const entitySpacing = massParticleGenerator.getEntitySpacing();

	const minY = Math.min(firstPosition.y, secondPosition.y);
	const maxY = Math.max(firstPosition.y, secondPosition.y);

	for(let i = minY; i < maxY; i+=entitySpacing) {
		const entity = player.dimension.spawnEntity(massParticleGenerator.getFogEntity(), {x: player.location.x, y: i, z: player.location.z});
		entity.setDynamicProperty("tablePositionX", x);
		entity.setDynamicProperty("tablePositionZ", z);
	}
}

export const isBetween = (entityLocation, firstLocation, secondLocation) => {
	return entityLocation.x.between(firstLocation.x, secondLocation.x, true) && entityLocation.z.between(firstLocation.z, secondLocation.z, true) && entityLocation.y.between(firstLocation.y, secondLocation.y, true);
}

Number.prototype.between = function(a, b, inclusive) {
  let min = Math.min(a, b),
      max = Math.max(a, b);

  return inclusive ? this >= min && this <= max : this > min && this < max;
}