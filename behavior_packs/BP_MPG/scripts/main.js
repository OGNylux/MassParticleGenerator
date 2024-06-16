import { system } from "@minecraft/server"
import { massParticleGenerator } from "./data";
import { commandSelection, teleportSelection, despawnSelection } from "./commandSelections";
import { setFirstPosition, setSecondPosition, setup, move, help } from "./commands";
import { drawCubes, drawCube } from "./utilityFunctions";

let commands = {};

commands['pb:pos1'] = function(player, message) { setFirstPosition(player, message); };
commands['pb:pos2'] = function(player, message) { setSecondPosition(player, message); };
commands['pb:fill'] = function(player, message) { setup(player, message); };
commands['pb:show'] = function(player, message) { commandSelection(player, message, (entity, tag) => { entity.addTag(tag) }); };
commands['pb:hide'] = function(player, message) { commandSelection(player, message, (entity, tag) => { entity.removeTag(tag) }); };
commands['pb:set'] = function(player, message) { commandSelection(player, message, (entity, event) => { entity.triggerEvent(event) }); };
commands['pb:remove'] = function(player, message) { commandSelection(player, message, (entity, event) => { entity.triggerEvent(`remove_${event}`) }); };
commands['pb:move'] = function(player, message) { teleportSelection(player, message, (entity, coordinates) => { move(entity, message.split(' ')[0], coordinates) }); };
commands['pb:despawn'] = function(player, message) { despawnSelection(player, message, (entity, event) => { entity.triggerEvent('remove_all'); entity.remove(); }); };
commands['pb:drawCube'] = function(player, message) { drawCube(player, message); };
commands['pb:stop'] = function(player, message) { massParticleGenerator.setStop(true); };
commands['pb:delay'] = function(player, message) { massParticleGenerator.setCellDelay(message); player.sendMessage(`Cell delay set to ${massParticleGenerator.getCellDelay()}`); };
commands['pb:columnDelay'] = function(player, message) { massParticleGenerator.setColumnDelay(message); player.sendMessage(`Column delay set to ${massParticleGenerator.getColumnDelay()}`); };
commands['pb:help'] = function(player, message) { help(player); };

system.afterEvents.scriptEventReceive.subscribe((event) => {
	const {id, sourceEntity, message} = event;
	if (typeof commands[id] == 'function') {
		commands[id](sourceEntity, message);
		return;
	}
})

drawCubes();
