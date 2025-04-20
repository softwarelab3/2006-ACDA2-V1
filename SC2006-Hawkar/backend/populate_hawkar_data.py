import requests
import base64
import os
import json
import time

# Configuration
API_URL = "http://localhost:8000"  # Adjust if your backend runs on a different URL
PROFILE_PHOTOS_DIR = "app/assets/images/profile"
STALL_PHOTOS_DIR = "app/assets/images/stalls"
DISH_PHOTOS_DIR = "app/assets/images/dishes"


# Helper function to encode images as base64
def encode_image(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return None

    # Determine content type based on file extension
    content_type = "image/jpeg"  # Default
    if file_path.lower().endswith(".png"):
        content_type = "image/png"
    elif file_path.lower().endswith(".gif"):
        content_type = "image/gif"
    elif file_path.lower().endswith(".webp"):
        content_type = "image/webp"

    with open(file_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
        # Add the required data URL prefix
        return f"data:{content_type};base64,{encoded_string}"


# Helper function to make API requests
def make_request(method, endpoint, data=None):
    url = f"{API_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}

    if method.lower() == "get":
        response = requests.get(url, headers=headers)
    elif method.lower() == "post":
        response = requests.post(url, headers=headers, json=data)
    elif method.lower() == "put":
        response = requests.put(url, headers=headers, json=data)
    else:
        print(f"Unsupported method: {method}")
        return None

    print(f"{method.upper()} {url}: {response.status_code}")

    try:
        return response.json()
    except:
        return {"status": response.status_code, "text": response.text}


# Step 1: Create users (1 consumer, 2 hawkers)
def create_users():
    users = []

    # Create a consumer
    consumer_photo = encode_image(f"{PROFILE_PHOTOS_DIR}/consumer1.jpg")
    consumer_data = {
        "userType": "consumer",
        "data": {
            "name": "John Consumer",
            "emailAddress": "john.consumer@example.com",
            "password": "123123123",
            "profilePhoto": consumer_photo,
            "contactNumber": "91234567",
            "address": "123 Consumer Street",
            "dietaryPreference": "Vegetarian",
            "preferredCuisine": "Chinese",
            "ambulatoryStatus": "Normal",
        },
    }

    consumer = make_request("post", "/auth/signup", consumer_data)
    users.append(consumer)
    print(f"Created consumer: {consumer.get('name', 'Unknown')}")

    # Create two hawkers
    hawker_photos = [
        encode_image(f"{PROFILE_PHOTOS_DIR}/hawker1.jpg"),
        encode_image(f"{PROFILE_PHOTOS_DIR}/hawker2.jpg"),
    ]

    hawker_names = ["Alice Hawker", "Bob Hawker"]
    hawker_emails = ["alice.hawker@example.com", "bob.hawker@example.com"]

    for i in range(2):
        hawker_data = {
            "userType": "hawker",
            "data": {
                "name": hawker_names[i],
                "emailAddress": hawker_emails[i],
                "password": "123123123",
                "profilePhoto": hawker_photos[i],
                "contactNumber": f"9876{i}543",
                "address": f"{i+1}00 Hawker Avenue",
                "license": f"HAW{i+1}00000",
                "verifyStatus": True,  # Auto-verify for demo purposes
            },
        }

        hawker = make_request("post", "/auth/signup", hawker_data)
        users.append(hawker)
        print(f"Created hawker: {hawker.get('user', {}).get('name', 'Unknown')}")

    return users


# Step 2: Create stalls for each hawker
def create_stalls(hawkers):
    stalls = []

    # Define stall data for each hawker
    stall_configs = [
        {
            "name": "Alice's Delights",
            "hawker_id": hawkers[0]["hawkerID"],
            "hawker_center_id": 1,  # Assuming hawker center with ID 1 exists
            "unit": "01-23",
            "cuisine": ["Chinese", "Indian"],
            "images_prefix": "hs1",
        },
        {
            "name": "Bob's Gourmet",
            "hawker_id": hawkers[1]["hawkerID"],
            "hawker_center_id": 2,  # Assuming hawker center with ID 1 exists
            "unit": "01-45",
            "cuisine": ["Indian", "Korean"],
            "images_prefix": "hs2",
        },
    ]

    for config in stall_configs:
        # Get all images for this stall
        stall_images = []
        image_files = [
            f
            for f in os.listdir(STALL_PHOTOS_DIR)
            if f.startswith(config["images_prefix"])
            and (f.endswith(".jpg") or f.endswith(".png") or f.endswith(".jpeg"))
        ]

        for img_file in image_files:
            encoded_img = encode_image(f"{STALL_PHOTOS_DIR}/{img_file}")
            if encoded_img:
                stall_images.append(encoded_img)

        stall_data = {
            "stallName": config["name"],
            "hawkerID": config["hawker_id"],
            "hawkerCenterID": config["hawker_center_id"],
            "images": stall_images,
            "unitNumber": config["unit"],
            "startTime": "09:00:00",
            "endTime": "21:00:00",
            "hygieneRating": "A",
            "cuisineType": config["cuisine"],
            "estimatedWaitTime": 15,
            "priceRange": "$5 - $10",
        }

        stall = make_request("post", "/stall/add", stall_data)

        # To get the created stall ID, we need to fetch stalls by hawker ID
        hawker_stalls = make_request("get", f"/stall/hawkerid/{config['hawker_id']}")
        if isinstance(hawker_stalls, list) and hawker_stalls:
            stalls.append(hawker_stalls[0])
            print(
                f"Created stall: {config['name']} with ID {hawker_stalls[0].get('stallID', 'Unknown')}"
            )
        else:
            print(f"Failed to retrieve stall for hawker {config['hawker_id']}")

    return stalls


# Step 3: Add dishes to stalls
def create_dishes(stalls):
    # Add one dish to first stall
    dish1_image = encode_image(f"{DISH_PHOTOS_DIR}/s1_1.jpg")

    dish1_data = {
        "stallID": stalls[0]["stallID"],
        "dishName": "Signature Special",
        "price": 8.50,
        "photo": dish1_image,
        "onPromotion": True,
        "startDate": "2025-05-01",
        "endDate": "2025-09-01",
        "discountedPrice": 6.99,
    }

    dish1 = make_request("post", f"/stall/{stalls[0]['stallID']}/add-dish", dish1_data)
    print(f"Added dish 'Signature Special' to {stalls[0]['stallName']}")

    # Add two dishes to second stall
    dish_images = [
        encode_image(f"{DISH_PHOTOS_DIR}/s2_1.jpg"),
        encode_image(f"{DISH_PHOTOS_DIR}/s2_2.jpg"),
    ]

    dish_names = ["Gourmet Burger", "Premium Pasta"]
    dish_prices = [12.90, 14.90]

    for i in range(2):
        dish_data = {
            "stallID": stalls[1]["stallID"],
            "dishName": dish_names[i],
            "price": dish_prices[i],
            "photo": dish_images[i],
            "onPromotion": i == 0,  # First dish on promotion
        }

        # Add promotion details if applicable
        if i == 0:
            dish_data.update(
                {
                    "startDate": "2025-05-01",
                    "endDate": "2025-06-30",
                    "discountedPrice": 10.50,
                }
            )

        dish = make_request(
            "post", f"/stall/{stalls[1]['stallID']}/add-dish", dish_data
        )
        print(f"Added dish '{dish_names[i]}' to {stalls[1]['stallName']}")


def main():
    print("Starting Hawkar data population script...")

    # Step 1: Create users
    print("\n--- Creating Users ---")
    users = create_users()

    # Extract the hawker users
    hawkers = [user for user in users[1:3]]

    # Wait a bit to ensure all data is persisted
    time.sleep(1)

    # Step 2: Create stalls
    print("\n--- Creating Stalls ---")
    stalls = create_stalls(hawkers)

    # Wait a bit to ensure all data is persisted
    time.sleep(1)

    # Step 3: Create dishes
    print("\n--- Creating Dishes ---")
    create_dishes(stalls)

    print("\nData population complete!")


if __name__ == "__main__":
    main()
