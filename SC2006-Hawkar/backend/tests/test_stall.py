def test_get_all_stalls(client):
    response = client.get("/stalls/")
    assert response.status_code == 200
    assert response.json() != []


def test_get_stall_by_id(client):
    response = client.get("/stall/1")
    assert response.status_code == 200
    assert response.json()["stallID"] == 1


def test_get_stall_by_id_fail(client):
    response = client.get("/stall/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Stall not found"}


def test_get_stall_by_hawker_id(client):
    response = client.get("/stall/hawkerid/5")
    assert response.status_code == 200
    assert response.json() != []


def test_add_stall(client):
    response = client.post(
        "/hawker-controller/add-stall",
        json={
            "stallName": "test",
            "hawkerID": 5,
            "unitNumber": "test",
            "openStatus": True,
            "operatingHours": "test",
            "hygieneRating": 0,
            "cuisineType": "Chinese",
            "estimatedWaitTime": 0,
        },
    )
    assert response.status_code == 200
    assert response.json()["stallName"] == "test"


def test_update_stall(client):
    response = client.put(
        "/hawker-controller/edit-stall",
        json={
            "stallID": 1,
            "stallName": "Test",
            "hawkerID": 5,
            "unitNumber": "Test",
            "openStatus": True,
            "operatingHours": "Test",
            "hygieneRating": 0,
            "cuisineType": "Chinese",
            "estimatedWaitTime": 0,
        },
    )
    assert response.status_code == 200
    assert response.json()["stallName"] == "Test"


# def test_delete_stall(client):
#     response = client.delete("/hawker-controller/delete-stall/5")
#     assert response.status_code == 200 or response.status_code == 400
#     assert response.json() == {
#         "detail": "Stall deleted successfully"
#     } or response.json() == {"detail": "Invalid stallID"}
