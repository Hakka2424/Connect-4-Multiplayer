# 🎮 **Connect 4 - Multiplayer Web Game**  

## 🌐 **Play Now: [hakka2424.github.io/Connect4/](https://hakka2424.github.io/Connect4/)**  

Welcome to my **Connect 4** game! This is a **classic two-player game** where players take turns dropping pieces into a grid to try and connect **four in a row** before their opponent. Built using **HTML, CSS, JavaScript, and Socket.io**, this game supports **real-time multiplayer functionality**.

---

## **✨ Features**
✅ **Multiplayer (Online Play)** – Play with a friend remotely using **WebSockets**.  
✅ **Turn-Based System** – Only the correct player can make a move.  
✅ **Win Detection System** – Automatically checks for **vertical, horizontal, and diagonal** wins.  
✅ **Animated Piece Drops** – Smooth **falling effect** when a piece is placed.  
✅ **Retro-Styled UI** – Glowing neon board, pixelated fonts, and a video-game-inspired design.  
✅ **Restart Button** – Quickly reset the board without refreshing the page.  
✅ **Twinkling Star Background** – Animated **galaxy-style backdrop**.  
✅ **Responsive Design** – Works on **desktop, tablets, and mobile devices**.  

---

## **🔧 How to Play**
1. Open the game in your browser: **[Play Online](https://hakka2424.github.io/Connect4/)**.  
2. Share the game **room link** with your opponent to join the same game.  
3. Players take turns dropping pieces in a **7x6 grid**.  
4. The first player to connect **4 in a row (vertically, horizontally, or diagonally) wins!**  
5. The game announces the winner and resets when the **Restart** button is clicked.  

---

## **📥 Installation & Setup**
### **1️⃣ Install Node.js**
Make sure you have **Node.js** installed. You can check by running:
```bash
node -v
```
If not installed, download it from: https://nodejs.org/ 

### **2️⃣ Clone the Repository**
```
git clone https://github.com/Hakka2424/Connect4.git
cd Connect4
```
### **3️⃣ Install Dependencies**
Run the following command to install the required Node.js packages:
```
npm install
```
### **4️⃣ Start the Server**
```
node server.js
```
### **5️⃣ Open the Game**
Go to your browser and enter:
```
http://localhost:4000/
```
To play a specific game room, enter:
```
http://localhost:4000/game1
```
Each unique URL creates a separate match.

---

## **🚀 Features & Functionality**

### 🎨 **Retro Arcade Design**
- Styled with a **dark theme**, glowing UI elements, and **pixel-style game fonts**.  
- **Neon Green "Restart" Button** with hover effects.  

### 🎭 **Smooth Animations & Effects**
- **Falling animation** for pieces using CSS keyframes.  
- **Twinkling star background** for a more engaging experience.  

### 🔄 **Restart Game Instantly**
- Click the **"Restart Game"** button to reset the board without refreshing the page.  

### 📡 **Multiplayer Support**
- Uses **Socket.io** to sync moves between players in real-time.  
- Each **player has their own turn**, and they **cannot drop pieces for their opponent**.  

### 📱 **Fully Responsive**
- Works on **PC, laptops, tablets, and phones**.  

---

## **🏆 Credits & Acknowledgments**  
- **Developer:** [Tyreke Hetzel](https://github.com/Hakka2424)  
- **Project:** Connect 4 - A Web-Based Multiplayer Game  
- **Course:** CS382 - Modern Web Technologies  
- **Instructor:** Bill Hamilton  
- **Year:** 2025  
- **License:** MIT License  
