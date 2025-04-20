def test_get_all_consumers(client):
    response = client.get("/consumers/")
    assert response.status_code == 200
    assert response.json() != []


def test_get_consumer_by_id(client):
    response = client.get("/consumer/2")
    assert response.status_code == 200
    assert response.json()["consumerID"] == 2


def test_get_consumer_by_id_fail(client):
    response = client.get("/consumer/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Consumer not found"}


def test_get_consumer_by_user_id(client):
    response = client.get("/consumer/userid/2")
    assert response.status_code == 200
    assert response.json()["consumerID"] == 2


def test_update_consumer(client):
    response = client.put(
        "/consumer/update",
        json={
            "name": "Test",
            "emailAddress": "user3@example.com",
            "userID": 3,
            "profilePhoto": "Test",
            "consumerID": 3,
        },
    )
    assert response.status_code == 200
    assert response.json()["user"]["name"] == "Test"
