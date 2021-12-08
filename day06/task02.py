from pprint import pprint
import numpy as np
import sys

# Note: failed attempt

data = open('data.txt', 'r')
lines = data.readlines()

#fish = np.array(list(map(int, lines[0].split(','))))
#
#for i in range(256):
#    print(i)
#    fish_length = len(fish)
#    new_fish = []
#    for fish_index in range(fish_length):
#        if fish[fish_index] == 0:
#            fish[fish_index] = 6
#            new_fish.append(8)
#        else:
#            fish[fish_index] = fish[fish_index]-1
#    fish = np.concatenate((fish, np.array(new_fish)))

#print(fish.size)

fish = ''.join(lines[0].split(','))
print(fish)
zero = ord('0')

#sys.exit()

for i in range(256):
    print(i)
    fish_length = len(fish)
    new_fish = ''
    fish_redone = ''
    for fish_index in range(fish_length):
        fish_state = ord(fish[fish_index]) - zero
        if fish_state == 0:
            fish_redone += '6'
            new_fish += '8'
        else:
            fish_redone += chr(zero + fish_state - 1)
    fish = fish_redone + new_fish

print(len(fish))