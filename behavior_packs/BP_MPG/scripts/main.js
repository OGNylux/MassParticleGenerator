import { world, system } from "@minecraft/server"
import { firstPosition, secondPosition, savedLocation, entitySpacing } from "./globalVariables";

let counter = 0;
let stop = false;

system.afterEvents.scriptEventReceive.subscribe((event) => {
	const {id, sourceEntity, message} = event;
	if(id === "pb:pos1") setFirstPosition(sourceEntity, message);
	else if(id === "pb:pos2") setSecondPosition(sourceEntity, message);
	else if(id === "pb:test") test(sourceEntity);
	else if(id === "pb:show") toggleBoxes(sourceEntity, message, "evt:show_box");
	else if(id === "pb:hide") toggleBoxes(sourceEntity, message, "evt:hide_box");
	else if(id === "pb:update") updateParticles(sourceEntity, message);
})

function setFirstPosition(player, message) { 
	if(message) {
		const substrings = message.split(' ');
		if(substrings.length !== 3) {
			world.sendMessage("Expected 3 arguments, got " + substrings.length);
			return;
		}
		firstPosition = {x: parseInt(substrings[0]), y: parseInt(substrings[1]), z: parseInt(substrings[2])};
		world.sendMessage(`First position set to ${firstPosition.x}, ${firstPosition.y}, ${firstPosition.z}`);
		return;
	}

	firstPosition = player.location;
	world.sendMessage(`First position set to ${Math.floor(firstPosition.x)}, ${Math.floor(firstPosition.y)}, ${Math.floor(firstPosition.z)}`);
}

function setSecondPosition(player, message) {
	if(message) {
		const substrings = message.split(' ');
		if(substrings.length !== 3) {
			world.sendMessage("Expected 3 arguments, got " + substrings.length);
			return;
		}
		secondPosition = {x: parseInt(substrings[0]), y: parseInt(substrings[1]), z: parseInt(substrings[2])};
		world.sendMessage(`First position set to ${secondPosition.x}, ${secondPosition.y}, ${secondPosition.z}`);
		return;
	}

	secondPosition = player.location;
	world.sendMessage(`Second position set to ${Math.floor(secondPosition.x)}, ${Math.floor(secondPosition.y)}, ${Math.floor(secondPosition.z)}`);
}

function test(player) {
	const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
	const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);
	
	savedLocation = player.location;
	counter = 0;
	stop = false;

	mpg_algorithm(player, tpSpacingX, tpSpacingZ, (x,z) => {spawnEntity(player, x, z)});
}

function toggleBoxes(player, message, event) {
	if(message) {
		const substrings = message.split(' ');
		if(substrings[0] === "radius") {
			if(substrings[1] <= 90) {
				toggleBoxEvent(player, parseInt(substrings[1]), false, event);	
			} else {
				world.sendMessage("Radius too large!");
			}
		} else if(substrings[0] === "area") {
			const tpSpacingX = Math.floor(Math.abs(secondPosition.x - firstPosition.x) / entitySpacing);
			const tpSpacingZ = Math.floor(Math.abs(secondPosition.z - firstPosition.z) / entitySpacing);

			mpg_algorithm(player, tpSpacingX, tpSpacingZ, () => {toggleBoxEvent(player, 16, true, event)});
		} else if(substrings[0] === "column") {
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
					entity.triggerEvent(mode);
				}
			});
		} else {
			world.sendMessage("No selection method given");
		}
	}
}

function toggleBoxEvent(player, radius, box = false, event) {
	player.dimension.getEntities({
		type: "pb:fog",
		location: player.location,
		maxDistance: radius
	}).forEach(entity => {
		if(box) {
			if(isBetween(entity.location, firstPosition, secondPosition)) {
				entity.triggerEvent(event);
			}
		} else {
			entity.triggerEvent(event);
		}
	});
}

async function mpg_algorithm(player, maxX, maxZ, func) {
	const directionX = checkDirection(firstPosition.x, secondPosition.x);
	const directionZ = checkDirection(firstPosition.z, secondPosition.z);
	const yPosition = Math.abs(secondPosition.y - firstPosition.y) / 2 + Math.min(firstPosition.y, secondPosition.y);

	player.teleport({x: firstPosition.x + directionX * (entitySpacing / 2), y: yPosition, z: firstPosition.z + directionZ * (entitySpacing / 2)});

	for (let z = 0; z < maxZ; z++) {
		for (let x = 0; x < maxX; x++) {
			if(stop) { player.teleport(savedLocation); return; }
			let percentage = Number((counter / (maxX * maxZ))*100).toFixed(3);
            player.onScreenDisplay.setActionBar(`finished row (${x+1}/${maxX}) of column (${z+1}/${maxZ}) (${percentage}%/100%)`);
			player.onScreenDisplay.setTitle("MGP IS RUNNING", {
				stayDuration: 2,
				fadeInDuration: 0,
				fadeOutDuration: 0,
				subtitle: "use !stop to stop MGP"
			});
			func(x,z);
			await sleep(5);
            player.teleport({x: player.location.x + directionX * entitySpacing, y: yPosition, z: player.location.z});
		
			counter++;
		}
        player.teleport({x: player.location.x - directionX * (entitySpacing * maxX), y: yPosition, z: player.location.z + directionZ * entitySpacing});	
	}
}

function spawnEntity(player, x, z) {
	const minY = Math.min(firstPosition.y, secondPosition.y);
	const maxY = Math.max(firstPosition.y, secondPosition.y);

	for(let i = minY; i < maxY; i+=entitySpacing) {
		const entity = world.getDimension("overworld").spawnEntity("pb:fog", {x: player.location.x, y: i, z: player.location.z});
		entity.setDynamicProperty("tablePositionX", x);
		entity.setDynamicProperty("tablePositionZ", z);
	}
}

function checkDirection(x, y) {
	const result = y - x;	
	if(result < 0) return -1;
	return 1;
}

const isBetween = (entityLocation, firstLocation, secondLocation) => {
	world.sendMessage(`entityLocationx: ${entityLocation.x}, firstLocation: ${firstLocation.x}, secondLocation: ${secondLocation.x}`);
	world.sendMessage(`entityLocationz: ${entityLocation.z}, firstLocation: ${firstLocation.z}, secondLocation: ${secondLocation.z}`);
	world.sendMessage(`entityLocationy: ${entityLocation.y}, firstLocation: ${firstLocation.y}, secondLocation: ${secondLocation.y}`);
	return entityLocation.x.between(firstLocation.x, secondLocation.x, true) && entityLocation.z.between(firstLocation.z, secondLocation.z, true) && entityLocation.y.between(firstLocation.y, secondLocation.y, true);
}

Number.prototype.between = function(a, b, inclusive) {
  let min = Math.min(a, b),
      max = Math.max(a, b);

  return inclusive ? this >= min && this <= max : this > min && this < max;
}

function sleep(ticks) {
    return new Promise(resolve => {
        system.run(function runnable() {
            if (ticks-- > 0)
                system.run(runnable);
            else
                resolve();
        })
    })
}
