import { system } from "@minecraft/server"

let counter = 1;

class MassParticleGenerator {
    fogEntity = "pb:biome_detector"
    cellDelay = 5;
    columnDelay = 10;
    firstPosition = {};
    secondPosition = {};
    entitySpacing = 30;
    maxRadius = 160;
    stop = false;
    
    async mpg_algorithm(player, maxX, maxZ, func) {
        counter = 1;
        this.stop = false;

        const savedGameMode = player.getGameMode();
        const savedLocation = player.location;
        const directionX = checkDirection(this.firstPosition.x, this.secondPosition.x);
        const directionZ = checkDirection(this.firstPosition.z, this.secondPosition.z);
        const yPosition = Math.abs(this.secondPosition.y - this.firstPosition.y) / 2 + Math.min(this.firstPosition.y, this.secondPosition.y);

        player.setGameMode("spectator");
        player.teleport({x: this.firstPosition.x + directionX * (this.entitySpacing / 2), y: yPosition, z: this.firstPosition.z + directionZ * (this.entitySpacing / 2)});

        for (let z = 0; z < maxZ; z++) {
            await sleep(this.columnDelay);
            for (let x = 0; x < maxX; x++) {
                if(this.stop) { player.teleport(savedLocation); player.setGameMode(savedGameMode); return; }
                let percentage = Number((counter / (maxX * maxZ))*100).toFixed(3);
                player.onScreenDisplay.setActionBar(`finished row (${x+1}/${maxX}) of column (${z+1}/${maxZ}) (${percentage}%/100%)`);
                player.onScreenDisplay.setTitle("MGP IS RUNNING", {
                    stayDuration: 2,
                    fadeInDuration: 0,
                    fadeOutDuration: 2,
                    subtitle: "use /scriptevent pb:stop to stop MGP"
                });
                await sleep(this.cellDelay);
                func(x,z);
                player.teleport({x: player.location.x + directionX * this.entitySpacing, y: yPosition, z: player.location.z});

                counter++;
            }
            player.teleport({x: player.location.x - directionX * (this.entitySpacing * maxX), y: yPosition, z: player.location.z + directionZ * this.entitySpacing});
        }
        player.teleport(savedLocation);
        player.setGameMode(savedGameMode);
    }

    getFogEntity() {
        return this.fogEntity;
    }

    getFirstPosition() {
        return this.firstPosition;
    }
    
    getSecondPosition() {
        return this.secondPosition;
    }

    getEntitySpacing() {
        return this.entitySpacing;
    }

    getMaxRadius() {
        return this.maxRadius;
    }

    getCellDelay() {
        return this.cellDelay;
    }

    getColumnDelay() {
        return this.columnDelay;
    }

    setFirstPosition(position) {
        this.firstPosition = position;
    }

    setSecondPosition(position) {
        this.secondPosition = position;
    }

    setEntitySpacing(spacing) {
        this.entitySpacing = spacing;
    }

    setStop(stop) {
        this.stop = stop;
    }

    setCellDelay(delay) {
        this.cellDelay = delay;
    }

    setColumnDelay(delay) {
        this.columnDelay = delay;
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

let massParticleGenerator = new MassParticleGenerator();

export { massParticleGenerator }