import { world, system } from "@minecraft/server"
import { firstPosition, secondPosition, savedLocation, entitySpacing } from "./globalVariables";
import { checkDirection, sleep } from "./utilityFunctions";

let counter = 0;
let stop = false;

system.afterEvents.scriptEventReceive.subscribe((event) => {
	const {id, sourceEntity, message} = event;
	switch(id) {
		case "pb:pos1":
			setFirstPosition(sourceEntity, message);
			break;
		case "pb:pos2":
			setSecondPosition(sourceEntity, message);
			break;
		case "pb:test":
			test(sourceEntity);
			break;
		case "pb:show":
			toggleBoxes(sourceEntity, message, "evt:show_box");
			break;
		case "pb:hide":
			toggleBoxes(sourceEntity, message, "evt:hide_box");
			break;
		case "pb:update":
			updateParticles(sourceEntity, message);
			break;
	}
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
