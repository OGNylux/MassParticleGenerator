import { world } from "@minecraft/server"
import { massParticleGenerator } from "./data";
import { isBetween } from "./utilityFunctions";

export function commandSelections(player, message, mode) {
    const substrings = message.split(' ');
    if(substrings[0] === "hitbox") command(player, substrings[1], `evt:${mode}_box`, parseInt(substrings[2]));
    else if(substrings[0] === "outline") command(player, substrings[1], `evt:${mode}_radius`, parseInt(substrings[2]));
}

export function command(player, mode, event, radius = 0) {
    if(mode === "radius") radiusSelection(player, radius, event);
    else if(mode === "area") areaSelection(player, event);
    else if(mode === "column") columnSelection(player, event);
    else world.sendMessage("No selection method given");
}

function radiusSelection(player, radius, event, box = false) {
    const firstPosition = massParticleGenerator.getFirstPosition();
    const secondPosition = massParticleGenerator.getSecondPosition();

    if(radius <= massParticleGenerator.maxRadius) {
        if(box) radius = 512;
        player.dimension.getEntities({
            type: massParticleGenerator.getFogEntity(),
            location: player.location,
            maxDistance: radius
        }).forEach(entity => {
            if(box) {if(isBetween(entity.location, firstPosition, secondPosition)) entity.triggerEvent(event);}
            else entity.triggerEvent(event); 
        });
    } else world.sendMessage("Radius too large!");
}

function areaSelection(player, event) {
    const firstPosition = massParticleGenerator.getFirstPosition();
    const secondPosition = massParticleGenerator.getSecondPosition();
    const entitySpacing = massParticleGenerator.getEntitySpacing();

    const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
    const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);

	massParticleGenerator.setSavedLocation(player.location);
    massParticleGenerator.mpg_algorithm(player, tpSpacingX, tpSpacingZ, () => { radiusSelection(player, 160, event, true) });
}

function columnSelection(player, event) {
    const nearestEntity = player.dimension.getEntities({
        type: massParticleGenerator.getFogEntity(),
        location: player.location,
        closest: 1,
        maxDistance: 16
    })[0];

    player.dimension.getEntities({
        type: massParticleGenerator.getFogEntity()
    })
    .forEach(entity => {
        if(entity.getDynamicProperty("tablePositionX") === nearestEntity.getDynamicProperty("tablePositionX") && entity.getDynamicProperty("tablePositionZ") === nearestEntity.getDynamicProperty("tablePositionZ")) {
            entity.triggerEvent(event);
        }
    });
}