from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from couchbase.cluster import Cluster
from couchbase.cluster import PasswordAuthenticator
from couchbase.exceptions import NotFoundError

import json

cluster = Cluster('couchbase://localhost')
authenticator = PasswordAuthenticator('Administrator', '******')
cluster.authenticate(authenticator)
bucket = cluster.open_bucket('SpritePacker')

def getNode(userId):
    try:
        value = bucket.get(userId).value
    except NotFoundError as e:
        value = {'atlases': []}
        bucket.upsert(userId, value)
    return value

def listAtlas(request, userId):
    rootDic = getNode(userId)
    return JsonResponse(rootDic, json_dumps_params={'ensure_ascii': True})

def saveAtlas(request, userId):
    rootDic = getNode(userId)
    atlases = rootDic['atlases']
    reqAtlas = json.loads(request.body)

    filteredAtlases = list(filter(lambda atlas: atlas['name'] != reqAtlas['name'], atlases))
    filteredAtlases.append(reqAtlas)
    rootDic['atlases'] = filteredAtlases

    bucket.upsert(userId, rootDic)
    return HttpResponse(200)

def deleteAtlas(request, userId):
    rootDic = getNode(userId)
    atlases = rootDic['atlases']
    reqAtlas = json.loads(request.body)

    rootDic['atlases'] = list(filter(lambda atlas: atlas['name'] != reqAtlas['name'], atlases))

    bucket.upsert(userId, rootDic)
    return HttpResponse(200)
