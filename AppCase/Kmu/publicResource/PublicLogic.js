"use strict";
//定義社群APP公用邏輯
var routName = "PublicLogic"
glitter.publicBeans.publicLogic = {
    customDefine: {
        //WebSocket路徑
        webSocket: 'ws://54.199.109.182',
        // webSocket: 'ws://192.168.0.21',
        //登入帳號
        account: '',
        //登入用密碼(強調資安的話可以帶入TOKEN進行取代)
        password: '',
        //套用的模組APP
        app: '',
        //文章顯示頁面類型[0]
        articleAppearType: 1,
        //設定背景主題顏色
        themeColor: 'dodgerblue',
        //用戶資料
        user_data: {},
        /**圖片壓縮設定**/
        compressRatio: 1,
        canvas: document.createElement("canvas"),
        /*設定發布版區*/
        post_type: [],
        selectPost: {title: '', code: -2},
        /*設定查詢的版區過濾*/
        selectArticlePlace: {code: undefined},
        /*廣告文章的code place*/
        adArticle: {code: -10},
        /*判斷是否為管理員*/
        isManager: function () {
            return (glitter.publicBeans.publicLogic.customDefine.user_data.manager == 1)
        },
        /*FireBase推播ID*/
        fireBaseID: '',
        /*我的追蹤*/
        myFollow: [],
        /*用戶ID*/
        userId:'',
    },
    /**登入API
     * request->{app,account,password}
     * response->{result}
     * */
    sign: function (userID,password,responses) {
        glitter.postRequest(routName, "login", {
            userID: userID,
            password: password,
            app: glitter.publicBeans.publicLogic.customDefine.app,
            fireBaseID: glitter.publicBeans.publicLogic.customDefine.fireBaseID
        }, function (response) {
            if (response === undefined) {
                responses(undefined)
                return
            }
            if (response.result) {
                var store = {
                    userID: userID,
                    password: password
                }
                glitter.setPro("account", JSON.stringify(store), function (response) {
                })
                glitter.publicBeans.publicLogic.customDefine.myFollow = response.myFollow
                glitter.publicBeans.publicLogic.customDefine.user_data = JSON.parse(response.data)
                glitter.publicBeans.publicLogic.customDefine.account=glitter.publicBeans.publicLogic.customDefine.user_data.account
                glitter.publicBeans.publicLogic.customDefine.password=glitter.publicBeans.publicLogic.customDefine.user_data.password
            }
            responses(response)
        })
    },
    /**用戶註冊
     * */
    havePhone:function (data,response){
        glitter.postRequest(routName,"havePhone",{
            app:glitter.publicBeans.publicLogic.customDefine.app,
            phone:data
        },response)
    }
    ,
    /**忘記密碼
     * */
    forgetPassword:function (map,response){
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName,"forgetPassword",map,response)
    }
    ,
    /**重設密碼
     * */
    resetPassword:function (map,response){
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.password=glitter.publicBeans.publicLogic.customDefine.password
        map.account=glitter.publicBeans.publicLogic.customDefine.account
        glitter.postRequest(routName,"resetPassword",map,response)
    }
    ,
    /**用戶註冊
     * */
    register: function (data, responses) {
        glitter.postRequest(routName, "register", {
            userID: data.userID,
            password: data.password,
            app: glitter.publicBeans.publicLogic.customDefine.app,
            data: data,
            fireBaseID: glitter.publicBeans.publicLogic.customDefine.fireBaseID
        }, function (response) {
            if(response===undefined){responses(undefined)}
            if (response.result) {
                var store = {
                    userID: data.userID,
                    password: data.password
                }
                glitter.setPro("account", JSON.stringify(store), function (response) {
                })
            }
            responses(response)
        })
    },
    /**更改用戶資料
     * */
    changeInfo: function (data, responses) {
        glitter.postRequest(routName, "changeInfo", {
            account: glitter.publicBeans.publicLogic.customDefine.account,
            password: glitter.publicBeans.publicLogic.customDefine.password,
            app: glitter.publicBeans.publicLogic.customDefine.app,
            data: data
        }, function (response) {
            responses(response)
        })
    }
    ,
    /**FB登入API
     * */
    faceBookLogin: function (responses) {
        glitter.runJsInterFace("SignInFaceBook", {}, function (it1) {
            if ((it1.result === 'cancel') || (!it1.result)) {
                responses(it1)
                return
            }
            it1.fireBaseID = glitter.publicBeans.publicLogic.customDefine.fireBaseID
            it1.app = glitter.publicBeans.publicLogic.customDefine.app
            it1.data.pick = (it1.data.pick)
            glitter.postRequest(routName, "SignInWithSocialApp", it1, function (response) {
                if (response === undefined) {
                    responses(undefined)
                    return
                }
                if (response.result) {
                    glitter.publicBeans.publicLogic.customDefine.myFollow = response.myFollow
                    glitter.publicBeans.publicLogic.customDefine.user_data = JSON.parse(response.data)
                    glitter.publicBeans.publicLogic.customDefine.account=glitter.publicBeans.publicLogic.customDefine.user_data.account
                    glitter.publicBeans.publicLogic.customDefine.password=glitter.publicBeans.publicLogic.customDefine.user_data.password
                    var store = {
                        account: glitter.publicBeans.publicLogic.customDefine.account,
                        password: glitter.publicBeans.publicLogic.customDefine.password
                    }
                    glitter.setPro("account", JSON.stringify(store), function (response) {
                    })
                }
                response.socialData=it1
                responses(response)
            })
        })
    },
    /**Google登入API
     * */
    googleLogin: function (responses) {
        glitter.runJsInterFace("SignInGoogle", {}, function (it1) {
            if ((it1.result === 'cancel') || (!it1.result)) {
                responses(it1)
                return
            }
            it1.fireBaseID = glitter.publicBeans.publicLogic.customDefine.fireBaseID
            it1.app = glitter.publicBeans.publicLogic.customDefine.app
            it1.data.pick = (it1.data.pick)
            glitter.postRequest(routName, "SignInWithSocialApp", it1, function (response) {
                if (response === undefined) {
                    responses(undefined)
                    return
                }
                if (response.result) {
                    glitter.publicBeans.publicLogic.customDefine.myFollow = response.myFollow
                    glitter.publicBeans.publicLogic.customDefine.user_data = JSON.parse(response.data)
                    glitter.publicBeans.publicLogic.customDefine.account=glitter.publicBeans.publicLogic.customDefine.user_data.account
                    glitter.publicBeans.publicLogic.customDefine.password=glitter.publicBeans.publicLogic.customDefine.user_data.password
                    var store = {
                        account: glitter.publicBeans.publicLogic.customDefine.account,
                        password: glitter.publicBeans.publicLogic.customDefine.password
                    }
                    glitter.setPro("account", JSON.stringify(store), function (response) {
                    })
                }
                response.socialData=it1
                responses(response)
            })
        })
    },
    /**文章爬取API
     * request->{app,id,account}
     * */
    getArticle: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getArticle", map, response)
    },
    /**取得文章數量
     * request->{app,id,account}
     * */
    getArticleCount: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getArticleCount", map, response)
    },
    /**文章按讚API
     * request->{app,id,account}
     * */
    postLike: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        glitter.postRequest(routName, "postLike", map, response)
    },
    /**顯示文章頁面模板
     * */
    showArticle: function (data) {
        switch (glitter.publicBeans.publicLogic.customDefine.articleAppearType) {
            case 0:
                glitter.changePage('publicResource/page/Page_Show_Article_Type_0.html', 'Page_Show_Article', true, data)
                break
            case 1:
                glitter.changePage('publicResource/page/Page_Show_Article_Type_1.html', 'Page_Show_Article', true, data)
                break
        }
    },
    /**顯示商城頁面模板
     * */
    showCommidity: function (data) {
        switch (glitter.publicBeans.publicLogic.customDefine.articleAppearType) {
            case 0:
                glitter.changePage('publicResource/page/Page_Show_Commidity.html', 'Page_Show_Commidity', true, data)
                break
            case 1:
                glitter.changePage('publicResource/page/Page_Show_Commidity.html', 'Page_Show_Commidity', true, data)
                break
        }
    },
    /**顯示文章留言模板
     * */
    showArticleReply: function (id, data) {
        data.replyId = id
        switch (glitter.publicBeans.publicLogic.customDefine.articleAppearType) {
            case 0:
                glitter.changePage('publicResource/page/Page_Article_Reply_Type_0.html', 'Page_Article_Reply_Type_0', true, data)
                break
            case 1:
                glitter.changePage('publicResource/page/Page_Article_Reply_Type_0.html', 'Page_Article_Reply_Type_0', true, data)
                break
        }
    },
    /**
     * 圖片上傳模板
     * */
    uploadImage: function (files, response) {
        var b64Array = []
        let canvas = glitter.publicBeans.publicLogic.customDefine.canvas
        let context = glitter.publicBeans.publicLogic.customDefine.canvas.getContext("2d")
        let compressRatio = glitter.publicBeans.publicLogic.customDefine.compressRatio
        for (let a = 0; a < files.length; a++) {
            let img = new Image()
            let file = files[a];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function getFileInfo(evt) {
                img.src = evt.target.result;
            };
            img.onload = function (e) {
                let width = this.width, height = this.height
                canvas.width = width;
                canvas.height = height;
                context.clearRect(0, 0, width, height);
                context.drawImage(img, 0, 0, width, height);
                canvas.toBlob(function (blob) {
                    glitter.publicBeans.publicLogic.getFileBase64Encode(blob).then(b64 => {
                            b64Array = b64Array.concat(b64)
                            if (b64Array.length === files.length) {
                                let map = {
                                    account: glitter.publicBeans.publicLogic.customDefine.account,
                                    password: glitter.publicBeans.publicLogic.customDefine.password,
                                    app: glitter.publicBeans.publicLogic.customDefine.app,
                                    b64: b64Array
                                }
                                glitter.postRequest(routName, "uploadImage", map, response)
                            }
                        }
                    );
                }, "image/jpeg", compressRatio);
            }
        }
    },
    /**
     * 影片上傳模板
     * */
    uploadVideo: function (file, response) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        glitter.publicBeans.publicLogic.getFileBase64Encode(file).then(b64 => {
                let map = {
                    account: glitter.publicBeans.publicLogic.customDefine.account,
                    password: glitter.publicBeans.publicLogic.customDefine.password,
                    app: glitter.publicBeans.publicLogic.customDefine.app,
                    b64: b64
                }
                glitter.postRequest(routName, "uploadVideo", map, response)
            }
        );
    },
    /**
     * 檔案上傳模板
     * */
    uploadFile: function (file, response) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        glitter.publicBeans.publicLogic.getFileBase64Encode(file).then(b64 => {
                let map = {
                    account: glitter.publicBeans.publicLogic.customDefine.account,
                    password: glitter.publicBeans.publicLogic.customDefine.password,
                    app: glitter.publicBeans.publicLogic.customDefine.app,
                    b64: b64,
                    name:file.name
                }
                glitter.postRequest(routName, "uploadFile", map, response)
            }
        );
    },
    /**
     * 文章上傳模板
     * */
    uploadArticle: function (data, response) {
        var map = {}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        if(data.circle===undefined){data.circle = glitter.publicBeans.publicLogic.customDefine.selectPost.code}
        data.account = glitter.publicBeans.publicLogic.customDefine.account
        data.content=data.content.replace(/\n/g, '<br>').replace('\\','\\\\').replace(/'/g, "\\'")
        map.data = data
        glitter.postRequest(routName, "uploadArticle", map, response)
    },
    /**
     * 文章留言模板
     * */
    replyMessage: function (articleId, data, response) {
        var map = {}
        map.id = articleId
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.type = data.type
        data.type = undefined
        data.message = (data.message).replace(/\n/g, '<br>').replace('\\','\\\\').replace(/'/g, "\\'")
        data.account = glitter.publicBeans.publicLogic.customDefine.account
        map.data = data
        glitter.postRequest(routName, "replyMessage", map, response)
    },
    /**
     * 取得留言模板
     * */
    getReplyMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getReplyMessage", map, response)
    },
    /**
     * 收藏文章
     * */
    subArticle: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "subArticle", map, response)
    },
    /**
     * 參加活動
     * */
    joinActivity: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "joinActivity", map, response)
    },
    /**
     * 取得參加的人員
     * */
    getJoinUSer: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "joinUser", map, response)
    },
    /**
     * 取得按讚的人員
     * */
    getLoveUser: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "loveUserList", map, response)
    },
    /**
     * 取得留言按讚模板
     * */
    postLikeReplyMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "postLikeReplyMessage", map, response)
    },
    /**
     * 取得用戶訊息
     * */
    getUserMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getMessage", map, response)
    },
    /**
     * 刪除用戶訊息
     * */
    deleteUserMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "deleteUserMessage", map, response)
    },
    /**
     * 取得用戶標頭訊息
     * */
    getUserTitleMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getUserTitleMessage", map, response)
    },
    /**
     * 發布訊息給用戶
     * */
    postUserMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.pick = glitter.publicBeans.publicLogic.customDefine.user_data.pick
        glitter.postRequest(routName, "postMessage", map, response)
    },
    /**
     * 取得朋友清單
     * */
    getMyFriend: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getMyFriend", map, response)
    },
    getMyFollow: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getMyFollow", map, response)
    },
    /**
     * 用戶搜尋
     * */
    searchUser: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "searchPeople", map, response)
    },
    /**
     * 用戶搜尋
     * */
    addChat: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "addChat", map, response)
    },
    /**
     * 添加至購物清單
     * */
    addShoppingList: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "addShoppingList", map, response)
    },
    /**
     * 用戶推波清單
     * */
    getAdviceList: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getAdviceList", map, response)
    },
    /**
     * 建立群組
     * */
    createGroup: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "createGroup", map, response)
    },
    /**
     * 用戶打招呼訊息設定
     * */
    setHelloMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "setHelloMessage", map, response)
    },
    /**
     * 用戶打招呼訊息取得
     * */
    getHelloMessage: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getHelloMessage", map, response)
    },
    /**
     * 添加跑馬燈
     * */
    addMarquee: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "addMarquee", map, response)
    },
    /**
     * 刪除跑馬燈
     * */
    deleteMarquee: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "deleteMarquee", map, response)
    },
    /**
     * 編輯跑馬燈
     * */
    editMarquee: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.data=map.data.replace(/\n/g, '<br>').replace('\\','\\\\').replace(/'/g, "\\'")

        glitter.postRequest(routName, "editMarquee", map, response)
    },
    /**
     * 取得跑馬燈
     * */
    getMarquee: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getMarquee", map, response)
    },
    /**
     * 編輯文章內容
     * */
    editArticle: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "editArticle", map, response)
    },
    /**
     * 發布推播
     * */
    postNotification: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "postNotification", map, response)
    },
    /**
     * 預設推播註冊
     * */
    subTopics:function (){
        //共用聊天室
        glitter.publicBeans.publicLogic.subScribeTopic("Public")
        //個人推播
        glitter.publicBeans.publicLogic.subScribeTopic("my_"+glitter.publicBeans.publicLogic.customDefine.account)
        //他人推播
        glitter.publicBeans.publicLogic.subScribeTopic("to_"+glitter.publicBeans.publicLogic.customDefine.account)
        //管理員向他人推播
        glitter.publicBeans.publicLogic.subScribeTopic("manager")
    },
    /**
     * 預設推播註冊
     * */
    deleteTopics:function (){
       glitter.runJsInterFace("clearScrible",{},function (){
       })
    },

    /**
     * 推播註冊
     * */
    subScribeTopic: function (topic) {
        glitter.runJsInterFace("subScrible", {topic: topic}, function () {
        })
    },
    /**
     * 刪除文章
     * */
    deleteArt: function (id, response) {
        var map = {}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.id = id
        glitter.postRequest(routName, "deleteArt", map, response)
    },
    /**
     * 刪除用戶
     * */
    deleteUser: function (id, response) {
        var map = {}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.id = id
        glitter.postRequest(routName, "deleteUser", map, response)
    },
    /**
     * 刪除用戶留言
     * */
    deleteMessageMemory:function (map,response){
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.app= glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "deleteMessageMemory", map, response)
    },
    /**
     * 更新用戶全縣
     * */
    updateAuth: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "updateUserPermission", map, response)
    },
    /**
     * 刪除連結
     * */
    deleteLink: function (id, response) {
        var map = {}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.id = id
        glitter.postRequest(routName, "deleteLink", map, response)
    },
    /**
     * 更改文章內容
     * */
    editArticleAll: function (data, response) {
        var map = {}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.data = data
        data.title=data.title.replace(/\n/g, '<br>').replace('\\','\\\\').replace(/'/g, "\\'")
        data.content=data.content.replace(/\n/g, '<br>').replace('\\','\\\\').replace(/'/g, "\\'")
        glitter.postRequest(routName, "editArticleAll", map, response)
    }
    ,
    /**
     * 取得用戶資訊
     * */
    getUserInfo: function (toAccount, response) {
        var map = {}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.toAccount = toAccount
        glitter.postRequest(routName, "getUserInfo", map, response)
    },
    /**
     * 添加好友
     * */
    addFriend: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "addFriend", map, response)
    },
    /**
     * 添加好友
     * */
    postVote:function (map,response){
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "postVote", map, response)
    }
    ,
    /**
    * 取得投票
    * */
    getVote:function (map,response){
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getVote", map, response)
    },
    /**
     * 取得投票的人員
     * */
    getVoteUser: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getVoteUser", map, response)
    },
    /**
     * 添加公用連結
     * */
    addPublicLink:function (data,response){
        var map={}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.data=data
        glitter.postRequest(routName, "AddPublicLink", map, response)
    },
    /**
     * 編輯公用連結
     * */
    editPublicLink:function (data,response){
        var map={}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.data=data
        glitter.postRequest(routName, "editPublicLink", map, response)
    },
    /**
    * 查詢公用連結
    * */
    listPublicLink:function (map,response){
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "ListLink", map, response)
    }
    ,
    checkDataSwitch: function () {
        //判斷啟動資料做頁面跳轉
        glitter.runJsInterFace("GetExtra", {}, function (response) {
            if (response !== undefined) {
                glitter.publicBeans.publicLogic.checkDataSwitchExecute((response.result))
            }
        })
    },
    /**
     * 判斷頁面跳轉
     * */
    checkDataSwitchExecute: function (data) {
        data=glitter.unicodeToString(data)
        data = JSON.parse(data)
        switch (data.type) {
            case 'article':
                glitter.share.dataLoading(true)
                glitter.publicBeans.publicLogic.getArticle({
                    defineId: data.id,
                    index: '-1'
                }, function (response) {
                    glitter.share.dataLoading(false)
                    if (response === undefined) {
                        glitter.share.internetError()
                    } else {
                        if (response.result) {
                            if (response.data.length > 0) {
                                if (response.data[0].circle === `${glitter.share.defineCode.activity}`) {
                                    glitter.changePage('publicResource/page/Page_Show_Activity.html', 'Page_Show_Activity', true, response.data[0])
                                } else {
                                    glitter.changePage('publicResource/page/Page_IG_ShowArticle.html', 'Page_IG_ShowArticle', true, {
                                        toAccount: glitter.share.manager,
                                        index: '-1',
                                        notCode: ["10"]
                                    })
                                }
                            }
                        }
                    }
                })
                break
            case 'message':
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
    },
    /**
     * 取得titleMessage
     * */
    getWhoTitleMessage:function (map,response){
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getWhoTitleMessage", map, response)
    }
    ,
    getShoppingList: function (map, response) {
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        glitter.postRequest(routName, "getShoppingList", map, response)
    },
    insertShipment: function (data, response) {
        let map = {}
        map.account = glitter.publicBeans.publicLogic.customDefine.account
        map.password = glitter.publicBeans.publicLogic.customDefine.password
        map.app = glitter.publicBeans.publicLogic.customDefine.app
        map.data = data
        glitter.postRequest(routName, "insertShipment", map, response)
    }
    ,
    /**
     * 判斷是否有文章編輯權限
     * */
    haveEditAuth:function (account){
        return glitter.publicBeans.publicLogic.customDefine.isManager() || (glitter.publicBeans.publicLogic.account===account)
    }
    ,
    /**
     * Base64轉換
     * */
    getFileBase64Encode: function (blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}
