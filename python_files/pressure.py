from sense_hat import SenseHat

sense = SenseHat()
pressure = sense.get_pressure()
print("Pressure: %s Millibars" % pressure)

# alternatives
print(sense.pressure)
