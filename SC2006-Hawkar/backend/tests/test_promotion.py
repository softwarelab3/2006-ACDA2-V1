def test_get_all_promotions(client):
    response = client.get("/promotions/")
    assert response.status_code == 200
    assert response.json() != []


def test_get_promotion_by_id(client):
    response = client.get("/promotion/1")
    assert response.status_code == 200
    assert response.json()["promotionID"] == 1


def test_get_promotion_by_id_fail(client):
    response = client.get("/promotion/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Promotion not found"}


def test_get_promotion_by_dish_id(client):
    response = client.get("/promotion/dishid/1")
    assert response.status_code == 200
    assert response.json()["dishID"] == 1


def test_add_promotion(client):
    response = client.post(
        "/dish-controller/add-promotion",
        json={
            "dishID": 6,
            "startDate": "2021-08-01",
            "endDate": "2021-08-31",
            "discountedPrice": 1.0,
        },
    )
    assert response.status_code == 400 or response.status_code == 200
    assert (
        response.json() == {"detail": "Promotion already exists"}
        or response.json()["discountedPrice"] == 1.0
    )


def test_update_promotion(client):
    response = client.put(
        "/dish-controller/edit-promotion",
        json={
            "promotionID": 6,
            "startDate": "2021-08-01",
            "endDate": "2021-08-31",
            "discountedPrice": 2.0,
        },
    )
    assert response.status_code == 200
    assert response.json()["discountedPrice"] == 2.0


def test_delete_promotion(client):
    response = client.delete("/dish-controller/delete-promotion/6")
    assert response.status_code == 200
    assert response.json() == {"detail": "Promotion deleted successfully"}
