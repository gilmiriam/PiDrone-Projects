from sense_hat import SenseHat
sense = SenseHat()

h = sense.get_humidity()

h = round(h, 1)

print(h)