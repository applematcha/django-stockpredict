from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
import tushare as ts
import json
import datetime
import pandas as pd
import numpy as np
import time
import matplotlib.pyplot as plt
plt.rcParams['font.family'] = ['sans-serif']
plt.rcParams['font.sans-serif'] = ['SimHei']
from statsmodels.tsa.arima_model import ARIMA
from statsmodels.graphics.tsaplots import plot_acf,plot_pacf
import warnings
warnings.filterwarnings('ignore')#忽略警告
from .models import User
from .forms import UserForm


def index(request):
    return render(request, 'index.html')


def history(request):
    return render(request, 'history.html')


def visual(request):
    return render(request, 'visual.html')


def predict(request):
    return render(request, 'predict.html')


def visual2(request):
    return render(request, 'visual2.html')

def visual3(request):
    return render(request, 'visual3.html')


# 获取股票数据
def data(request):
    # return render(request, 'history.html')
    code = request.GET['code']  # 获取前端输入信息
    stock_data1 = ts.get_hist_data(code)  # tushare获取数据
    stock_data1.to_csv('F:\\python\\py\\stocksystem\\visualization\\static\\data.csv')
    stock_name = getstock_name(code)
    stock_data1 = stock_data1.reset_index()
    stock_data1 = stock_data1[['date', 'open', 'high', 'low', 'close', 'volume']]
    stock_data1 = stock_data1.sort_values(by='date', axis=0, ascending=True)
    for i in range(stock_data1.shape[0]):
        stock_data1['date'][i] = datetime.datetime.strptime(stock_data1['date'][i], "%Y-%m-%d")
        stock_data1['date'][i] = time.mktime(stock_data1['date'][i].timetuple())
        stock_data1['date'][i] = int(stock_data1['date'][i]) * 1000
    stock_array = np.array(stock_data1)
    stock_list = stock_array.tolist()
    jsondata = json.dumps(stock_list,ensure_ascii=False)  # df转为json
    stock_data = json.loads(jsondata)
    data1 = {"code": 1, "msg": "操作成功！", "name": stock_name, "data": stock_data}
    # return JsonResponse(data)
    # f = open('F:\\python\\py\\stocksystem\\visualization\\static\\data.json', 'w')
    # f.write(data)
    # f.close()
    # return data.json
    with open('F:\\python\\py\\stocksystem\\visualization\\static\\data.json', 'w',encoding='utf-8') as f:
        # read_data = f.read()
        # f.seek(0)
        # f.truncate()#清空文件
        f.write(json.dumps(data1,ensure_ascii=False))
    return JsonResponse(data1, json_dumps_params={'ensure_ascii':False})

# 获取股票名称
def getstock_name(code):
    realtimeData = ts.get_realtime_quotes(code)
    realtimeData = realtimeData.to_dict('record')
    stock_name = realtimeData[0]['name']
    return stock_name

# 深度学习预测股票价格
def getpredictdata():
    df_stock = pd.read_csv('F:\\python\\py\\stocksystem\\visualization\\static\\data.csv', index_col=0, parse_dates=[0])
    # 读取数据集，把时间列作为索引，并按照datetime格式进行解析
    # 对数据进行重采样，按照周为单位进行
    stock_week = df_stock['close'].resample('W-TUE').mean()
    # 将收盘价作为评判标准，resample是按照周统计平均数据
    stock_train = stock_week['2019-01-01':'2020-03-030'].dropna()

def pred(request):
    df_stock = pd.read_csv('F:\\python\\py\\stocksystem\\visualization\\static\\data.csv', index_col=0, parse_dates=[0])
    # 读取数据集，把时间列作为索引，并按照datetime格式进行解析
    # 对数据进行重采样，按照周为单位进行
    stock_week = df_stock['close'].resample('W-TUE').mean()
    # 将收盘价作为评判标准，resample是按照周统计平均数据
    stock_train = stock_week['2019-01-01':'2020-03-30'].dropna()
    # 观察数据不符合时间序列的平稳性，因此要做差分处理
    stock_diff = stock_train.diff().dropna()  # 对训练集做一阶差分，目的是使时间序列数据变得平稳
    # 进行ARIMA模型的创建
    model = ARIMA(stock_train, order=(1, 1, 1), freq='W-TUE')
    # 应用模型-拟合
    result = model.fit()
    # 用模型进行预测
    pred = result.predict('2020-03', '2020-06', dynamic=True, typ='levels')
    # 用模型获取预测结果，起始的时间点需要在原来的训练集之中，结束的时间点不需要
    # 起始的时间点和结束的时间点要和原始数据集的频率保持一致
    dict_pred = {'date': pred.index, 'close': pred.values}
    df_pred = pd.DataFrame(dict_pred)
    pred = pred.reset_index()
    pred = df_pred.sort_values(by='date', axis=0, ascending=True)
    for i in range(pred.shape[0]):
        pred['date'][i] = time.mktime(pred['date'][i].timetuple())
        pred['date'][i] = int(pred['date'][i]) * 1000
    stock_array = np.array(pred)
    stock_list = stock_array.tolist()
    jsonpred = json.dumps(stock_list, ensure_ascii=False)  # df转为json
    stock_pred = json.loads(jsonpred)
    pred = {"code": 1, "msg": "操作成功！", "data": stock_pred}
    with open('F:\\python\\py\\stocksystem\\visualization\\static\\pred.json', 'w', encoding='utf-8') as f:
        # read_data = f.read()
        # f.seek(0)
        # f.truncate()#清空文件
        f.write(json.dumps(pred, ensure_ascii=False))
    return JsonResponse(pred, json_dumps_params={'ensure_ascii': False})


#
# def login(request):
#     if request.method == "POST":
#         login_form = forms.UserForm(request.POST)
#         message = "请检查填写的内容！"
#         if login_form.is_valid():
#             username = login_form.cleaned_data['username']
#             password = login_form.cleaned_data['password']
#             try:
#                 user = models.User.objects.get(name=username)
#                 if user.password == password:
#                     return redirect('/index/')
#                 else:
#                     message = "密码不正确！"
#             except:
#                 message = "用户不存在！"
#         return render(request, 'login.html', locals())
#
#     login_form = forms.UserForm()
#     return render(request, 'login.html', locals())


def register(request):
    pass
    return render(request, 'register.html')


def logout(request):
    pass
    return redirect("index.html")