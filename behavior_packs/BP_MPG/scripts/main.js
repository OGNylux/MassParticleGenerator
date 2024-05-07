import { world, system } from "@minecraft/server"

let firstPosition = {};
let secondPosition = {};
let savedLocation = {};

const entitySpacing = 32;
let worldHeight = 256;
let counter = 0;
let stop = false;

system.afterEvents.scriptEventReceive.subscribe((event) => {
	const {id, sourceEntity, message} = event;
	if(id === "pb:pos1") setFirstPosition(sourceEntity, message);
	if(id === "pb:pos2") setSecondPosition(sourceEntity, message);
	if(id === "pb:test") test(sourceEntity);
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
	
	savedLocation = player.location
	counter = 0;
	stop = false;

	mpg_algorithm(player, tpSpacingX, tpSpacingZ);
}

async function mpg_algorithm(player, maxX, maxZ) {
	const directionX = checkDirection(firstPosition.x, secondPosition.x);
	const directionZ = checkDirection(firstPosition.z, secondPosition.z);

	player.teleport({x: firstPosition.x + directionX * (entitySpacing / 2), y: firstPosition.y + (entitySpacing/2), z: firstPosition.z + directionZ * (entitySpacing / 2)});

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
			spawnEntity(player);
			await sleep(5);
            player.teleport({x: player.location.x + directionX * entitySpacing, y: player.location.y, z: player.location.z});
		
			counter++
		}
        player.teleport({x: player.location.x - directionX * (entitySpacing * maxX), y: player.location.y, z: player.location.z + directionZ * entitySpacing});	
	}
}

function spawnEntity(player) {
	for(let i = 0; i < worldHeight; i+=entitySpacing) {
		world.getDimension("overworld").spawnEntity("pb:fog", {x: player.location.x, y: i, z: player.location.z});
		world.sendMessage(`successfully spawned entity at ${player.location.x}, ${i}, ${player.location.z}`);
	}
}

function checkDirection(x, y) {
	const result = y - x;	
	if(result < 0) return -1;
	return 1;
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
