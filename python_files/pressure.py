from sense_hat import SenseHat
sense = SenseHat()

p = sense.get_pressure()

p = round(p, 1)

print(p)