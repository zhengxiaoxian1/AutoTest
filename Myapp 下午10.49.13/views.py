# -*- coding: utf-8 -*-
"""
-------------------------------------------------
# @Project  :AutoTest
# @File     :tes
# @Date     :2021/7/14 14:37
# @Author   :AbbeyZheng
# @Email    :zhengxiaoxianchn@163.com
# @Software :PyCharm
-------------------------------------------------
"""
import json

import requests
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from  django.contrib.auth.decorators import login_required

from Myapp.models import *


@login_required
def welcome(request):
    return render(request,'welcome.html',{"username":"郑小仙的"})
#进入主页
@login_required
def home(request):
    return render(request,'welcome.html',{"whichHTML": "Home.html","oid": ""})
@login_required
def child(request,eid,oid):
    # print(eid)
    res = child_json(eid,oid)
    return render(request,eid,res)

def child_json(eid,oid=''):
    res = {}
    if eid == "Home.html":
        date = DB_home_href.objects.all()
        res = {"hrefs":date}

    if eid == "project_list.html":
        date = DB_project.objects.all()
        res = {"projects":date}
    if eid == "P_apis.html":
        project = DB_project.objects.filter(id = oid)[0]
        # print(project)
        # print(oid)
        apis = DB_apis.objects.filter(project_id=oid)
        res = {"project":project,'apis':apis}
        # print(res)

    if eid == "P_cases.html":
        project = DB_project.objects.filter(id = oid)[0]
        res = {"project":project}
    if eid == "P_project_set.html":
        project = DB_project.objects.filter(id = oid)[0]
        res = {"project":project}

    return res

def login(request):
    return render(request,'login.html')

def login_action(request):
    name = request.GET['username']
    word = request.GET['password']
    from  django.contrib import auth
    user = auth.authenticate(username=name,password=word)
    if user is not None:
        auth.login(request,user)
        request.session['user']=name
        return HttpResponse('登陆成功')

    else:
        return HttpResponse("登陆失败")

def register_action(request):
    name = request.GET['username']
    word = request.GET['password']
    #联通django用户表
    from django.contrib.auth.models import User
    try:
        user = User.objects.create_user(username=name,password=word)
        user.save()
        return HttpResponse("注册成功了")
    except:
        return HttpResponse("注册用户失败，用户已存在")
    #退出登陆
def logout(request):
    from django.contrib import auth
    auth.logout(request)
    return HttpResponseRedirect('/login/')

def submit(request):
    tucao = request.GET["tucao"]
    name = request.user
    DB_tucao.objects.create(user = name,text=tucao)
    return HttpResponse("")

def help(request):
    return render(request,'help.html')

def project_list(request):
    return render(request,'welcome.html',{"whichHTML":"project_list.html","oid":""})

def delete_project(request):
    id = request.GET['id']
    DB_project.objects.filter(id=id).delete()
    DB_apis.objects.filter(project_id=id).delete()
    return HttpResponse('')
def add_project(request):
    project_name = request.GET['project_name']
    DB_project.objects.create(name=project_name,remark='',user=request.user.username,other_user='')
    return HttpResponse("")
def open_apis(request,id):
    project_id = id
    return render(request,'welcome.html',{"whichHTML":"P_apis.html","oid":project_id})
def open_case(request,id):
    project_id = id
    return render(request,'welcome.html',{"whichHTML":"P_cases.html","oid":project_id})
def open_project_set(request,id):
    project_id = id
    return render(request,'welcome.html',{"whichHTML":"P_project_set.html","oid":project_id})
def save_project_set(request,id):
    project_id = id
    name = request.GET['name']
    remark = request.GET['remark']
    other_user = request.GET['other_user']
    # print(project_id,name,remark,other_user)
    DB_project.objects.filter(id=project_id).update(name=name,remark = remark,other_user=other_user)
    return HttpResponse('')


# 新增接口
def project_api_add(request,Pid):
    project_id = Pid
    DB_apis.objects.create(project_id=project_id,api_method = 'none')
    return HttpResponseRedirect('/apis/%s/'%project_id)


def save_bz(request):
    api_id = request.GET['api_id']
    bz_value = request.GET['bz_value']
    print(api_id,bz_value)
    DB_apis.objects.filter(id = api_id).update(des=bz_value)
    return HttpResponse('')
def get_bz(request):
    api_id = request.GET['api_id']
    bz_value = DB_apis.objects.filter(id = api_id)[0].des
    return HttpResponse(bz_value)
#保存接口
def Api_save(request):
    #提取数据
    api_id = request.GET['api_id']
    ts_method = request.GET['ts_method']
    ts_url =request.GET['ts_url']
    ts_host = request.GET['ts_host']
    ts_header = request.GET['ts_header']
    ts_body_method = request.GET['ts_body_method']
    ts_api_body = request.GET['ts_api_body']
    print(ts_api_body)
    ts_api_name = request.GET['ts_api_name']
    if ts_body_method == '返回体':
        api = DB_apis.objects.filter(id= api_id)[0]
        ts_body_method = api.last_body_method
        ts_api_body = api.last_api_body
    else:
        ts_api_body = request.GET['ts_api_body']
    #保存数据
    DB_apis.objects.filter(id=api_id).update(
        api_method = ts_method,
        api_url = ts_url,
        api_header = ts_header,
        api_host = ts_host,
        body_method = ts_body_method,
        api_body = ts_api_body,
        name = ts_api_name
    )
    print("入库成功")
    return HttpResponse('success')

# 删除接口
def project_api_del(request,id):

    project_id = DB_apis.objects.filter(id=id)[0].project_id
    DB_apis.objects.filter(id=id).delete()
    # DB_apis.objects.all().delete()
    return HttpResponseRedirect('/apis/%s/'%project_id)
#获取接口数据
def get_api_data(request):
    api_id = request.GET['api_id']
    api = DB_apis.objects.filter(id = api_id).values()[0]
    # print(json.dumps(api))
    return HttpResponse(json.dumps(api),content_type='application/json')
#调试层发送请求
def Api_send(request):
    #提取所有数据
    api_id = request.GET['api_id']
    ts_method = request.GET['ts_method']
    ts_url = request.GET['ts_url']
    ts_host = request.GET['ts_host']
    ts_header = request.GET['ts_header']
    ts_body_method = request.GET['ts_body_method']
    header = json.loads(ts_header)
    print (header)
    print(ts_body_method)
    if ts_body_method == "返回体":
        api = DB_apis.objects.filter(id = api_id)[0]
        ts_body_method = api.last_body_method
        ts_api_body = api.last_api_body
        if ts_body_method in ['',None]:
            print ("请先选择好请求体编码格式和请求体，再点击send请求")
            return HttpResponse('请先选择好请求体编码格式和请求体，再点击send请求')
    else:
        ts_api_body = request.GET['ts_api_body']
        api = DB_apis.objects.filter(id = api_id)
        api.update(last_body_method = ts_body_method,last_api_body = ts_api_body)


   # 拼接url
    if ts_host[-1] =='/' and ts_url[0] =='/':#都有/
        url = ts_host[:-1]+ts_url
    elif ts_host[-1] !='/' and ts_url[0] !='/':#都没有/
        url = ts_host+'/'+ts_url
    elif ts_host =='' or None:
        url = ts_url
    else:
        url = ts_host + ts_url
#发送请求
    if ts_body_method == 'none':
        if ts_method =='get':
            print (url)
            # response = requests.get(url=url)
            response = requests.request(ts_method.upper(),url=url,headers=header)
    elif ts_body_method == 'form-data':
        files = []
        payload  = {}
        for i in eval(ts_api_body):
            payload[i[0]] = i[1]
        response =request.request(ts_method.upper(),url,headers=ts_header,data={})


    #返回值传递给前端
    return HttpResponse(response.text)
    # return HttpResponse("{code:200}")

def test(request):
    return  render(request, 'test.html')


