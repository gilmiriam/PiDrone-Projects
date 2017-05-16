#!/usr/bin/python
 
import time
import picamera
 
with picamera.PiCamera() as picx:
	picx.start_preview()
	picx.start_recording('mi_video.h264')
        picx.wait_recording(20)
        picx.stop_recording()
	picx.stop_preview()
	picx.close()