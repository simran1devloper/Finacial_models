# Project Setup and Running Guide

## Overview

This guide outlines the steps to set up and run the frontend and backend for this project. The frontend is managed with npm, the backend is written in Go, and ZeroTier is used for remote network access.

## Prerequisites

1. **Node.js** and **npm** (for frontend as well as backend)
2. **Go** (for backend)
3. **ZeroTier** (for remote network access)

### Step 1: Clone the Repository

First, clone the repository to your local machine:

```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

## Frontend Setup

### Install Dependencies

Navigate to the frontend directory and install the necessary dependencies:

```sh
cd frontend
npm install
```

### Start the Frontend

Once the dependencies are installed, start the frontend development server:

```sh
npm start
```

The frontend should now be running at `http://localhost:3000` or the port specified in your configuration.

## Backend Setup

### Install Go Modules

Navigate to the backend directory and initialize Go modules if not already done:

```sh
cd ../backend
go mod tidy
```

### Run the Backend

Start the backend server:

```sh
go init
go run .
```

The backend should now be running, typically on `http://localhost:8080` or the port specified in your Go code.

### Install requirements.txt:
```
pip install -r requirements.txt
```
## Models Initilisation 

install zerotier , connect to our local network / use port forwarding on at port 3000 , 5000 and 8000 to establish peer and to concurrent run the require hosts (as we made 5 server for different parts( frontent , backend , for each ai model, and for blockchain) 
then run servers as per respective commmads 

for models:
```python modle_main_filename.py```
or 
```uvicorn modle_main_filename:app```

## installing Nginx, FastAPI, and Uvicorn:

### Step 1: Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### Step 2: Install FastAPI and Uvicorn

```bash
pip install fastapi uvicorn
```

### Step 3: Configure Nginx

Create an Nginx configuration file for your FastAPI application:

```bash
sudo nano /etc/nginx/sites-available/your_project

# Add the following content:
server {
    listen 80;
    server_name your_domain_or_IP;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration by creating a symbolic link:

```bash
sudo ln -s /etc/nginx/sites-available/your_project /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Run FastAPI with Uvicorn

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Replace `main:app` with the appropriate module name where your FastAPI instance is created.

These steps will set up and run your FastAPI application behind an Nginx server, accessible on port 80.

## ZeroTier Setup

ZeroTier is used to enable network access to remote systems. Follow these steps to configure ZeroTier:

### Install ZeroTier

1. **For Linux:**

    ```sh
    curl -s https://install.zerotier.com | sudo bash
    ```

2. **For macOS:**

    Download and install the ZeroTier client from the [ZeroTier website](https://www.zerotier.com/download/).

3. **For Windows:**

    Download and install the ZeroTier client from the [ZeroTier website](https://www.zerotier.com/download/).

### Join a Network

Join the ZeroTier network required for your project:

```sh
zerotier-cli join <network-id>
```

Replace `<network-id>` with the actual network ID `363c67c55a692fda`.

### Verify Connection

Check if you are connected to the network:

```sh
zerotier-cli listnetworks
```

Ensure that you see the network you joined and that it has a valid status.

## Additional Notes

- Make sure to update the `.env` or configuration files with the appropriate environment variables and settings for both frontend and backend.
- If you encounter any issues, check the logs for both frontend and backend, and ensure ZeroTier is correctly configured.

## Troubleshooting

- **Frontend Issues:** Ensure all npm packages are installed and try restarting the development server.
- **Backend Issues:** Check Go code for errors and ensure all Go modules are correctly installed.
- **ZeroTier Issues:** Verify network settings and consult ZeroTier documentation if necessary.

---

## Tasks Accomplished

- [x] **Task 1:** Made a D-App on our own blockchain to leverage security and privacy.
- [x] **Task 2:** On-chain verification of Work Orders/Certificates using Sign protocol and authentication using Avail.
- [x] **Task 3:** Complete Work-Order Cycle Management, including creating, approving, and tracking work orders.
- [x] **Task 4:** Secure and authentic issuance and verification of certificates.
- [x] **Task 5:** Role-based access control for admin staff and vendors.
- [x] **Task 6:** Extremely user-friendly interface.
- [x] **Task 7:** Ability to seamlessly integrate with existing systems.

---

## Technology Stack

### Frontend:

- **[ReactJS](https://reactjs.org/):** Chosen for its ability to efficiently build dynamic and component-based user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/):** Chosen for its utility-first approach to styling, allowing for rapid development and customization.
- **[React Router](https://reactrouter.com/):** Chosen for its ability to handle client-side routing in React applications.
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript):** Chosen for its versatility and ability to interact with the DOM.
- **[HTML & CSS](https://developer.mozilla.org/en-US/docs/Web/HTML):** Chosen for their ability to create the structure and styling of web pages.

### Backend:

- **[Go](https://go.dev/):** Chosen for its speed, simplicity, and concurrency support.
- **[Gorilla Mux](https://github.com/gorilla/mux):** Chosen for its simplicity and performance.
- **[CORS](https://github.com/rs/cors):** Chosen for its ease of use in handling cross-origin requests.
- **[Python](https://www.python.org/):** Chosen for its versatility and extensive libraries.

---

## Key Features

- **Feature 1:** Work Order Management: Users can add, verify, and approve work orders, with a multi-step approval process.
- **Feature 2:** Certificate Handling: The system allows for adding and verifying certificates, enhancing document authenticity.
- **Feature 3:** Auction System: Users can start auctions, participate in them, and view auction details, including bid history.
- **Feature 4:** Blockchain Integration: All transactions and data are stored on a custom-implemented blockchain, ensuring transparency and immutability.
- **Feature 5:** Digital Signatures: The application uses a simulated sign protocol for verifying the authenticity of work orders and certificates.
- **Feature 6:** Role-Based Access Control: The frontend implements protected routes for admin and vendor dashboards.
- **Feature 7:** Blockchain Viewer: The frontend provides a user-friendly interface to view blockchain transactions and data.
- **Feature 8:** RESTful API: The backend provides a well-structured API for all blockchain operations.
- **Feature 9:** User-Friendly Interface: The frontend provides a user-friendly interface for all features.
- **Feature 10:** Real-time Updates: The system handles time-sensitive operations like auction start and end times.
- **Feature 11:** AI Integration: The system uses AI to assist in managing auctions and verifying the authenticity of work orders and certificates.

---
