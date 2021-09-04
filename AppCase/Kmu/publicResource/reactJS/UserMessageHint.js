//留言列表
var clickTimer=undefined
var canClick=true
//屏蔽訊息
var blockId=[]
var ListItem = createReactClass({
    render:function (){
        var that=this
        if(blockId.indexOf(that.props.data.id)!==-1){
            return ``
        }
        let jsonMessage=JSON.parse((this.props.data.content))
        let longClick=function (){
            clickTimer=setTimeout(function (){
                canClick=false
                setTimeout(function (){canClick=true},1000)
                var itemMap=[{title:'複製內容',callback:function (){
                    glitter.copyText(jsonMessage.message)
                    glitter.share.hint('已複製內容')
                }},
                    {title:'檢舉內容',callback:function (){
                       glitter.openDiaLog('publicResource/dialog/Dia_Report.html','Dia_Report',false,false,{},function (){})
                            glitter.closeBottomSheet()
                    }}
                ]
                if((that.props.data.account === glitter.publicBeans.publicLogic.customDefine.account)||(glitter.publicBeans.publicLogic.customDefine.isManager()))
                {
                    itemMap.push({
                        title:'刪除留言',
                        callback:function (){
                            glitter.openDiaLog('publicResource/dialog/Check_Yes_Not.html','Check_Yes_Not',false,false,{
                                title:'是否移除留言!?',
                                callback:function (result){
                                    if(result){
                                        glitter.share.dataLoading(true)
                                        glitter.publicBeans.publicLogic.deleteUserMessage({
                                            id:that.props.data.id,
                                            link:gBundle.link
                                        },function (response){
                                            glitter.share.dataLoading(false)
                                            if(response.result){
                                                messageView.state.data.splice(that.props.index, 1);
                                                messageView.state.elementHeights.splice(that.props.index, 1);
                                                messageView.setState({})
                                                glitter.share.hint('刪除成功!!')
                                            }else{
                                                glitter.share.hint('刪除失敗!!')
                                            }
                                        })
                                    }
                                    glitter.closeDiaLogWithTag('Check_Yes_Not')
                                }
                            },function (){})
                        }
                    })
                }
                if(glitter.needBlock){
                    itemMap.push({
                        title:'屏蔽訊息',
                        callback:function (){
                            glitter.openDiaLog('publicResource/dialog/Check_Yes_Not.html','Check_Yes_Not',false,false,{
                                title:'是否屏蔽訊息!?',
                                callback:function (result){
                                    if(result){
                                        blockId.push(that.props.data.id)
                                        glitter.share.hint('屏蔽成功!!')
                                    }
                                    glitter.closeDiaLogWithTag('Check_Yes_Not')
                                }
                            },function (){})
                        }
                    })
                }
                glitter.openBottomSheet('publicResource/dialog/Dia_Select_Option.html','Dia_Select_Option',itemMap,10,true,true)
            },1000)
        }
        let stopClick=function (){
            clearInterval(clickTimer)
        }
        if(that.props.data.account === glitter.publicBeans.publicLogic.customDefine.account){
            if(jsonMessage.img!==undefined){
                return <div className="itemMessage" id={`itemMessage`+this.props.index} onPointerDown={function (e){
                    longClick()
                }}
                onPointerUp={function (e){
                    stopClick()
                }} onPointerOut={function (e){
                    stopClick()
                }}>
                    <div className="flexUser">
                        <div className="space"></div>
                        <div className="flexCenter">
                            <div className="rePlylove">
                                <div className="space"></div>
                                <div className="flexslider textPLace me" id={`flexslider`+this.props.index} onClick={
                                    function (e){
                                        if(!canClick){return}
                                        glitter.changePage('publicResource/page/Page_Show_Image.html','Page_Show_Image',true, jsonMessage.img)
                                    }
                                }>
                                    <ul className="slides" id={`imageList`+this.props.index}></ul>
                                    <div id={`imageIndex`+this.props.index} className={"imageIndex"}></div>
                                </div>
                            </div>
                            <div className="rePlylove">
                                
                                <div className="space"></div>
                                <span className="time">{`${(this.props.data.time)}`}</span>

                            </div>
                        </div>
                    </div>

                </div>
            }else if(jsonMessage.video!==undefined){

                return <div className="itemMessage" id={`itemMessage`+this.props.index} onPointerDown={function (e){
                    longClick()
                }}
                            onPointerUp={function (e){
                                stopClick()
                            }} onPointerOut={function (e){
                    stopClick()
                }}>
                    <div className="flexUser">
                        <div className="space"></div>
                        <div className="flexCenter">
                            <div className="rePlylove">
                                <div className="space"></div>
                                <div className="flexslider textPLace me" id={`flexslider`+this.props.index} onClick={
                                    function (e){
                                        if(!canClick){return}
                                        glitter.changePage('publicResource/page/Page_Show_Video.html','Page_Show_Video',true, jsonMessage.video)
                                    }
                                }>
                                    <ul className="slides" id={`imageList`+this.props.index}></ul>
                                    <div id={`imageIndex`+this.props.index} className={"imageIndex"}></div>
                                </div>
                            </div>
                            <div className="rePlylove">
                                <div className="space"></div>
                                <span className="time">{`${(this.props.data.time)}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            return <div className="itemMessage" id={`itemMessage`+this.props.index}  onPointerDown={function (e){
                longClick()
            }}
                        onPointerUp={function (e){
                            stopClick()
                        }} onPointerOut={function (e){
                stopClick()
            }}>
                <div className="flexUser">
                    <div className="space"></div>
                    <div className="flexCenter">
                        <h4 className="textPLace me" dangerouslySetInnerHTML={{__html: (jsonMessage.message)}}>
                        </h4>
                        <div className="rePlylove">
                            <div className="space"></div>
                            <span className="time">{`${(this.props.data.time)}`}</span>
                            
                        </div>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>
        }else{
            if(jsonMessage.img!==undefined){
                return <div className="itemMessage" id={`itemMessage`+this.props.index}  onPointerDown={function (e){
                    longClick()
                }}
                            onPointerUp={function (e){
                                stopClick()
                            }} onPointerOut={function (e){
                    stopClick()
                }}>
                    <div className="flexUser">
                        <img src={this.props.data.head} className="img"></img>
                        <div className="flexCenter">
                            <span className="pick">{`${(this.props.data.pick)}`}</span>
                            <div className="flexslider textPLace" id={`flexslider`+this.props.index} onClick={
                                function (e){
                                    if(!canClick){return}
                                    glitter.changePage('publicResource/page/Page_Show_Image.html','Page_Show_Image',true, jsonMessage.img)
                                }

                            }>
                                <ul className="slides" id={`imageList`+this.props.index}></ul>
                                <div id={`imageIndex`+this.props.index} className={"imageIndex grayText"}></div>
                            </div>
                            <div className="rePlylove">
                                <span className="time">{`${(this.props.data.time)}`}</span>
                                <div className="space"></div>
                            </div>
                        </div>
                        <div className="space"></div>
                    </div>

                </div>
            }else if(jsonMessage.video!==undefined){
                return <div className="itemMessage" id={`itemMessage`+this.props.index}  onPointerDown={function (e){
                    longClick()
                }}
                            onPointerUp={function (e){
                                stopClick()
                            }} onPointerOut={function (e){
                    stopClick()
                }}>
                    <div className="flexUser">
                        <img src={this.props.data.head} className="img"></img>
                        <div className="flexCenter">
                            <span className="pick">{`${(this.props.data.pick)}`}</span>
                            <div className="flexslider textPLace" id={`flexslider`+this.props.index} onClick={
                                function (e){
                                    if(!canClick){return}
                                    glitter.changePage('publicResource/page/Page_Show_Video.html','Page_Show_Video',true, jsonMessage.video)
                                }
                            }>
                                <ul className="slides" id={`imageList`+this.props.index}></ul>
                                <div id={`imageIndex`+this.props.index} className={"imageIndex grayText"}></div>
                            </div>
                            <div className="rePlylove">
                                <span className="time">{`${(this.props.data.time)}`}</span>
                                
                                <div className="space"></div>
                            </div>
                        </div>
                        <div className="space"></div>
                    </div>

                </div>
            }
            return <div className="itemMessage" id={`itemMessage`+this.props.index}  onPointerDown={function (e){
                longClick()
            }}
                        onPointerUp={function (e){
                            stopClick()
                        }} onPointerOut={function (e){
                stopClick()
            }}>
                <div className="flexUser">
                    <img src={this.props.data.head} className="img"></img>
                    <div className="flexCenter">
                        <span className="pick">{`${(this.props.data.pick)}`}</span>
                        <h4 className="textPLace" dangerouslySetInnerHTML={{__html: (jsonMessage.message)}}>
                        </h4>
                        <div className="rePlylove">
                            <span className="time">{`${(this.props.data.time)}`}</span>
                            
                        </div>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>
        }

    },
    componentDidMount:function (){
        let index=this.props.index
        let height=$(`#itemMessage${(index)}`).height()

        if(height!==undefined){publicShare.changeItemHeight(index,height)}
        let jsonMessage=JSON.parse((this.props.data.content))
        if(jsonMessage.img!==undefined){
            console.log(height)
            jsonMessage.img.map(function (data){
                $('#imageList'+index).append(`<li><img src="${data}" /></li>`)
            })
            $("#flexslider"+index).flexslider({
                controlNav: false,slideshowSpeed: 3000,
                directionNav: false, after: function (slider) {

                }
            });
            $('#imageIndex'+index).html(`傳送了${jsonMessage.img.length}張圖片`)
        }else if(jsonMessage.video!==undefined){
            $('#imageList'+index).append(`<li><img src="${jsonMessage.video}/thumb.jpg" /></li>`)
            $("#flexslider"+index).flexslider({
                controlNav: false,slideshowSpeed: 3000,
                directionNav: false, after: function (slider) {

                }
            });
            $('#imageIndex'+index).html(`傳送了1則影片`)
        }
    },
    preventClick:false
});
var publicShare={
    changeItemHeight:function (){}
}
var VariableInfiniteList = createReactClass({
    getInitialState: function() {
        return {
            elementHeights: [],
            isInfiniteLoading: false,
            data:[]
        };
    },
    generateVariableElementHeights: function(number,height) {
        var heights = [];
        for (var i = 0; i < number; i++) {
            heights.push(height);
        }
        return heights;
    },
    handleInfiniteLoad: function() {
        if(this.state.isInfiniteLoading||this.isBtn){return}
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        function loadData(){
            glitter.publicBeans.publicLogic.getUserMessage({
                index:that.index,
                link:gBundle.link
            },function (response){
                if(response===undefined){
                    loadData()
                }else{
                    if(response.result){
                        getFirstDataFinish=true
                        if(response.data.length===0){
                            that.isBtn=true
                            that.setState({})
                        }else{
                            that.index=response.data[response.data.length-1].id
                            that.setState({
                                isInfiniteLoading: false,
                                elementHeights: that.generateVariableElementHeights(response.data.length,100).concat(that.state.elementHeights),
                                data:response.data.reverse().concat(that.state.data)
                            });
                        }
                    }else{
                        loadData()
                    }
                }
            })
        }
        loadData()
    },
    elementInfiniteLoad: function() {
        if(this.isBtn){return ``}
        return <div className="infinite-list-item textLoading">
        </div>;
    },
    render: function() {
        let that=this
        messageView=that
        publicShare.changeItemHeight=function (index,height){
            if(that.state.elementHeights[index]===height){return}
            that.state.elementHeights[index]=height
            that.setState({});
        }
        addData=function (data){
            that.setState({
                elementHeights: that.state.elementHeights.concat(300),
                isInfiniteLoading: false,
                data:(that.state.data).concat([data])
            });
        }
        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        return <Infinite
            elementHeight={this.state.elementHeights}
            containerHeight={viewHeight}
            infiniteLoadBeginEdgeOffset={200}
            onInfiniteLoad={this.handleInfiniteLoad}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            timeScrollStateLastsForAfterUserScrolls={100}
            displayBottomUpwards
        >
            {elements}
        </Infinite>;
    },
    componentDidMount:function (){
        setTimeout(function (){
            // glitter.scrollToBtn()
            // $('#UserMessage div').scrollTop(0)
            // alert($('#UserMessage div').get(0).scrollTop )
        },2000)

    },
    //是否滾到底部
    isBtn:false,
    index:'-1'
});
var addData=function (data){

}
var viewHeight=0
let timer=setInterval(function (){
    if(document.getElementById('UserMessage')){
        viewHeight=$('#UserMessage').height()
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('UserMessage'));
        clearInterval(timer)
    }
},100)
var getFirstDataFinish=false
var messageView=undefined
var loading=false
var getDataTimer=setInterval(function (){
    if(getFirstDataFinish&&messageView){
        console.log('getData')
        if( loading){return}
        loading=true
        glitter.publicBeans.publicLogic.getUserMessage({
            index:(messageView.state.data.length>0) ? messageView.state.data[messageView.state.data.length-1].id:'-1',
            link:gBundle.link,
            prePand:true
        },function (response){
            if(response===undefined){
            }else{
                if(response.result){
                    loading=false
                    if(response.data.length===0){
                        messageView.setState({})
                    }else{
                        messageView.setState({
                            elementHeights: messageView.state.elementHeights.concat(messageView.generateVariableElementHeights(response.data.length,100)),
                            data:(messageView.state.data).concat(response.data.reverse())
                        });
                    }
                }
            }
        })
    }
},1000)
// //取得Server訊息
// let mySocket = new WebSocket(`${glitter.publicBeans.publicLogic.customDefine.webSocket}/Chat`);
// mySocket.onmessage = function(e) {
//   //  console.log(e.data)
//     addData(JSON.parse(e.data))
// }
// mySocket.onclose=function (){
//     mySocket= new WebSocket(`${glitter.publicBeans.publicLogic.customDefine.webSocket}/Chat`);
// }
// var link=gBundle.link
// let socketTimer=setInterval(function (){
//    if((mySocket.readyState===1) && (link!==undefined)){
//        mySocket.send(link)
//        clearInterval(socketTimer)
//    }
// },100)




