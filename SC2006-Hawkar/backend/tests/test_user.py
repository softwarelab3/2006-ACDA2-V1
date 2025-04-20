def test_get_all_users(client):
    response = client.get("/users/")
    assert response.status_code == 200
    assert response.json() != []


def test_get_user_by_id(client):
    response = client.get("/user/1")
    assert response.status_code == 200
    assert response.json()["userID"] == 1


def test_get_user_by_id_fail(client):
    response = client.get("/user/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}


def test_get_user_by_email(client):
    response = client.get("/user/email/admin1@gmail.com")
    assert response.status_code == 200
    assert response.json()["emailAddress"] == "admin1@gmail.com"
