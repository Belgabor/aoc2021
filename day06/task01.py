from pprint import pprint

data = open('data.txt', 'r')
lines = data.readlines()

fish = list(map(int, lines[0].split(',')))

for i in range(80):
    print(i)
    fish_length = len(fish)
    for fish_index in range(fish_length):
        if fish[fish_index] == 0:
            fish[fish_index] = 6
            fish.append(8)
        else:
            fish[fish_index] = fish[fish_index]-1

print(len(fish))
