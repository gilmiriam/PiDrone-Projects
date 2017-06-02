import time
import datetime

x = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
name = '/video/'+str(x)+'.mp4'
print(name)