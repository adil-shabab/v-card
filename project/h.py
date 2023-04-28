import pyautogui

x = 1000
y= 0

while y<x:
    # Type "Hello, World!" with a 0.25 second delay between keystrokes
    pyautogui.typewrite("Hello, World!", interval=0.07)
    x+=1