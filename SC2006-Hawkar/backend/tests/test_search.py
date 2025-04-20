def test_search(client):
    response = client.get("/search/C")
    assert response.status_code == 200
    assert response.json()["dishes"][0]["dishName"] == "Cai Fan"
    assert response.json()["hawkers"][0]["businessName"] == "Chicken Rice Store (NTU)"


def test_search_no_results(client):
    response = client.get("/search/ZZZ")
    assert response.status_code == 200
    assert response.json() == {"hawkers": [], "dishes": []}


def test_search_new_hawker(client):
    response = client.post(
        "/hawker-controller/add-hawker",
        json={
            "name": "test",
            "emailAddress": "test@example.com",
            "password": "test",
            "role": "Hawker",
            "profilePhoto": "test",
            "address": "test",
            "latitude": 1.3521,
            "longitude": 103.8198,
            "contactNumber": "12345678",
            "verifyStatus": True,
        },
    )
    assert response.status_code == 200 or response.status_code == 400
    assert (
        response.json() == {"detail": "Email already registered"}
        or response.json()["emailAddress"] == "test@example.com"
    )
    response = client.get("/search/test")
    assert response.status_code == 200
    assert response.json()["hawkers"][0]["emailAddress"] == "test@example.com"


def test_search_new_dish(client):
    response = client.post(
        "/stall-controller/add-dish",
        json={
            "stallID": 1,
            "dishName": "test",
            "price": 1.0,
            "photo": "test",
        },
    )
    assert response.status_code == 200
    assert response.json()["dishName"] == "test"
    response = client.get("/search/test")
    assert response.status_code == 200
    assert response.json()["dishes"][0]["dishName"] == "test"
