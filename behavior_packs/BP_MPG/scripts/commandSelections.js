import { world } from "@minecraft/server"
import { firstPosition, secondPosition, entitySpacing, maxRadius } from "./globalVariables";
import { isBetween } from "./utilityFunctions";

function command(player, message, event) {
	if(message) {
		const substrings = message.split(' ');
		if(substrings[0] === "radius") {
            radiusSelection(player, parseInt(substrings[1]), event);
		} else if(substrings[0] === "area") {
            areaSelection(player, event);
		} else if(substrings[0] === "column") {
            columnSelection(player, event);
		} else {
			world.sendMessage("No selection method given");
		}
	}
}

function radiusSelection(player, radius, event, box = false) {
    if(radius <= maxRadius) {
        player.dimension.getEntities({
            type: "pb:fog",
            location: player.location,
            maxDistance: radius
        }).forEach(entity => {
            if(box) if(isBetween(entity.location, firstPosition, secondPosition)) entity.triggerEvent(event);
            else entity.triggerEvent(event);
        });
    } else {
        world.sendMessage("Radius too large!");
    }
}

function areaSelection(player, event) {
    const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
    const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);

    mpg_algorithm(player, tpSpacingX, tpSpacingZ, () => { radiusSelection(player, 16, event, true) });
}

function columnSelection(player, event) {
    const nearestEntity = player.dimension.getEntities({
        type: "pb:fog",
        location: player.location,
        closest: 1,
        maxDistance: 16
    })[0];

    player.dimension.getEntities({
        type: "pb:fog"
    })
    .forEach(entity => {
        if(entity.getDynamicProperty("tablePositionX") === nearestEntity.getDynamicProperty("tablePositionX") && entity.getDynamicProperty("tablePositionZ") === nearestEntity.getDynamicProperty("tablePositionZ")) {
            entity.triggerEvent(event);
        }
    });
}