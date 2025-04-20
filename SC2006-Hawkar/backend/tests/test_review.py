def test_get_all_reviews(client):
    response = client.get("/reviews")
    print(response.json())
    assert response.status_code == 200
    assert response.json() != []


def test_get_review_by_id(client):
    response = client.get("/review/1")
    assert response.status_code == 200
    assert response.json()["reviewID"] == 1


def test_get_review_by_id_fail(client):
    response = client.get("/review/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Review not found"}


def test_get_reviews_by_stall_id(client):
    response = client.get("/review/stallid/1")
    assert response.status_code == 200
    assert response.json() != []


def test_get_reviews_by_user_id(client):
    response = client.get("/review/userid/2")
    print(response.json())
    assert response.status_code == 200
    assert response.json() != []


def test_get_reviews_by_user_id_fail(client):
    response = client.get("/review/userid/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "No review found for queried consumer id"}


def test_add_review(client):
    response = client.post(
        "/consumer-controller/submit-review",
        json={
            "reviewText": "This is a test review",
            "rating": 4.5,
            "consumerID": 2,
            "stallID": 1,
        },
    )
    assert response.status_code == 200
    assert response.json()["reviewText"] == "This is a test review"


def test_update_review(client):
    response = client.put(
        "/consumer-controller/edit-review",
        json={
            "reviewID": 1,
            "reviewText": "This is a test edited review",
            "rating": 4.5,
            "consumerID": 2,
        },
    )
    assert response.status_code == 200
    assert response.json()["reviewText"] == "This is a test edited review"
