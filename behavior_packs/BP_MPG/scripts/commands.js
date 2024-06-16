import { massParticleGenerator } from "./data";
import { spawnEntity } from "./utilityFunctions";

export function setFirstPosition(player, message) { 
	if(message) {
		const substrings = message.split(' ');
		if(substrings.length !== 3) {
			player.sendMessage("Expected 3 arguments, got " + substrings.length);
			return;
		}
		massParticleGenerator.setFirstPosition({x: Math.round(parseInt(substrings[0])), y: Math.round(parseInt(substrings[1])), z: Math.round(parseInt(substrings[2]))});
		player.sendMessage(`First position set to ${massParticleGenerator.getFirstPosition().x}, ${massParticleGenerator.getFirstPosition().y}, ${massParticleGenerator.getFirstPosition().z}`);
		return;
	}

	massParticleGenerator.setFirstPosition({x: Math.round(player.location.x), y: Math.round(player.location.y), z: Math.round(player.location.z)});
	player.sendMessage(`First position set to ${massParticleGenerator.getFirstPosition().x}, ${massParticleGenerator.getFirstPosition().y}, ${massParticleGenerator.getFirstPosition().z}`);
}

export function setSecondPosition(player, message) {
	if(message) {
		const substrings = message.split(' ');
		if(substrings.length !== 3) {
			player.sendMessage("Expected 3 arguments, got " + substrings.length);
			return;
		}
		massParticleGenerator.setSecondPosition({x: Math.round(parseInt(substrings[0])), y: Math.round(parseInt(substrings[1])), z: Math.round(parseInt(substrings[2]))});
		player.sendMessage(`Second position set to ${massParticleGenerator.getSecondPosition().x}, ${massParticleGenerator.getSecondPosition().y}, ${massParticleGenerator.getSecondPosition().z}`);
		return;
	}

	massParticleGenerator.setSecondPosition({x: Math.round(player.location.x), y: Math.round(player.location.y), z: Math.round(player.location.z)});
	player.sendMessage(`Second position set to ${massParticleGenerator.getSecondPosition().x}, ${massParticleGenerator.getSecondPosition().y}, ${massParticleGenerator.getSecondPosition().z}`);
}

export function setup(player) {
	const firstPosition = massParticleGenerator.getFirstPosition();
	const secondPosition = massParticleGenerator.getSecondPosition();
	const entitySpacing = massParticleGenerator.getEntitySpacing();

	const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
	const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);
	
	massParticleGenerator.mpg_algorithm(player, tpSpacingX, tpSpacingZ, (x,z) => {spawnEntity(player, x, z)});
}

export function move(entity, mode, coordinates) {
	let x, y, z;

	if(mode === "relative") {
		x = coordinates?.x + entity.location.x;
		y = coordinates?.y + entity.location.y;
		z = coordinates?.z + entity.location.z;
	} else {
		x = coordinates?.x;
		y = coordinates?.y;
		z = coordinates?.z;
	}

	entity.teleport({x, y, z});
}