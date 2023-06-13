# 5x5-tic-tac-toe-ai

<p align="center">
  <img width="1197" alt="image" src="https://github.com/GregoryKogan/Tic-Tac-Toe-AI/assets/60318411/d61530c4-1c87-415d-98ac-080af99f1233">
</p>

This bot is impossible to beat at 5x5 tic tac toe (I believe)

Algorthm it uses is pretty simple.

In short, the bot first considers 4 situations:
1). Is it possible to win this move, if so, then he will do so.

2). If it was not possible to win in one move, he looks to see if there are places in which the opponent can put his piece and win in the next move, if there are such places, he closes them before the opponent

3). If there are no places from cases 1 and 2, the bot considers the possibility of putting the fork, that is, win in 2 moves. Bot splits the field into 12 linear arrays (5 verticals, 5 horizontal lines and 2 diagonals) and in each linear array looks for one of 3 situations (__XX_, _XX__, _X_X_). If this is found, bot puts its figure so that it turns out _XXX_, then this is the “fork” of a clearly winning situation, no matter how human move, the bot will win the next move.

4). If the situation does not include cases 1, 2 and 3, then the bot looks for exactly the same situations that can be brought to the fork, but for enemy, and if he finds it, puts his figure so that it would be impossible to build fork in that place.

And only if none of these situations takes place, that is, if the bot cannot win now, it certainly won’t lose in the next move, it certainly cannot win in two moves and it certainly won’t lose in two turns, only then the right to choose a place for the move passed to the second algorithm.

The minimax algorithm considers all possible positions of the board that can be obtained from this position in the next turn, then all the positions that can be obtained from previous positions, etc. So he can look through absolutely all possible outcomes that can be obtained from a given position of the board and then act in such a way as to arrive at the most favorable one. But with a 5 by 5 board, there are 25! outcomes ~ 15 septillions of outcomes. It is impossible to calculate all of them, so the bot looks only 5 moves ahead and will select the event branch leading to the best outcome in 5 moves. If the situation is final, then it is easy to understand whether it is good or not. If the situation is winning, then it is good, if losing, it's bad, if the game ends in a draw, then the situation is average. But how to evaluate the success of a situation that is not the last? This is where neural networks come in. If the situation is not final, then I feed it to neural network, and it returns me a numerical assessment of this situation on a 20-point scale. Even when calculating 5 moves ahead, this is in the worst case 25 * 24 * 23 * 22 * 21 ~ 6mln situations, this is a very real number, but still too large for the algorithm to work quickly. Fortunately, there is an optimization for minimax - Alpha Beta pruning. It consists in the fact that if an event branch gives a result that is obviously worse than the best branch at the moment, then this branch does not need to be calculated. In the case of viewing 5 moves ahead, this reduces the number of calculated situations by ~ 20 times to ~ 300 thousand.

So, the bot is a minimax algorithm that takes missing values from the neural network, with optimization of Alpha Beta pruning and manual protection-check against 4 cases when you need to go unambiguously.

You can try this out here: https://gregorykogan.github.io/Tic-Tac-Toe-AI/

(IOS devices are not supported by now)
