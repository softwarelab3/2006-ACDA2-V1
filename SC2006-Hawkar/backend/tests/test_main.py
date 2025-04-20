def test_api_doc_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"API Docs": "http://127.0.0.1:8000/docs#/"}
