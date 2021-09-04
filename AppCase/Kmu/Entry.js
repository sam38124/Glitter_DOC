function onCreate() {
    glitter.share.version='2.8'
    glitter.changePageListener = function (tag) {
        console.log(tag)
    }
    //定義管理員帳號
    glitter.share.manager = '1623713385519'
    //通知文章更新
    glitter.share.updateArt = function () {}
    //後端伺服器路徑
    glitter.webUrl='https://www.squarestudio.tw'
   // glitter.webUrl='http://127.0.0.1'
    //自定義轉場動畫
    glitter.defalutAnimator = "translation"
    glitter.setLoadingView('dialog/Dia_DataLoading.html')
    //自定義加載動畫
    glitter.share.dataLoading = function (bo) {
        if (bo) {
            glitter.openDiaLog('dialog/Dia_DataLoading.html', 'dataLoading', false, false, '{}')
        } else {
            glitter.closeDiaLogWithTag('dataLoading')
        }
    }
    //自定義提示通知
    glitter.share.hint = function (data) {
        glitter.openDiaLog('dialog/Dia_Info.html', 'Dia_Info', false, true, data, function () {
        })
        setTimeout(function (){
            glitter.closeDiaLogWithTag('Dia_Info')
        },2000)
    }
    //跳轉至首頁
    glitter.share.toHome = function () {
        // glitter.setHome("publicResource/page/Page_Add_User_Chat.html","Page_Add_User_Chat",{})
        glitter.setHome('page/Page_Home.html', 'Page_Home', '{}')
    }
    //網路斷線提示
    glitter.share.internetError = function () {
        glitter.openDiaLog('dialog/Dia_DisConnect.html', 'DisConnect', false, true, '{}')
    }
    //添加開發用模組
    glitter.addMtScript(["publicResource/PublicLogic.js"], function () {
        initMySocialModel()
        glitter.publicBeans.publicLogic.customDefine.app = 'Kmu'
        glitter.serialUtil.getObject("settingObj", "SettingObj", function (obh) {
            if (obh !== undefined) {
                glitter.copyObj(glitter.share.settingObj, obh)
            }

            glitter.setHome('page/Page_Sign_In.html', 'Page_Sign_In', '{}')
        }, function () {
            glitter.setHome('page/Page_Sign_In.html', 'Page_Sign_In', '{}')
        })
    }, function () {
        alert("資源加載失敗")
    })
    //執行Entry函式
    glitter.runJsInterFace("Entry", {}, function (response) {
    })
}


function initMySocialModel() {
    //定義頁面跳轉
    glitter.publicBeans.publicLogic.checkDataSwitchExecute=function (data){
        data=glitter.unicodeToString(data)
        data = JSON.parse(data)
        switch (data.type) {
            case 'article':
                switch (parseInt(data.circle,10)){
                    case glitter.share.defineCode.normal:
                        glitter.publicBeans.publicLogic.customDefine.selectPost=glitter.share.defineCode.normal
                        glitter.changePage('publicResource/page/Page_Article_List_Type_Dcard.html','Page_Article_List_Type_Dcard',true,{
                            code:glitter.share.defineCode.normal,
                            title:'最新消息'
                        })
                        break
                    case glitter.share.defineCode.activity:
                        glitter.changePage('publicResource/page/Page_Calendar_Type_2.html','Page_Calendar_Type_2',true,{
                            title:'活動',
                            code:glitter.share.defineCode.activity
                        })
                        break
                    case glitter.share.defineCode.vote:
                        glitter.changePage('publicResource/page/Page_List_Vote.html','Page_List_Vote',true,{})
                        break
                    case glitter.share.defineCode.calender:
                        glitter.changePage('publicResource/page/Page_Calendar_Type_2.html','Page_Calendar_Type_2',true,{
                            title:'行事曆',
                            code:glitter.share.defineCode.calender
                        })
                        break
                    case glitter.share.defineCode.activitySync:
                        glitter.changePage('publicResource/page/Page_Calendar_Type_2.html','Page_Calendar_Type_2',true,{
                            title:'行事曆',
                            code:glitter.share.defineCode.calender
                        })
                        break
                    case glitter.share.defineCode.album:
                        glitter.changePage('publicResource/page/Page_Album.html', 'Page_Album',true, {})
                        break
                }
                break
            case 'message':
                if(data.link==='Public'){
                    glitter.changePage('publicResource/page/Page_Show_User_Message_0.html','Page_Show_User_Message_0',true,JSON.parse(`{"id":"18","link":"Public","pick":"留言區","head":"../img/groupBack.jpeg","member":"0","content":"{\\"message\\":\\"8989\\"}","time":"8小時前","timeStamp":1622184965000,"display":"group"}`))
                }else{
                    glitter.share.dataLoading(true)
                    glitter.publicBeans.publicLogic.getWhoTitleMessage({
                        link:data.link
                    },function (response){
                        glitter.share.dataLoading(false)
                        if(response===undefined){
                            glitter.share.internetError()
                        }
                        if(response.result){
                            glitter.changePage('publicResource/page/Page_Show_User_Message_0.html', 'Page_Show_User_Message_0', true, response.data[0])
                        }
                    })
                }

break
            case 'advice':
                glitter.share.dataLoading(true)
                glitter.publicBeans.publicLogic.getAdviceList({
                    defineId: data.id,
                    index: '-1'
                }, function (response) {
                    glitter.share.dataLoading(false)
                    if (response === undefined) {
                        glitter.share.internetError()
                    } else {
                        if (response.result) {
                            if (response.data.length > 0) {
                                let data = JSON.parse(response.data[0].message)
                                glitter.openDiaLog('publicResource/dialog/Dia_Show_Advice.html', 'Dia_Show_Advice', false, false, data, function () {
                                })
                            } else {
                                glitter.share.hint("推播已刪除!")
                            }
                        }
                    }
                })
                break
        }
    }
    //定義公用UI
    glitter.share.publicUI = {
        sub: function (a) {
            if (a) {
                return `<svg aria-label="移除" class="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 28.9 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1z"></path></svg>`
            } else {
                return `<svg aria-label="儲存" class="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path></svg>`
            }
        },
        love: function (a) {
            if (a) {
                return `<svg aria-label="收回讚" class="_8-yf5 " fill="#ed4956" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>`
            } else {
                return `<svg aria-label="讚" class="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>`
            }
        },
        message: function () {
            return `<svg aria-label="回應" class="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clip-rule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fill-rule="evenodd"></path></svg>`
        },
        topBar: function (title) {
            return `<div class="topBar" style="   display: flex;
    align-items: center;
    height: 50px;
    padding-left: 10px;
    padding-right: 10px;">
    <img src="../publicResource/img/arrow_left.png" style="width: 30px;height: 30px;" onmousedown="glitter.goBack();">
    <h3 style="font-size: 18px;margin-left: 10px;color: black;">${title}</h3>
    <div style="flex: auto;"></div>
</div>`
        }
    }
    //取得設定值
    glitter.serialUtil.getObject( 'settingObj', 'SettingObj', function (data) {
        if(data!==undefined){
            glitter.copyObj(glitter.share.settingObj,data)
        }

    }, function () {
    })
}

//定義發布類型文章區分
glitter.share.defineCode = {
    //活動
    activity: "10",
    normal: "1",
    ad: "-10",
    news: "2",
    vote:"3",
    album:"4",
    //會費資訊
    priceInfo:"5",
    //會員交流
    users:"6",
    //行事曆
    calender:"7",
    //組織章程
    organization:"8",
    //會員繳費
    priceAccount:"11",
    //隱私權政策
    privacyInfo:"12",
    //成立宗旨
    whyCreate:"13",
    //聯絡資訊
    contact:"16",
    //活動與行事曆
    activitySync:"14"
}
//定義會員類型
glitter.share.userType = {
    manager: 1,
    normal:0,
    noPermission:-1
}

//定義收到推播的跳轉判斷
glitter.share.fireBaseReceiver = {
    //封鎖顯示的Topics
    blockTopics: [],
    //推播回條
    callBack: function (topic) {
        return (glitter.share.fireBaseReceiver.blockTopics.indexOf(topic) === -1)
    }
}

//定義設定變數
glitter.share.settingObj = {
    storeAccount: true,
    brocadcast:0
}
//儲存設定變數
glitter.share.storeSetting = function (execute) {
    execute(glitter.share.settingObj)
    glitter.serialUtil.storeObject(glitter.share.settingObj, 'settingObj', 'SettingObj', function () {}, function () {})
}
//定義收到推播的跳轉判斷
glitter.share.fireBaseReceiver={
    //封鎖顯示的Topics
    blockTopics:[],
    //推播回條
    callBack:function (topic){
        return (glitter.share.fireBaseReceiver.blockTopics.indexOf(topic)===-1)
    }
}


