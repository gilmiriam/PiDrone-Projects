from sense_hat import SenseHat
sense = SenseHat()

t = sense.get_temperature()

t = round(t, 1)

print(t)