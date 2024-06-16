import { massParticleGenerator } from "./data";
import { isBetween } from "./utilityFunctions";

export function commandSelection(player, message, func) {
    const substrings = message.split(' ');
    command(player, substrings[1], substrings[0], func, parseInt(substrings[2]));
}

export function teleportSelection(player, message, func) {
    const substrings = message.split(' ');
    command(player, substrings[4], {x: parseInt(substrings[1]), y: parseInt(substrings[2]), z: parseInt(substrings[3])}, func, parseInt(substrings[5]));
}

export function despawnSelection(player, message, func) {
    const substrings = message.split(' ');
    command(player, substrings[0], "", func, parseInt(substrings[1]));
}

function command(player, mode, event, func, radius = 0) {
    if(mode === "radius") radiusSelection(player, radius, event, func);
    else if(mode === "area") areaSelection(player, event, func);
    else if(mode === "column") columnSelection(player, event, func);
    else player.sendMessage("No selection method given");
}

function radiusSelection(player, radius, event, func, box = false) {
    const firstPosition = massParticleGenerator.getFirstPosition();
    const secondPosition = massParticleGenerator.getSecondPosition();

    if(radius <= massParticleGenerator.maxRadius) {
        if(box) radius = 512;
        player.dimension.getEntities({
            type: massParticleGenerator.getFogEntity(),
            location: player.location,
            maxDistance: radius
        }).forEach(entity => {
            if(box) {if(isBetween(entity.location, firstPosition, secondPosition)) func(entity, event);}
            else func(entity, event); 
        });
    } else player.sendMessage("Radius too large!");
}

function areaSelection(player, event, func) {
    const firstPosition = massParticleGenerator.getFirstPosition();
    const secondPosition = massParticleGenerator.getSecondPosition();
    const entitySpacing = massParticleGenerator.getEntitySpacing();

    const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
    const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);

    massParticleGenerator.mpg_algorithm(player, tpSpacingX, tpSpacingZ, () => { radiusSelection(player, 160, event, func, true) });
}

function columnSelection(player, event, func) {
    const nearestEntity = player.dimension.getEntities({
        type: massParticleGenerator.getFogEntity(),
        location: player.location,
        closest: 1,
        maxDistance: 16
    })[0];

    const tablePositionX = nearestEntity.getDynamicProperty("tablePositionX");
    const tablePositionZ = nearestEntity.getDynamicProperty("tablePositionZ");

    player.dimension.getEntities({
        type: massParticleGenerator.getFogEntity()
    })
    .forEach(entity => {
        if(entity.getDynamicProperty("tablePositionX") === tablePositionX && entity.getDynamicProperty("tablePositionZ") === tablePositionZ) {
            func(entity, event);
        }
    });
}