import pyautogui

# Move the mouse to a specific position
pyautogui.moveTo(100, 100)

x = 100000
y= 0

while y<x:
    # Type "Hello, World!" with a 0.25 second delay between keystrokes
    pyautogui.typewrite("Hello, World!", interval=0.05)
    x+=1