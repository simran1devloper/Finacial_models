

# Project Setup and Running Guide

## Overview

This guide outlines the steps to set up and run the frontend and backend for this project. The frontend is managed with npm, the backend is written in Go, and ZeroTier is used for remote network access.

## Prerequisites

1. **Node.js** and **npm** (for frontend as well as backend )
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

Replace `<network-id>` with the actual network ID 363c67c55a692fda .

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

Feel free to adjust the guide based on the specifics of your project and setup.
