# -*- coding: utf-8 -*-
"""
-------------------------------------------------
# @Project  :AutoTest
# @File     :tes
# @Date     :2021/6/14 11:01
# @Author   :AbbeyZheng
# @Email    :zhengxiaoxianchn@163.com
# @Software :PyCharm
-------------------------------------------------
"""

from django.contrib import admin

# Register your models here.
from Myapp.models import *

admin.site.register(DB_tucao)
admin.site.register(DB_home_href)
admin.site.register(DB_project)
admin.site.register(DB_apis)