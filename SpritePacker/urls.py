from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='SpritePacker.html')),
    url(r'^manual/ko$', TemplateView.as_view(template_name='SP_KoreanManual.html')),
    url(r'^manual/en$', TemplateView.as_view(template_name='SP_EnglishManual.html')),
    url(r'^(?P<userId>[0-9a-zA-Z_]+)/atlas/list$', views.listAtlas, name='listAtlas'),
    url(r'^(?P<userId>[0-9a-zA-Z_]+)/atlas/save$', views.saveAtlas, name='saveAtlas'),
    url(r'^(?P<userId>[0-9a-zA-Z_]+)/atlas/delete$', views.deleteAtlas, name='deleteAtlas')
]
