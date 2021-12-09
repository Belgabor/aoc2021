from PIL import Image, ImageDraw, ImageColor
from pprint import pprint
import math

data = open('data.txt', 'r')
lines = data.readlines()

values = []

for line in lines:
    values.append(list(map(int, list(line.strip()))))

img = Image.new(mode = 'RGB', size=(len(values[0]), len(values)))
pixels = img.load()

for y in range(len(values)):
    for x in range(len(values[0])):
        col = math.ceil((values[y][x] * 255) / 9)
        pixels[x, y] = (col, col, col)

img.show()
