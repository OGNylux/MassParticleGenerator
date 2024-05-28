import { world, system, MolangVariableMap } from "@minecraft/server"
import { massParticleGenerator } from "./data";
import { commandSelection, teleportSelection, despawnSelection } from "./commandSelections";
import { spawnEntity } from "./utilityFunctions";

let commands = {};

commands['pb:pos1'] = function(player, message) { setFirstPosition(player, message); };
commands['pb:pos2'] = function(player, message) { setSecondPosition(player, message); };
commands['pb:fill'] = function(player, message) { setup(player, message); };
commands['pb:show'] = function(player, message) { commandSelection(player, message, (entity, tag) => { entity.addTag(tag) }); };
commands['pb:hide'] = function(player, message) { commandSelection(player, message, (entity, tag) => { entity.removeTag(tag) }); };
commands['pb:set'] = function(player, message) { commandSelection(player, message, (entity, event) => { entity.triggerEvent(event) }); };
commands['pb:remove'] = function(player, message) { commandSelection(player, message, (entity, event) => { entity.triggerEvent(`remove_${event}`) }); };
commands['pb:move'] = function(player, message) { teleportSelection(player, message, (entity, coordinates) => { move(entity, message.split(' ')[0], coordinates) }); };
commands['pb:despawn'] = function(player, message) { despawnSelection(player, message, (entity, event) => { entity.remove() }); };
commands['pb:drawCube'] = function(player, message) { drawCube(player, message); };

system.afterEvents.scriptEventReceive.subscribe((event) => {
	const {id, sourceEntity, message} = event;
	if (typeof commands[id] == 'function') {
		commands[id](sourceEntity, message);
		return;
	}
})

function move(entity, mode, coordinates) {
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

function drawCubes() {
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

drawCubes();

function setFirstPosition(player, message) { 
	if(message) {
		const substrings = message.split(' ');
		if(substrings.length !== 3) {
			world.sendMessage("Expected 3 arguments, got " + substrings.length);
			return;
		}
		massParticleGenerator.setFirstPosition({x: Math.round(parseInt(substrings[0])), y: Math.round(parseInt(substrings[1])), z: Math.round(parseInt(substrings[2]))});
		world.sendMessage(`First position set to ${massParticleGenerator.getFirstPosition().x}, ${massParticleGenerator.getFirstPosition().y}, ${massParticleGenerator.getFirstPosition().z}`);
		return;
	}

	massParticleGenerator.setFirstPosition({x: Math.round(player.location.x), y: Math.round(player.location.y), z: Math.round(player.location.z)});
	world.sendMessage(`First position set to ${massParticleGenerator.getFirstPosition().x}, ${massParticleGenerator.getFirstPosition().y}, ${massParticleGenerator.getFirstPosition().z}`);
}

function setSecondPosition(player, message) {
	if(message) {
		const substrings = message.split(' ');
		if(substrings.length !== 3) {
			world.sendMessage("Expected 3 arguments, got " + substrings.length);
			return;
		}
		massParticleGenerator.setSecondPosition({x: Math.round(parseInt(substrings[0])), y: Math.round(parseInt(substrings[1])), z: Math.round(parseInt(substrings[2]))});
		world.sendMessage(`Second position set to ${massParticleGenerator.getSecondPosition().x}, ${massParticleGenerator.getSecondPosition().y}, ${massParticleGenerator.getSecondPosition().z}`);
		return;
	}

	massParticleGenerator.setSecondPosition({x: Math.round(player.location.x), y: Math.round(player.location.y), z: Math.round(player.location.z)});
	world.sendMessage(`Second position set to ${massParticleGenerator.getSecondPosition().x}, ${massParticleGenerator.getSecondPosition().y}, ${massParticleGenerator.getSecondPosition().z}`);
}

function setup(player) {
	const firstPosition = massParticleGenerator.getFirstPosition();
	const secondPosition = massParticleGenerator.getSecondPosition();
	const entitySpacing = massParticleGenerator.getEntitySpacing();

	const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
	const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);
	
	massParticleGenerator.setSavedLocation(player.location);
	massParticleGenerator.mpg_algorithm(player, tpSpacingX, tpSpacingZ, (x,z) => {spawnEntity(player, x, z)});
}

function drawCube(entity, radiusString) {
	const radius = parseFloat(radiusString);

	spawnParticle(entity, radius, 0, -radius, 0, 'pb:square_marker');
	spawnParticle(entity, radius, 0, radius, 0, 'pb:square_marker');

	spawnParticle(entity, radius, radius, 0, 0, 'pb:square_marker_vertical', 90);
	spawnParticle(entity, radius, -radius, 0, 0, 'pb:square_marker_vertical', 90);
	spawnParticle(entity, radius, 0, 0, radius, 'pb:square_marker_vertical');
	spawnParticle(entity, radius, 0, 0, -radius, 'pb:square_marker_vertical');
}

function spawnParticle(entity, radius, offsetX, offsetY, offsetZ, particleType, angle = 0) {
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
