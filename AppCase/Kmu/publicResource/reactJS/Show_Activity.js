//文章內容
var updateArticleContent=function (){}
var ArticleContent=createReactClass({
    render:function (){
        let that=this
        updateArticleContent=function (){
            that.setState({})
        }
            return  <div id="Content" dangerouslySetInnerHTML={{__html:`
<div class="scollView">
${(gBundle.image === undefined || gBundle.image.length === 0) ? `
<div style="width: 100%;max-height: 66vw;overflow-y:hidden;white-space:normal;background-color: whitesmoke;display: flex;align-items: center;justify-content: center;flex-direction: column;">
<img src="../../img/actgray.png" style="width:50%;" >
</div>
` : `
<div style="width: 100%;max-height: 66vw;overflow-y:hidden;white-space:normal;background-color: whitesmoke;display: flex;align-items: center;justify-content: center;flex-direction: column;">
<img src="${gBundle.image[0]}" style="width:100%;">
</div>
`}

    <div class="previewContent" id="previewContent">
    <h3 style="color: #de0404;font-size: 18px;margin-top: 10px;margin-bottom:10px;width: 100%;line-height: 25px;">活動時間 :<br> ${gBundle.startTime.substring(0, 16)} 到 ${gBundle.endTime.substring(0, 16)}</h3>
       <h3 style="color:black;margin:0;font-size: 18px;" id="tit">${(gBundle.title)}</h3>
        <div class="flexBar2" >
        <div class="flexItem" onmousedown="
        glitter.share.dataLoading(true)
        glitter.publicBeans.publicLogic.postLike({
            add:!gBundle.myLove,
            id:gBundle.id,
            type:'article'
        },function (response){
            glitter.share.dataLoading(false)
            if(response===undefined){
                glitter.share.internetError()
            }else{
                if(response.result){
                    gBundle.myLove=!gBundle.myLove
                     updateArticleContent()
                }
            }
        })
        ">
        <div  style="width: 50px;height: 50px;border-radius: 25px;background-color: whitesmoke;align-items: center;justify-content: center;display: flex;">
       <img src="${(gBundle.myLove) ? '../img/star_red.png' : '../img/star.png'}" style="width: 30px;height: 30px;">
</div>
        <h3 style="font-size: 14px;margin: 0;">有興趣</h3>
</div>
 <div class="flexItem" onmousedown="
  glitter.share.dataLoading(true)
        glitter.publicBeans.publicLogic.joinActivity({
            add:!gBundle.myJoin,
            id:gBundle.id
        },function (response){
            glitter.share.dataLoading(false)
            if(response===undefined){
                glitter.share.internetError()
            }else{
                if(response.result){
                    gBundle.myJoin=!gBundle.myJoin
                     updateArticleContent()
                }
            }
        })
 ">
        <div style="width: 50px;height: 50px;border-radius: 25px;background-color: whitesmoke;align-items: center;justify-content: center;display: flex;" onclick="postGroupJoin()">
       <img src="${(gBundle.myJoin) ? '../img/check_mark_red.png' : '../img/check_mark.png'}" style="width: 30px;height: 30px;">
</div>
        <h3 style="font-size: 14px;margin: 0;">${(gBundle.myJoin) ? '已參加' : '參加'}</h3>
</div>
 <div class="flexItem" onmousedown="
         glitter.share.dataLoading(true)
        glitter.publicBeans.publicLogic.subArticle({
            add:!gBundle.mySub,
            id:gBundle.id
        },function (response){
            glitter.share.dataLoading(false)
            if(response===undefined){
                glitter.share.internetError()
            }else{
                if(response.result){
                    gBundle.mySub=!gBundle.mySub
                     updateArticleContent()
                }
            }
        })
 ">
        <div style="width: 50px;height: 50px;border-radius: 25px;background-color: whitesmoke;align-items: center;justify-content: center;display: flex;" onclick="">
        <img src="${(gBundle.mySub) ? '../img/bookmark2.png' : '../img/bookmark.png'}" style="width: 30px;height: 30px;">
</div>
        <h3 style="font-size: 14px;margin: 0;">收藏</h3>

</div>
<div class="flexItem" onmousedown="
    glitter.openBottomSheet('publicResource/dialog/Dia_Select_Act_Option.html','Dia_Select_Act_Option',gBundle,'100px',true,true)
 ">
        <div style="width: 50px;height: 50px;border-radius: 25px;background-color: whitesmoke;align-items: center;justify-content: center;display: flex;" onclick="">
        <img src="../img/more.png" style="width: 30px;height: 30px;">
</div>
        <h3 style="font-size: 14px;margin: 0;">更多</h3>

</div>
</div>
${(gBundle.link === '') ? '' : `<div style="background-color: dodgerblue;color: white;display: flex;align-items: center;justify-content: center;height: 40px;border-radius: 10px;" onclick="glitter.openNewTab('${gBundle.link}')">前往活動連結</div>`}
${(gBundle.address !== undefined) ? `<div style="background-color: #e8e8e8;height: 1px;width: 100%;margin-top: 10px;"></div>
<h3 style="color: black;font-size: 16px;display: flex;align-items: center;margin: 10px 0;" onclick="glitter.openNewTab('https://www.google.com/maps/search/?api=1&query=${gBundle.lat},${gBundle.lon}')"> <img src="../img/location.png" style="width: 20px;height: 20px;fill: red;margin-right: 10px;">${(gBundle.address)}</h3>
<div style="background-color: #e8e8e8;height: 1px;width: 100%;"></div>`:``}
<h3 style="color: black;font-size: 16px;margin: 0;color: gray;">活動資訊</h3>
          <div class="selectDic">
                <img onclick="glitter.publicBeans.goUserInfo('${gBundle.account}')" class="head" src="${gBundle.head}" id="headImg">
            <h3 onclick="glitter.publicBeans.goUserInfo('${gBundle.account}')" class="flexText" style="font-size: 16px;font-weight: bold;" id="pickText">${(gBundle.pick)}</h3>
            <div style="flex: auto;"></div>
        </div>
        ${(gBundle.content).replaceAll("\n", "<br>")}
          <div class="cList">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" role="img" aria-hidden="true"
             class="ite">
            <path d="M16.5 4A5.49 5.49 0 0012 6.344 5.49 5.49 0 007.5 4 5.5 5.5 0 002 9.5C2 16 12 22 12 22s10-6 10-12.5A5.5 5.5 0 0016.5 4z"
                  fill-rule="evenodd"></path>
        </svg>
        <h3 style="margin-left:5px;font-size: 14px;color: grey;line-height: 40px;height: 40px;margin-top: 0px"
            id="likeCount">${gBundle.love}</h3>
        <svg viewBox="0 0 24 24" class="ite" focusable="false" width="24" height="24" role="img" aria-hidden="true"
             style="fill: rgba(0, 0, 0, 0.2);margin-left: 10px;">
            <path d="M17 4H7a5 5 0 00-5 5v5a5 5 0 005 5h.5v2.44a.75.75 0 001.22.58L12.5 19H17a5 5 0 005-5V9a5 5 0 00-5-5z"></path>
        </svg>
        <h3 style="margin-left:5px;font-size: 14px;color: grey;line-height: 40px;height: 40px;margin-top: 0;"
            id="replyCount">${gBundle.replyCount}</h3>
    </div>
    </div>
    <div id="listView" style="margin-top: 20px;"></div>
</div>
            `}}>
            </div>
    },
    componentDidMount:function (){
        if($('#Content').get(0)){
            let height=$(`#Content`).height()
            console.log('TextPlaceHeight->'+height)
            if(height!==undefined){
                publicShare.changeItemHeight(0,height)
            }
        }
    }
})
//留言列表
var ListItem = createReactClass({
    render: function() {
        console.log('render')
        let that=this
        return <div className="itemMessage" id={`itemMessage`+this.props.index}>
            <div className="flexUser">
                <img src={this.props.data.head} className="img"></img>
                <div className="flexCenter">
                    <span className="pick">{`${(this.props.data.pick)}`}</span>
                    <span className="textPLace">
                        {`${(this.props.data.message)}`}
                        </span>

                    <div className="rePlylove">
                        <span className="time">{`${(this.props.data.time)}`}</span>
                        <img  src={(this.props.data.myLove) ? '../img/heart2.png' : '../img/heart.png'} onClick={
                            function (e){
                                glitter.share.dataLoading(true)
                                glitter.publicBeans.publicLogic.postLikeReplyMessage({
                                    articleID:gBundle.id,
                                    id:that.props.data.id
                                },function (response){
                                    glitter.share.dataLoading(false)
                                    if(response===undefined){
                                        glitter.share.internetError()
                                    }else{
                                        if(response.result){
                                            that.props.data.myLove=!that.props.data.myLove
                                            that.props.data.love=(parseInt(that.props.data.love,10)+response.data)
                                            that.setState({})
                                        }
                                    }
                                })
                            }
                        }></img>
                        <span>{this.props.data.love}</span>
                        <span onClick={function (e){
                            that.props.data.callback=function (){
                                that.setState({})
                            }
                            glitter.publicBeans.publicLogic.showArticleReply((gBundle.id+"."+that.props.data.id),that.props.data)
                        }} className={'bold'}>
                                {(that.props.data.replyCount==0) ? ' 回覆留言':` ${that.props.data.replyCount}則回覆`}
                            </span>
                    </div>

                    {(that.props.data.subMessage===undefined) ? '':
                        <div className={'inReplyContent'} onClick={function (e){
                            that.props.data.callback=function (){
                                that.setState({})
                            }
                            glitter.publicBeans.publicLogic.showArticleReply((gBundle.id+"."+that.props.data.id),that.props.data)
                        }}>
                            <img src={that.props.data.subMessage.head} className="img"></img>
                            <span className="subPick">{`${(that.props.data.subMessage.pick)}`}</span>
                            <span className="inReplyContentText">
                                    {`${(that.props.data.subMessage.message)}`}
                            </span>
                        </div>}
                </div>

                <div className="spacer"></div>
            </div>
        </div>
    },
    componentDidMount:function (){
        let index=this.props.index
        let height=$(`#itemMessage${(index)}`).height()
        if(height!==undefined){
            publicShare.changeItemHeight(index,height)
        }
    },
    preventClick:false
});
var publicShare={
    changeItemHeight:function (){}
}
var VariableInfiniteList = createReactClass({
    componentDidMount:function (){
    },
    getInitialState: function() {
        return {
            elementHeights: [50],
            isInfiniteLoading: false,
            data:[gBundle]
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
            glitter.publicBeans.publicLogic.getReplyMessage({
                index:that.index,
                id:gBundle.id
            },function (response){
                if(response===undefined){
                    loadData()
                }else{
                    if(response.result){
                        if(response.data.length===0){
                            that.isBtn=true
                            that.setState({isInfiniteLoading: false})
                        }else{
                            that.index=response.data[response.data.length-1].id
                            that.setState({
                                isInfiniteLoading: false,
                                elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(response.data.length,50)),
                                data:that.state.data.concat(response.data)
                            });
                        }
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
        publicShare.changeItemHeight=function (index,height){
            if(height<=that.state.elementHeights[index]){return}
            console.log(`changeHeight-index:${index}-height:${height}-elementHeights:${that.state.elementHeights[index]}`)
            that.state.elementHeights[index]=height
            that.setState({elementHeights: that.state.elementHeights});
        }
        reloadMessage=function (){
            that.index='-1'
            that.state.isInfiniteLoading=false
            that.isBtn=false
            that.state.data=[gBundle]
            that.state.elementHeights=[that.state.elementHeights[0]]
            that.handleInfiniteLoad()
        }
        var elements = this.state.elementHeights.map(function(el, i) {
            if(i===0){
                return <ArticleContent key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
            }else{
                return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
            }
        })
        return <Infinite
            elementHeight={this.state.elementHeights}
            containerHeight={$('#ArticleContent').height()}
            infiniteLoadBeginEdgeOffset={200}
            onInfiniteLoad={this.handleInfiniteLoad}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            timeScrollStateLastsForAfterUserScrolls={1000}

        >
            {elements}
        </Infinite>;
    },
    //是否滾到底部
    isBtn:false,
    index:'-1'
});

var reloadMessage=function (){}

let timer=setInterval(function (){
    if(document.getElementById('ArticleContent')){
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('ArticleContent'));
        clearInterval(timer)
    }
},100)




