# Mass Particle Generator (MPG) - Minecraft Bedrock Particle Generator

## Project Overview
### Table of Contents
1. Project Description
2. Feature List
3. Setup

### Project Description
MPG is a script that allows you to generate particles in a mass amount.

#### Feature List

| Number | Feature                                                                              | Description                                       | 
|--------|--------------------------------------------------------------------------------------|---------------------------------------------------|
| 1      | /scriptevent pb:pos1 [x y z]                                                         | Sets the first position [optional]                |
| 2      | /scriptevent pb:pos2 [x y z]                                                         | Sets the second position [optional]               |
| 3      | /scriptevent pb:fill                                                                 | Starts the particle fill                          |
| 3      | /scriptevent pb:show {hitbox/outline} {area/column/radius {radius}}                  | Shows the hitbox or outline of the selected area  |
| 3      | /scriptevent pb:hide {hitbox/outline} {area/column/radius {radius}}                  | Hides the hitbox or outline of the selected area  |
| 3      | /scriptevent pb:set {particle} {area/column/radius {radius}}                         | Sets the particle of the selected area            |
| 3      | /scriptevent pb:remove {particle} {area/column/radius {radius}}                      | Removes the particle of the selected area         |
| 3      | /scriptevent pb:move {relative/absolute} {coordinates} {area/column/radius {radius}} | Moves the particles in the selected area"         |
| 3      | /scriptevent pb:despawn {area/column/radius {radius}}                                | Despawns the particles in the selected area       |
| 3      | /scriptevent pb:stop                                                                 | Stops the particle fill                           |
| 3      | /scriptevent pb:delay {delay}                                                        | Sets the cell delay                               |
| 3      | /scriptevent pb:columnDelay {delay}                                                  | Sets the column delay                             |
| 6      | /scriptevent pb:help                                                                 | Shows this explanation in game                    |

## Setup

1. Clone this repository and copy the folders in the resource and behavior packs folders of the world. The folder structure should look like this
```
\minecraftWorlds\MPG-Test\behavior_packs\BP_MPG
\minecraftWorlds\MPG-Test\resource_packs\RP_MPG
```
3. Activate the behavior and resource pack in their respective tabs
4. Set the xyz dimensions and start the algorithm
