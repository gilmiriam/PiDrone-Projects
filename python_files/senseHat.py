from sense_hat import SenseHat
sense = SenseHat()

t = sense.get_temperature()
p = sense.get_pressure()
h = sense.get_humidity()

t = round(t, 1)
p = round(p, 1)
h = round(h, 1)

print(t,p,h)