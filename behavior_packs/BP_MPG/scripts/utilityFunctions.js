import { system } from "@minecraft/server"
import { massParticleGenerator } from "./data";
import { world, MolangVariableMap } from "@minecraft/server"

export function drawCubes() {
	system.runInterval(() => {
		world.getAllPlayers().forEach(player => {
			player.dimension.getEntities({
				type: massParticleGenerator.getFogEntity(),
				location: player.location,
				maxDistance: 92
			}).forEach(entity => {
				if(entity.hasTag("outline")) drawCube(entity, massParticleGenerator.getEntitySpacing() / 2);
				if(entity.hasTag("hitbox")) drawCube(entity, 0.5);
			})
		});
	}, 20);
}

export function drawCube(entity, radiusString) {
	const radius = parseFloat(radiusString);

	spawnParticle(entity, radius, 0, -radius, 0, 'pb:square_marker');
	spawnParticle(entity, radius, 0, radius, 0, 'pb:square_marker');

	spawnParticle(entity, radius, radius, 0, 0, 'pb:square_marker_vertical', 90);
	spawnParticle(entity, radius, -radius, 0, 0, 'pb:square_marker_vertical', 90);
	spawnParticle(entity, radius, 0, 0, radius, 'pb:square_marker_vertical');
	spawnParticle(entity, radius, 0, 0, -radius, 'pb:square_marker_vertical');
}

export function spawnParticle(entity, radius, offsetX, offsetY, offsetZ, particleType, angle = 0) {
	const dimension = world.getDimension(entity?.dimension.id);
	const variableMap = new MolangVariableMap();
	const offset = radius === 0.5 ? 0.5 : 0;
	const location = {x: entity.location.x, y: entity.location.y + offset, z: entity.location.z};

    variableMap.setFloat('variable.radius', radius);
    variableMap.setFloat('variable.offset_x', offsetX);
    variableMap.setFloat('variable.offset_y', offsetY);
    variableMap.setFloat('variable.offset_z', offsetZ);
    variableMap.setFloat('variable.angle', angle);
    dimension.spawnParticle(particleType, location, variableMap);
}

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