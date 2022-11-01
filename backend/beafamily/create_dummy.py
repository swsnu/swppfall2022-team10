import os
import shutil
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beafamily.settings')
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()


from api.models import Post
from beafamily.settings import POST_DIR, BASE_DIR

def create(a, b):

    for i in range(a, b+1):
        p = Post(
            post_id = i,
            user_id = i % 2,
            post_detail = POST_DIR / f'post/{i}'  
            )
        if not os.path.exists(POST_DIR):
            os.mkdir(POST_DIR)
        if not os.path.exists(POST_DIR / 'post'):
            os.mkdir(POST_DIR / 'post')

        if not os.path.exists(POST_DIR / f'post/{i}'):
            shutil.copytree(BASE_DIR / 'dummy/post', POST_DIR / f'post/{i}')
        p.save()
        
create(1, 12)
