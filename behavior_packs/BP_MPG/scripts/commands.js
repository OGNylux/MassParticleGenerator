import { massParticleGenerator } from "./data";
import { spawnEntity } from "./utilityFunctions";

export function help(player) {
	player.sendMessage("======= HELP =======");
	player.sendMessage("pos1 [x y z] - sets the first position [optional]");
	player.sendMessage("pos2 [x y z] - sets the second position [optional]");
	player.sendMessage("fill - starts the particle fill");
	player.sendMessage("show {hitbox/outline} {area/column/radius {radius}} - shows the hitbox or outline of the selected area");
	player.sendMessage("show {hitbox/outline} {area/column/radius {radius}} - hides the hitbox or outline of the selected area");
	player.sendMessage("set {particle} {area/column/radius {radius}} - sets the particle of the selected area");
	player.sendMessage("remove {particle} {area/column/radius {radius}} - removes the particle of the selected area");
	player.sendMessage("move {relative/absolute} {coordinates} {area/column/radius {radius}} - moves the particles in the selected area");
	player.sendMessage("despawn {area/column/radius {radius}} - despawns the particles in the selected area");
    player.sendMessage("drawCube {radius} - draws a cube around the player with the given radius");
    player.sendMessage("stop - stops the particle fill");
    player.sendMessage("delay {delay} - sets the cell delay");
    player.sendMessage("columnDelay {delay} - sets the column delay");
	player.sendMessage("help - shows this message");
}

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