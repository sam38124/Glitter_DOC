//文章內容
var ArticleContent=createReactClass({
    render:function (){
            return  <div id="Content" dangerouslySetInnerHTML={{__html:`
            <div class="previewContent">
    <div id="previewContent">
        <div class="selectDic">
                <img onclick="glitter.publicBeans.goUserInfo(gBundle.account)" class="head" src="${gBundle.head}" id="headImg">
            <h3 onclick="glitter.publicBeans.goUserInfo(gBundle.account)" class="flexText" style="font-size: 16px;font-weight: bold;" id="pickText">${(gBundle.pick)}</h3>
            <div style="flex: auto;"></div>
            ${((gBundle.account===glitter.share.manager)||(gBundle.account===glitter.publicBeans.publicLogic.customDefine.account)) ? '':``}
            
        </div>
        <h3 style="color:black;margin:0;" id="tit">${(gBundle.title)}</h3>
        <div style="margin:0;display: flex;height: 30px;padding: 0;">
            <h3 id="time"
                style="margin-top:0;margin-bottom: 0;padding:0;color: gray;font-size: 11px;height: 30px;line-height: 30px;">
                ${gBundle.time}</h3>
        </div>
        ${(gBundle.content.replace(/\n/g,'<br>'))}
    </div>
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
            `}}>
            </div>
    },
    componentDidMount:function (){
        let height=$(`#Content`).height()
        if(height!==undefined){
            publicShare.changeItemHeight(0,height)
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
        artView=that
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
var artView=undefined
let timer=setInterval(function (){
    if(document.getElementById('ArticleContent')){
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('ArticleContent'));
        clearInterval(timer)
    }
},100)




