def test_get_all_admins(client):
    response = client.get("/admins/")
    assert response.status_code == 200
    assert response.json() != []


def test_get_admin_by_id(client):
    response = client.get("/admin/1")
    assert response.status_code == 200
    assert response.json()["adminID"] == 1


def test_get_admin_by_id_fail(client):
    response = client.get("/admin/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Admin not found"}


def test_admin_verify_hawker(client):
    response = client.put("/admin-controller/verify-hawker/6")
    assert response.status_code == 200
    assert response.json()["verifyStatus"] == True


def test_update_admin(client):
    response = client.put(
        "/admin/update",
        json={
            "name": "Test",
            "emailAddress": "user@example.com",
            "userID": 12,
            "profilePhoto": "Test",
            "adminID": 12,
        },
    )
    assert response.status_code == 200
    assert response.json()["user"]["name"] == "Test"
