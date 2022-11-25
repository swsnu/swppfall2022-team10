import base64


def basic_auth_encoder(username, password):
    return "Basic " + base64.b64encode(f"{username}:{password}".encode()).decode()
