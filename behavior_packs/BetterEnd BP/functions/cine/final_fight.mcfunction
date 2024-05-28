
execute in the_end run execute as @a[scores={final_fight=0..622}] run scoreboard players add @s final_fight 1


execute in the_end run execute as @a[scores={final_fight=2}] run gamerule sendcommandfeedback false

execute in the_end run execute as @a[scores={final_fight=2}] run gamemode spectator @s
execute in the_end run execute as @a[scores={final_fight=2}] run effect @s invisibility 999 255
execute in the_end run execute as @a[scores={final_fight=2}] run inputpermission set @s camera disabled
execute in the_end run execute as @a[scores={final_fight=2}] run inputpermission set @s movement disabled

##Text
execute in the_end run execute as @a[scores={final_fight=2..80}] run titleraw @s actionbar {"rawtext":[ {"translate":"custom.text.boss.line1"}]}
execute in the_end run execute as @a[scores={final_fight=80..110}] run titleraw @s actionbar {"rawtext":[ {"translate":"custom.text.boss.line2"}]}
execute in the_end run execute as @a[scores={final_fight=110..180}] run titleraw @s actionbar {"rawtext":[ {"translate":"custom.text.boss.line3"}]}
execute in the_end run execute as @a[scores={final_fight=180..230}] run titleraw @s actionbar {"rawtext":[ {"translate":"custom.text.boss.line4"}]}
execute in the_end run execute as @a[scores={final_fight=230..280}] run titleraw @s actionbar {"rawtext":[ {"translate":"custom.text.boss.line5"}]}
execute in the_end run execute as @a[scores={final_fight=280}] run titleraw @s actionbar {"rawtext":[ {"translate":"custom.text.boss.line6"}]}

##Tping the player movement
execute in the_end run execute as @a[scores={final_fight=2}] run summon pb:pillar -41 102 0
execute in the_end run execute as @a[scores={final_fight=2}] run summon minecraft:lightning_bolt -41 102 0
execute in the_end run execute as @a[scores={final_fight=2}] run tp @s -48 104 4 facing -41 101 0
execute in the_end run execute as @a[scores={final_fight=2}] run camera @s set minecraft:free pos -48 105.7 4 facing -41 101 0
execute in the_end run execute as @a[scores={final_fight=3..59}] run camera @s set minecraft:free ease 3 linear pos -43 105.7 7 facing -41 101 0
execute in the_end run execute as @a[scores={final_fight=20}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=60}] run summon pb:pillar -33 89 24
execute in the_end run execute as @a[scores={final_fight=60}] run summon minecraft:lightning_bolt -33 89 24
execute in the_end run execute as @a[scores={final_fight=60}] run tp @s -36 91 28 facing -33 87 24
execute in the_end run execute as @a[scores={final_fight=60}] run camera @s set minecraft:free pos -36 92.7 28 facing -33 87 24
execute in the_end run execute as @a[scores={final_fight=61..121}] run camera @s set minecraft:free ease 3 linear pos -33 92.7 29 facing -33 87 24
execute in the_end run execute as @a[scores={final_fight=80}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=122}] run summon pb:pillar -12 95 39
execute in the_end run execute as @a[scores={final_fight=122}] run summon minecraft:lightning_bolt -12 95 39
execute in the_end run execute as @a[scores={final_fight=122}] run tp @s -19 97 41 facing -12 93 39
execute in the_end run execute as @a[scores={final_fight=122}] run camera @s set minecraft:free pos -19 98.7 41 facing -12 93 39
execute in the_end run execute as @a[scores={final_fight=122..182}] run camera @s set minecraft:free ease 3 linear pos -14 98.7 46 facing -12 93 39
execute in the_end run execute as @a[scores={final_fight=142}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=183}] run summon pb:pillar 12 77 39
execute in the_end run execute as @a[scores={final_fight=183}] run summon minecraft:lightning_bolt 12 77 39
execute in the_end run execute as @a[scores={final_fight=183}] run tp 9 79 44 facing 12 75 39
execute in the_end run execute as @a[scores={final_fight=183}] run camera @s set minecraft:free pos 9 80.7 44 facing 12 75 39
execute in the_end run execute as @a[scores={final_fight=184..244}] run camera @s set minecraft:free ease 3 linear pos 15 80.7 44 facing 12 75 39
execute in the_end run execute as @a[scores={final_fight=204}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=245}] run summon pb:pillar 33 92 24
execute in the_end run execute as @a[scores={final_fight=245}] run summon minecraft:lightning_bolt 33 92 24
execute in the_end run execute as @a[scores={final_fight=245}] run tp @s 37 95 30 facing 33 90 24
execute in the_end run execute as @a[scores={final_fight=245}] run camera @s set minecraft:free pos 37 96.7 30 facing 33 90 24
execute in the_end run execute as @a[scores={final_fight=245..305}] run camera @s set minecraft:free ease 3 linear pos 41 96.7 24 facing 33 90 24
execute in the_end run execute as @a[scores={final_fight=265}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=306}] run summon pb:pillar 41 98 0
execute in the_end run execute as @a[scores={final_fight=306}] run summon minecraft:lightning_bolt 41 98 0
execute in the_end run execute as @a[scores={final_fight=306}] run tp @s 47 103 7 facing 41 96 0
execute in the_end run execute as @a[scores={final_fight=306}] run camera @s set minecraft:free pos 47 104.7 7 facing 41 96 0
execute in the_end run execute as @a[scores={final_fight=306..366}] run camera @s set minecraft:free ease 3 linear pos 49 104.7 -1 facing 41 96 0
execute in the_end run execute as @a[scores={final_fight=326}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=367}] run summon pb:pillar 33 101 -24
execute in the_end run execute as @a[scores={final_fight=367}] run summon minecraft:lightning_bolt 33 101 -24
execute in the_end run execute as @a[scores={final_fight=367}] run tp @s 40 105 -26 facing 33 99 -24
execute in the_end run execute as @a[scores={final_fight=367}] run camera @s set minecraft:free pos 40 106.7 -26 facing 33 99 -24
execute in the_end run execute as @a[scores={final_fight=367..427}] run camera @s set minecraft:free ease 3 linear pos 38 106.7 -30 facing 33 99 -24
execute in the_end run execute as @a[scores={final_fight=390}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=428}] run summon pb:pillar 12 83 -39
execute in the_end run execute as @a[scores={final_fight=428}] run summon minecraft:lightning_bolt 12 83 -39
execute in the_end run execute as @a[scores={final_fight=428}] run tp @s 17 85 -43 facing 12 81 -39
execute in the_end run execute as @a[scores={final_fight=428}] run camera @s set minecraft:free pos 17 86.7 -43 facing 12 81 -39
execute in the_end run execute as @a[scores={final_fight=428..488}] run camera @s set minecraft:free ease 3 linear pos 12 86.7 -45 facing 12 81 -39
execute in the_end run execute as @a[scores={final_fight=450}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=489}] run summon pb:pillar -12 86 -39
execute in the_end run execute as @a[scores={final_fight=489}] run summon minecraft:lightning_bolt -12 86 -39
execute in the_end run execute as @a[scores={final_fight=489}] run tp @s -15 90 -45 facing -12 84 -39
execute in the_end run execute as @a[scores={final_fight=489}] run camera @s set minecraft:free pos -15 91.7 -45 facing -12 84 -39
execute in the_end run execute as @a[scores={final_fight=489..559}] run camera @s set minecraft:free ease 3 linear pos -19 91.7 -41 facing -12 84 -39
execute in the_end run execute as @a[scores={final_fight=510}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate

execute in the_end run execute as @a[scores={final_fight=560}] run summon pb:pillar -33 80 -24
execute in the_end run execute as @a[scores={final_fight=560}] run summon minecraft:lightning_bolt -33 80 -24
execute in the_end run execute as @a[scores={final_fight=560}] run tp @s -37 82 -28 facing -33 78 -24
execute in the_end run execute as @a[scores={final_fight=560}] run camera @s set minecraft:free pos -37 83.7 -28 facing -33 78 -24
execute in the_end run execute as @a[scores={final_fight=560..620}] run camera @a set minecraft:free ease 3 linear pos -39 83.7 -24 facing -33 78 -24
execute in the_end run execute as @a[scores={final_fight=580}] run event entity @e[type=pb:pillar,r=20,c=1] pb:animate




execute in the_end run execute as @a[scores={final_fight=621}] run summon pb:final_boss 0 90 0

execute in the_end run execute as @a[scores={final_fight=621}] run tp @s 0 60 -3
execute in the_end run execute as @a[scores={final_fight=621}] run gamemode survival @s
execute in the_end run execute as @a[scores={final_fight=621}] run effect @s clear
execute in the_end run execute as @a[scores={final_fight=621}] run inputpermission set @s camera enabled
execute in the_end run execute as @a[scores={final_fight=621}] run inputpermission set @s movement enabled
execute in the_end run execute as @a[scores={final_fight=621}] run camera @s clear
execute in the_end run execute as @a[scores={final_fight=622}] run scoreboard players reset @s final_fight