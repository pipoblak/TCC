import serial
import json 
import requests
import cv2
import time
import base64
import http.server
import socketserver
import threading
import ast
from pyfingerprint.pyfingerprint import PyFingerprint
import RPi.GPIO as gpio 
gpio.setmode(gpio.BCM)
gpio.setwarnings(False)
gpio.setup(21,gpio.OUT)

ser = serial.Serial('/dev/ttyACM0',115200)
f = False
finger = False
fingerprint_state = False
fingerprint1 = False
fingerprint2 = False 
finger_comparisson = False
RFID = True
Resource_ID = 1
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
        elif(self.path=='/getRFID'):
                    self.send_response(200)
                    self.send_header('Content-type','text')
                    self.send_header('Access-Control-Allow-Origin','*')
                    self.end_headers()
                    global RFID
                    RFID=False
                    time.sleep(5);
                    self.wfile.write(bytes(str(RFID),'utf-8'))

def worker_http():
    httpd = socketserver.ThreadingTCPServer(('',8083),http_handler)
    print('Servidor Web OK')
    httpd.serve_forever()


def worker_rfid():
        
    while True:
        read_serial = ser.readline()
        try:
            identity = json.loads(read_serial.decode('utf-8'))
            identity_bin = identity['identity']['bin']
            global RFID
            
            if(RFID!=False):
                print(identity_bin)
                user = json.loads('{}')
                try:
                    r = requests.get('http://localhost:3001/users/request_access?rfid_token='+identity_bin)
                    user = r.json()
                except:
                    print('failed to connect server')
                    pass
                if('_id' in user):
                    has_permission = requests.get('http://localhost:3001/user_resources/has_permission?resource_id='+str(Resource_ID)+'&user_id='+ str(user['_id']))
                    if(has_permission.json()):
                        cap = cv2.VideoCapture(0)
                        frame = cap.read()
                        cv2.imwrite('tmpFileImage.jpg',frame[1]);
                        cap.release()
                        compare_face = requests.post('http://localhost:3001/users/'+str(user['_id'])+'/compare_face', files = dict(image=open('tmpFileImage.jpg','rb')))
                        try:
                            if(compare_face.json()>=50):
                                gpio.output(21,True)
                                time.sleep(2)
                                gpio.output(21,False)
                            else:
                                global fingerprint_state
                                global finger_comparisson
                                global fingerprint1
                                global fingerprint2
                                global finger
                                finger = False
                                fingerprint_state = 'read'
                                print('Inserir Dedo')
                                while(finger==False):
                                    time.sleep(1)
                                    pass
                                fingerprint1 = finger
                                fingerprint2 = ast.literal_eval(user['biometric_bin'])
                                fingerprint_state = 'compare_with_readed'
                                while(fingerprint_state!=False):
                                    time.sleep(1)
                                    pass
                                print(finger_comparisson)
                                if(finger_comparisson>=2):
                                    gpio.output(21,True)
                                    time.sleep(2)
                                    gpio.output(21,False)
                                else:
                                    print('failed fingerprint')
                                finger_comparisson = False


                        except:
                            print('imagem nao processada')
                    else:
                        print('Acesso Negado')
            RFID = identity_bin
        except ValueError as e:
            pass
        else:
            pass
def worker_fingerprint():
    global fingerprint_state
    global finger
    global fingerprint1
    global fingerprint2
    global finger_comparisson
    while(True):
        if(fingerprint_state == 'read'):
            while ( f.readImage() == False ):
                pass
            f.convertImage(0x01)
            finger = f.downloadCharacteristics()
            fingerprint_state = False
            time.sleep(2)
        elif(fingerprint_state=='generate_template'):
            f.uploadCharacteristics(0x01,fingerprint1)
            f.uploadCharacteristics(0x02,fingerprint2)
            f.createTemplate();
            finger = f.downloadCharacteristics();
            fingerprint_state = False 
            time.sleep(2)
        elif(fingerprint_state=='compare_with_readed'):
            f.uploadCharacteristics(0x01,fingerprint1)
            f.uploadCharacteristics(0x02,fingerprint2)
            print(fingerprint1)
            finger_comparisson = f.compareCharacteristics();
            fingerprint_state = False 
            time.sleep(2)
        time.sleep(0.5)
thread_http = threading.Thread(target=worker_http)
thread_http.start()
thread_rfid = threading.Thread(target=worker_rfid)
thread_rfid.start()
thread_fingerprint = threading.Thread(target=worker_fingerprint)
thread_fingerprint.start()