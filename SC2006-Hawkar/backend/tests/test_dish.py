def test_get_all_dishes(client):
    response = client.get("/dishes/")
    assert response.status_code == 200
    assert response.json() != []


def test_get_dish_by_id(client):
    response = client.get("/dish/1")
    assert response.status_code == 200
    assert response.json()["dishID"] == 1


def test_get_dish_by_id_fail(client):
    response = client.get("/dish/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Dish not found"}


def test_get_dishes_by_stall_id(client):
    response = client.get("/dish/stallid/1")
    assert response.status_code == 200
    assert response.json() != []


def test_add_dish(client):
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


def test_update_dish(client):
    response = client.put(
        "/stall-controller/edit-dish",
        json={
            "dishID": 1,
            "dishName": "Test",
            "price": 1.0,
            "photo": "Test",
        },
    )
    assert response.status_code == 200
    assert response.json()["dishName"] == "Test"


def test_delete_dish(client):
    response = client.delete("/stall-controller/delete-dish/2")
    assert response.status_code == 200 or response.status_code == 400
    assert response.json() == {
        "detail": "Dish deleted successfully"
    } or response.json() == {"detail": "Invalid dishID"}
