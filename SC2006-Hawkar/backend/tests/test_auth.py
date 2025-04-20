def test_login(client):
    response = client.post(
        "/auth/login",
        json={"emailAddress": "admin1@gmail.com", "password": "123123123"},
    )
    assert response.status_code == 200
    assert response.json()["user"]["emailAddress"] == "admin1@gmail.com"


def test_login_fail(client):
    response = client.post(
        "/auth/login",
        json={"emailAddress": "admin1@gmail.com", "password": "123"},
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid login credentials"}


def test_signup_admin(client):
    response = client.post(
        "/auth/signup/admin",
        json={
            "name": "Test_admin",
            "emailAddress": "test_admin@example.com",
            "password": "test",
            "role": "Admin",
            "profilePhoto": "Test",
        },
    )
    assert response.status_code == 400 or response.status_code == 200
    assert (
        response.json() == {"detail": "Email is already registered!"}
        or response.json()["user"]["emailAddress"] == "test_admin@example.com"
    )


def test_signup_consumer(client):
    response = client.post(
        "/auth/signup/consumer",
        json={
            "name": "Test_consumer",
            "emailAddress": "test_consumer@example.com",
            "password": "test",
            "role": "Consumer",
            "profilePhoto": "Test",
        },
    )
    assert response.status_code == 400 or response.status_code == 200
    assert (
        response.json() == {"detail": "Email is already registered!"}
        or response.json()["user"]["emailAddress"] == "test_consumer@example.com"
    )


def test_signup_hawker(client):
    response = client.post(
        "/auth/signup/hawker",
        json={
            "name": "Test_hawker",
            "emailAddress": "test_hawker@example.com",
            "password": "test",
            "role": "Hawker",
            "profilePhoto": "Test",
            "address": "Test",
            "latitude": 1.3521,
            "longitude": 103.8198,
            "contactNumber": "12345678",
            "verifyStatus": False,
        },
    )
    assert response.status_code == 400 or response.status_code == 200
    assert (
        response.json() == {"detail": "Email is already registered!"}
        or response.json()["user"]["emailAddress"] == "test_hawker@example.com"
    )


def test_login_with_google(client):
    response = client.get("/auth/login-google/admin1@gmail.com")
    assert response.status_code == 200
    assert response.json() == True
