#!/bin/sh

import time
import datetime
import picamera
import re
from subprocess import call
import sys

#lines = sys.stdin.readlines()

regex = re.findall(r"/(\d+_\d+)",sys.argv[0])

with picamera.PiCamera() as camera:
    filename='public/video/'+str(regex)+'.h264'
    filenameout='public/video/'+str(regex)+'.mp4'
    camera.rotation = 180
    camera.framerate = 24
    camera.start_recording(filename)
    camera.wait_recording(10)
    camera.stop_recording()
    
command = "ffmpeg -framerate 10 -i "+ filename+" -vcodec copy "+ filenameout
#command = "MP4Box -add " + filename+" -fps 24 "+filenameout
call ([command], shell=True)
borrar = "rm "+filename
call ([borrar], shell=True)
 
#subprocess.Popen(["MP4Box", "-fps 30","-add", str(filename), str(filenameout)])
#subprocess.call(["rm", str(filename)])