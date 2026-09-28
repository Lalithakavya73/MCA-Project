import os 
import tkinter as tk 
from tkinter import ttk, messagebox 
from PIL import Image, ImageTk 
import webbrowser 
 
class BlackSpotApp(tk.Tk): 
    def __init__(self): 
        super().__init__() 
        self.title("Black Spot Detection") 
        self.geometry("900x600") 
        self.resizable(False, False) 
        self.home_page() 
 
    def home_page(self): 
        frame = tk.Frame(self)  
        frame.pack(expand=True, fill="both") 
 
        # Load and set background image 
        bg_image_path = "homepage_background.png" 
        if os.path.exists(bg_image_path): 
            image = Image.open(bg_image_path) 
            image = image.resize((900, 600), Image.Resampling.LANCZOS) 
            self.bg_image = ImageTk.PhotoImage(image) 
            bg_label = tk.Label(frame, image=self.bg_image) 
            bg_label.place(x=0, y=0, relwidth=1, relheight=1) 
        else: 
            messagebox.showerror("Error", f"{bg_image_path} not found.") 

        # Optional heading (leave empty or set text) 
        heading = tk.Label(frame, text="", font=("Poppins", 20, "bold"), fg="black", bg="white") 
        heading.place(relx=0.5, y=80, anchor="center") 
 
        # Buttons 
        button_frame = tk.Frame(frame, bg="white") 
        button_frame.place(relx=0.5, rely=0.6, anchor="center") 
 
        style = ttk.Style() 
        style.configure("Custom.TButton", font=("Poppins", 12), padding=10) 

        proceed_btn = ttk.Button(button_frame, text="PROCEED", command=self.open_index_page, style="Custom.TButton") 
        proceed_btn.grid(row=0, column=0, padx=10) 

        exit_btn = ttk.Button(button_frame, text="EXIT", command=self.quit, style="Custom.TButton") 
        exit_btn.grid(row=0, column=1, padx=10) 
 
    def open_index_page(self): 
        html_path = os.path.abspath("index.html") 
        if os.path.exists(html_path): 
            try:
                # Try to open in Google Chrome 
                chrome_path = "C:/Program Files/Google/Chrome/Application/chrome.exe %s"
                webbrowser.get(chrome_path).open(f"file://{html_path}") 
            except webbrowser.Error:
                # If Chrome not found, open in default browser 
                webbrowser.open(f"file://{html_path}") 
                self.quit() 
        else: 
            messagebox.showerror("Error", "index.html not found.") 
 
if __name__ == "__main__": 
    app = BlackSpotApp() 
    app.mainloop() 