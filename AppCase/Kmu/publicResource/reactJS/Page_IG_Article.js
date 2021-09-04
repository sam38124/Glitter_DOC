var ListItem = createReactClass({
    getDefaultProps: function () {
    },
    render: function () {
        var that=this
        var data=that.props.data
        try {
            if (data.circle === "5") {
                if (typeof (data.titleImage) === 'string') {
                    data.titleImage = JSON.parse(data.titleImage)
                    data.image = data.titleImage
                }
            } else {
                if (typeof (data.image) === 'string') {
                    data.image = JSON.parse(data.image)
                }
            }
        } catch (e) {
        }
        if ((data.image === undefined) || data.image.length === 0) {data.image = ["../img/noimage.png"]}
        var imageList = ''
        var imageIndex = ''
        if (data.video !== undefined) {
            imageList += `<div class="imagePlace">
              <div style="width: 100%;display: flex;align-items: center;justify-content: center;"><video id="hls-video" style="width:  100%; max-height:58vw;background-color: black;margin: 0;"  class="video-js vjs-big-play-centered"
       playsinline webkit-playsinline
       autoplay controls preload="true"
       x-webkit-airplay="true" x5-video-player-fullscreen="true" x5-video-player-typ="h5" width="auto" height="auto" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"poster="${data.video}/thumb.jpg">
    <source src="${data.video}/root.m3u8" type="application/x-mpegURL" id="source">
</video></div>
            </div>`
        } else {
            data.image.map(function (data, position) {
                imageList += `<div class="imagePlace">
                <img src="${data}">
            </div>`
                if (position === 0) {
                    imageIndex += `<div class="imgIndex selectI" id="imgIndex${that.props.index}_${position}"></div>`
                } else {
                    imageIndex += `<div class="imgIndex"  id="imgIndex${that.props.index}_${position}"></div>`
                }
            })
        }
        var contentText=(data.content)
        return <div id={`list-item${this.props.index}`}>
            <div className={`list_item`}>
                <div className={"headBar"} onMouseDown={
                    function (e) {
                        if (that.preventClick) {
                            return
                        }
                        glitter.changePage('publicResource/page/Page_User_Info.html', 'Page_User_Info', true, data.account)
                    }
                }>
                    <img className={"head"} src={data.head}></img>
                    <h3 className={"pick"}>{(data.pick)}</h3>
                    {(glitter.publicBeans.publicLogic.customDefine.myFollow.filter(function (dd) {
                        return dd.account === data.account
                    }).length === 0 && (data.manager !== "1") && (data.account !== glitter.publicBeans.publicLogic.customDefine.account)) ?
                        <h3 className={"follow"} onMouseDown={
                            function (e) {
                                that.preventClick = true
                                setTimeout(function () {
                                    that.preventClick = false
                                }, 10)
                                glitter.share.dataLoading(true)
                                glitter.publicBeans.publicLogic.addFriend({
                                    execute: "add",
                                    toAccount: data.account
                                }, function (response) {
                                    glitter.share.dataLoading(false)
                                    if (response === undefined) {
                                        glitter.share.internetError()
                                    }
                                    if (response.result) {
                                        glitter.publicBeans.publicLogic.customDefine.myFollow.push({account: data.account})
                                        that.setState({})
                                    }
                                })
                            }
                        }>追蹤</h3> : ``}

                    <div style={{"flex": "auto"}}></div>
                    {(data.account === glitter.publicBeans.publicLogic.customDefine.user_data.account) ?
                        <img className={"more"} src={"../img/more.png"} onMouseDown={function (e) {
                            that.preventClick = true
                            setTimeout(function () {
                                that.preventClick = false
                            }, 10)
                            glitter.openBottomSheet('publicResource/dialog/Dia_Select_Art_Option.html', "Dia_Select_Art_Option", data, "100px", true, true)
                        }}></img> : ``}
                </div>
            </div>
            <div id={`slide`+this.props.index} className="single-item" dangerouslySetInnerHTML={{__html:imageList}}></div>
            <div className={"flex"}>
                <span dangerouslySetInnerHTML={{__html:
                        `${glitter.share.publicUI.love(data.myLove)}`
                }} onClick={
                    function () {
                        glitter.openDiaLog('dialog/Dia_DataLoading.html', 'postLike', false, false, '{}')
                        glitter.publicBeans.publicLogic.postLike({
                            id: data.id,
                            type: 'Article'
                        }, function (response) {
                            glitter.closeDiaLogWithTag('postLike')
                            if (response === undefined) {
                                glitter.openDiaLog('dialog/Dia_DisConnect.html', 'DisConnect', false, false, function () {
                                })
                            } else {
                                data.myLove = !data.myLove
                                data.love = (data.myLove) ? `${parseInt(data.love, 10) + 1}` : `${parseInt(data.love, 10) - 1}`
                                that.setState({})
                            }
                        })
                    }
                }></span>
                <span className={"message"} dangerouslySetInnerHTML={{__html:`${glitter.share.publicUI.message()}`}} onClick={
                    function (e){
                        glitter.changePage('publicResource/page/Page_IG_Reply.html','Page_IG_Reply',true,data)
                    }
                } ></span>
                {(data.account!==glitter.publicBeans.publicLogic.customDefine.account) ?  <span dangerouslySetInnerHTML={{
                    __html: `<img src="../img/send.png" style="width: 25px;height: 25px;margin-top:2px;transform: rotate(-20deg);
">`
                }} onClick={function (e) {
                    glitter.share.dataLoading(true)
                    glitter.publicBeans.publicLogic.addChat({
                        toAccount: that.props.data.account
                    }, function (response) {
                        glitter.share.dataLoading(false)
                        if (response === undefined) {
                            glitter.share.hint("請檢察網路連線!!")
                        } else {
                            if (response.result) {
                                that.props.data.link = response.link
                                glitter.changePage('publicResource/page/Page_Show_User_Message_0.html', 'Page_Show_User_Message_0', true, data)
                            } else {
                                glitter.share.hint("發生錯誤!!")
                            }
                        }
                    })
                }}></span> : ``}
                <div className={`indexPlace`} dangerouslySetInnerHTML={{__html:imageIndex}}></div>
                <div className={`auto`}></div>
                <span dangerouslySetInnerHTML={{__html:`${glitter.share.publicUI.sub(that.props.data.mySub)}`}}
                      onClick={
                          function (e) {
                              glitter.share.dataLoading(true)
                              glitter.publicBeans.publicLogic.subArticle({
                                  add:!that.props.data.mySub,
                                  id:that.props.data.id
                              },function (response){
                                  glitter.share.dataLoading(false)
                                  if(response===undefined){
                                      glitter.share.internetError()
                                  }else{
                                      if(response.result){
                                          that.props.data.mySub=!that.props.data.mySub;
                                          that.setState({})
                                      }
                                  }
                              })
                          }
                      }></span>
            </div>
            <h3 className={"loveCount"}>{data.love}個讚</h3>
            <div className={"textContent"}>
                <span className={"content"} onClick={
                    function (e){
                        data.open=true
                        that.setState({})
                    }
                }>
                     <span className={"pick"}>{(data.pick)}</span>
                    {(contentText.length>25&&(!data.open)) ? <div>
                        {contentText.substring(0,25)}
                        <a className={"more"}>...更多內容</a>
                    </div>:contentText}</span>
            </div>
            <span className={`seeReply`} onMouseDown={
                function (e){
                    glitter.changePage('publicResource/page/Page_IG_Reply.html','Page_IG_Reply',true,data)
                }
            }>{(`${data.replyCount}`==="0")?``:`查看全部${data.replyCount}則留言\n`}</span>
            <span className={`time`}>{`\n${data.time}`}</span>
        </div>
    },
    componentDidMount: function () {
        var that=this
        if ($(`#list-item${this.props.index}`).get(0)) {
            if($(`#slide${this.props.index}`)){
                $(`#slide${this.props.index}`).slick();
                $('.slick-arrow').hide()
                $(`#slide${this.props.index}`).on('beforeChange', function(event, slick, currentSlide, nextSlide){
                    $(`#imgIndex${that.props.index}_${nextSlide}`).addClass('selectI')
                    $(`#imgIndex${that.props.index}_${currentSlide}`).removeClass('selectI')
                });
            }
            let height = $(`#list-item${this.props.index}`).height()
            if (height !== undefined) {
                publicShare.changeItemHeight(this.props.index, height)
            }
        }
    }
});
var publicShare = {
    changeItemHeight: function () {
    }
}
var toggleRefresh=false
var VariableInfiniteList = createReactClass({
    componentDidMount:function (){

        PullToRefresh.init({
            mainElement: '#infinite-example-two',
            onRefresh: function(cb) {
                reloadData()
                cb()
            },
            shouldPullToRefresh:function (){
                return $('#infinite-example-two div').get(0).scrollTop<=0
            }
        });
    },
    componentWillUnmount()
    {
        // Don't forget to destroy all instances on unmout
        // or you will get some glitches.
        PullToRefresh.destroyAll();
    },
    getInitialState: function () {
        return {
            elementHeights: [],
            isInfiniteLoading: false,
            data: [],
            adData: [],
            isBtn: false
        };
    },
    generateVariableElementHeights: function (number, height) {
        var heights = [];
        for (var i = 0; i < number; i++) {
            heights.push(height);
        }
        return heights;
    },
    handleInfiniteLoad: function () {
        if (this.state.isInfiniteLoading || this.state.isBtn) {
            return
        }
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });

        //取得文章內容
        function getArticle() {
            listArticleView.requestData.index = (that.state.data.length === 0) ? "-1" : (that.state.data[that.state.data.length - 1].id)
            glitter.publicBeans.publicLogic.getArticle(listArticleView.requestData, function (response) {
                if (response === undefined) {
                    that.setState({
                        isInfiniteLoading: false
                    });
                    that.handleInfiniteLoad()
                } else {
                    let item = response["data"]
                    if (item.length === 0) {
                        that.state.isBtn = true
                    }
                    that.setState({
                        isInfiniteLoading: false,
                        elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(item.length, 10)),
                        data: that.state.data.concat(item)
                    });
                }
            })
        }

        getArticle()
    },
    elementInfiniteLoad: function () {
        if (this.state.isBtn) {
            return ``
        }
        return <div className="infinite-list-item textLoading">
        </div>;
    },
    render: function () {
        var that = this
        reloadData = function () {
            that.setState({
                elementHeights: [],
                isInfiniteLoading: false,
                data: [],
                adData:[],
                isBtn: false
            })
            that.handleInfiniteLoad()
        }
        publicShare.changeItemHeight = function (index, height) {
            if (height <= that.state.elementHeights[index]) {
                return
            }
            that.state.elementHeights[index] = height
            that.setState({});
        }
        let elements = this.state.elementHeights.map(function (el, i) {
            if (i === 0) {
                return <ListItem adData={that.state.adData} key={i} index={i} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
            } else {
                return <ListItem key={i} index={i} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
            }
        })
        if (elements.length === 0 && that.state.isBtn) {
            return <div dangerouslySetInnerHTML={{
                __html: `<img src="../img/emptyFile.gif" style="width: 100%;margin: 0;min-height: 50px;">
                <h3 style="color: grey;margin-top: -100px;width: 100%;display: flex;align-items: center;justify-content: center;font-size: 14px;">尚無內容...</h3>`
            }}></div>
        } else {
            return <Infinite
                elementHeight={this.state.elementHeights}
                containerHeight={height}
                infiniteLoadBeginEdgeOffset={0}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading}
                timeScrollStateLastsForAfterUserScrolls={100}
            >
                {elements}
            </Infinite>;
        }
    }
});

var reloadData = function () {
}
var height=0
//文章加載View
var listArticleView = {
    isInitial:false,
    requestData: {},
    startRequest: function (data) {
        listArticleView.requestData=data
        if(listArticleView.isInitial){
            reloadData()
        }else{
            listArticleView.isInitial=true
            height=$('#infinite-example-two').height()
            ReactDOM.render(<VariableInfiniteList/>, document.getElementById('infinite-example-two'));
        }
    }
}




