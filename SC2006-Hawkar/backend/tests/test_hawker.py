def test_get_all_hawkers(client):
    response = client.get("/hawkers/")
    assert response.status_code == 200
    assert response.json() != []


def test_get_hawker_by_id(client):
    response = client.get("/hawker/5")
    assert response.status_code == 200
    assert response.json()["hawkerID"] == 5


def test_get_hawker_by_id_fail(client):
    response = client.get("/hawker/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Hawker not found"}


def test_add_hawker(client):
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


# def test_delete_hawker(client):
#     response = client.delete("/hawker/delete/9")
#     assert response.status_code == 200
#     assert response.json() == {"detail": "Hawker deleted successfully"}
#     response = client.get("/hawker/9")
#     assert response.status_code == 404
#     assert response.json() == {"detail": "Hawker not found"}
