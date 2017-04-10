This is the project of our ai game.

The game theme will be like boss fighting with simple mechanism. Similar game is old version of rockman.

There will be 2-3 bosses for the player to choose who to fight with. We need to have at least 2 to show our mechanism and the corresponding AI script logic.

Cal have finished the basic animation part and will continue the implementation. 
We need to finish the other component such as starting screen, choosing boss, AI behaviour script and end game script.

I will come up with some boss mechanism later. The first task which can be done is to introduce a starting screen and a screen with select box that allow player to choose the boss to fight with.


The web URL for our project is  https://jason99123.github.io/ai_game_program/
Correctly using the git function can allow auto update of the web. Please make use of the git.


There will be three bosses and a final boss in our game.
The first one will be the basic one. The boss will only try to avoid bullet fired by the player and and shot bullet at a fixed interval.

The second boss will require the player to use their melee skill. The behaviour of the boss is try to run away from the player. The skill is to fire a beam from the sky and shot require bullets.

The third boss will require to use their shooting skill. The behaviour of the boss to very aggressive. The main attack of the boss is melee. Enter the melee range and it will deal a heavy damage to the player. There will be two skills for the boss: charge and whirlwind. Charge is the boss rush to the player if they are on the same platform at a very high speed. Whirlwind is the boss deals damage to an area surrounding him. The best script is that the two skills will be used in combos. 

The final boss is a huge boss that will occupy the right side of the map and would not move. The map will have three height to be stood on. The boss will fire regular bullet at the player on normal behaviour. At fixed inteveral, there will be a stream of laser fired to a certain platform. Then that part of the boss will be vulenarable. When boss reach 2/3 hp, he will fire at two platform. When boss reach 1/3 hp, he will fire a continuous beam at a fixed location until the next beam attack.
To damage the boss, the only way is to hit the vulenarable location which is the three beam gun loaction.
