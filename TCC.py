import serial
import json 
import requests
import cv2
import time
import base64
import http.server
import socketserver
import threading
from pyfingerprint.pyfingerprint import PyFingerprint

ser = serial.Serial('/dev/ttyACM0',115200)
f = False
finger = False
fingerprint_state = False
fingerprint1 = False
fingerprint2 = False 
## Initialize FingerPrintSensor
try:
    f = PyFingerprint('/dev/ttyS0', 57600, 0xFFFFFFFF, 0x00000000)

    if ( f.verifyPassword() == False ):
        raise ValueError('The given fingerprint sensor password is wrong!')

except Exception as e:
    print('The fingerprint sensor could not be initialized!')
    print('Exception message: ' + str(e))
    


socketserver.TCPServer.allow_reuse_address = True
class http_handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):

        if(self.path=='/status'):
            self.send_response(200)
            self.send_header('Content-type','text')
            self.send_header('Access-Control-Allow-Origin','*')
            self.end_headers()
            self.wfile.write(bytes('ok','utf-8'))
        elif(self.path=='/get_finger1'):
            self.send_response(200)
            self.send_header('Content-type','text')
            self.send_header('Access-Control-Allow-Origin','*')
            self.end_headers()
            global fingerprint_state
            global finger 
            global fingerprint1
            fingerprint_state = 'read'
            while(finger==False):
                time.sleep(1)
                pass
            self.wfile.write(bytes(str(finger),'utf-8'))
            fingerprint1 = finger
            finger=False
        elif(self.path=='/get_finger2'):
            self.send_response(200)
            self.send_header('Content-type','text')
            self.send_header('Access-Control-Allow-Origin','*')
            self.end_headers()
            global fingerprint_state
            global finger 
            global fingerprint2
            fingerprint_state = 'read'
            while(finger==False):
                time.sleep(1)
                pass
            self.wfile.write(bytes(str(finger),'utf-8'))
            fingerprint2 = finger
            finger=False
        elif(self.path=='/get_finger_template'):
            self.send_response(200)
            self.send_header('Content-type','text')
            self.send_header('Access-Control-Allow-Origin','*')
            self.end_headers()
            global fingerprint_state
            global finger 
            global fingerprint1
            fingerprint_state = 'generate_template'
            while(finger==False):
                time.sleep(1)
                pass
            self.wfile.write(bytes(str(finger),'utf-8'))
            finger=False

def worker_http():
    httpd = socketserver.ThreadingTCPServer(('',8083),http_handler)
    print('Servidor Web OK')
    httpd.serve_forever()


def worker_nfc():
        
    while True:
        read_serial = ser.readline()
        try:
            identity = json.loads(read_serial.decode('utf-8'))
            identity_bin = identity['identity']['bin']
            print(identity_bin)
            user = json.loads('{}')
            try:
                r = requests.get('http://localhost:3001/users/request_access?rfid_token='+identity_bin)
                user = r.json()
            except:
                print('failed to connect server')
                pass
            
                
            print(user)
            if('_id' in user):
                cap = cv2.VideoCapture(0)
                frame = cap.read()
                cv2.imwrite('tmpFileImage.jpg',frame[1]);
                cap.release()
                compare_face = requests.post('http://localhost:3001/users/'+str(user['_id'])+'/compare_face', files = dict(image=open('tmpFileImage.jpg','rb')))
                print(compare_face.json())
                    

        except ValueError as e:
            pass
        else:
            pass
def worker_fingerprint():
    while(True):
        global fingerprint_state
        if(fingerprint_state == 'read'):
            while ( f.readImage() == False ):
                pass
            f.convertImage(0x01)
            global finger
            finger = f.downloadCharacteristics()
            fingerprint_state = False
            time.sleep(2)
        elif(fingerprint_state=='generate_template'):
            global fingerprint1
            global fingerprint2
            f.uploadCharacteristics(0x01,fingerprint1)
            f.uploadCharacteristics(0x02,fingerprint2)
            f.createTemplate();
            finger = f.downloadCharacteristics();
            fingerprint_state = False 
            time.sleep(2)
thread_http = threading.Thread(target=worker_http)
thread_http.start()
thread_nfc = threading.Thread(target=worker_nfc)
thread_nfc.start()
thread_fingerprint = threading.Thread(target=worker_fingerprint)
thread_fingerprint.start()
