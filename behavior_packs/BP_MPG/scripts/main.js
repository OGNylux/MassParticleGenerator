import { world, system } from "@minecraft/server"
import { massParticleGenerator } from "./data";
import { command } from "./commandSelections";
import { spawnEntity } from "./utilityFunctions";

let commands = {};

commands['pb:pos1'] = function(player, message) { setFirstPosition(player, message); };
commands['pb:pos2'] = function(player, message) { setSecondPosition(player, message); };
commands['pb:test'] = function(player, message) { test(player); };
commands['pb:show'] = function(player, message) { command(player, message, "evt:show_box"); };
commands['pb:hide'] = function(player, message) { command(player, message, "evt:hide_box"); };
commands['pb:update'] = function(player, message) { updateParticles(player, message); };

system.afterEvents.scriptEventReceive.subscribe((event) => {
	const {id, sourceEntity, message} = event;
	if (typeof commands[id] == 'function') {
		commands[id](sourceEntity, message);
		return;
	}
})

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
		world.sendMessage(`First position set to ${massParticleGenerator.getSecondPosition().x}, ${massParticleGenerator.getSecondPosition().y}, ${massParticleGenerator.getSecondPosition().z}`);
		return;
	}

	massParticleGenerator.setSecondPosition({x: Math.round(player.location.x), y: Math.round(player.location.y), z: Math.round(player.location.z)});
	world.sendMessage(`First position set to ${massParticleGenerator.getSecondPosition().x}, ${massParticleGenerator.getSecondPosition().y}, ${massParticleGenerator.getSecondPosition().z}`);
}

function test(player) {
	const firstPosition = massParticleGenerator.getFirstPosition();
	const secondPosition = massParticleGenerator.getSecondPosition();
	const entitySpacing = massParticleGenerator.getEntitySpacing();

	const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
	const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);
	
	massParticleGenerator.setSavedLocation(player.location);
	massParticleGenerator.mpg_algorithm(player, tpSpacingX, tpSpacingZ, (x,z) => {spawnEntity(player, x, z)});
}
