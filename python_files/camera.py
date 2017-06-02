from picamera import PiCamera
from time import sleep
import time
import datetime

x = datetime.datetime.now()
name = '/images/'+str(x)+'.jpg'
camera = PiCamera()
print(name)
camera.resolution = (800, 600)
camera.rotation = 180
camera.start_preview()
camera.capture('public/images/'+str(x)+'.jpg')
sleep(5)
