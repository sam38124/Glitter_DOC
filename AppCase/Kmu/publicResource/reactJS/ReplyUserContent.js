var ListItem = createReactClass({
    render: function() {
        console.log('render')
       if((this.props.index-1)>=0){
           let index=this.props.index-1
           setTimeout(function (){
               let height=$(`#itemMessage${(index)}`).height()
               if(height!==undefined){
                   publicShare.changeItemHeight(index,height)
               }
           },100)
       }
       let that=this
        return <div className={(this.props.index===0) ? 'itemMessage':'itemMessage2'} id={`itemMessage`+this.props.index}>
            <div className="flexUser">
                <img src={gBundle.head} className="img"></img>
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
                                        articleID:gBundle.replyId,
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
                        </div>
                    </div>

                <div className="spacer"></div>
            </div>
        </div>
    },
    preventClick:false
});

var publicShare={
    changeItemHeight:function (){}
}
var VariableInfiniteList = createReactClass({
    getInitialState: function() {
        return {
            elementHeights: [100],
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
                id:gBundle.replyId
            },function (response){
                if(response===undefined){
                    loadData()
                }else{
                    if(response.result){
                        if(response.data.length===0){
                            that.isBtn=true
                            that.setState({
                                isInfiniteLoading: false
                            })
                        }else{
                            that.index=response.data[response.data.length-1].id
                            that.setState({
                                isInfiniteLoading: false,
                                elementHeights: that.state.elementHeights.concat(that.generateVariableElementHeights(response.data.length,response.data.length)),
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
        reloadMessage=function (){
            that.index='-1'
            that.isBtn=false
            that.state.isInfiniteLoading=false
            that.state.data=[gBundle]
            that.state.elementHeights=[100]
            that.handleInfiniteLoad()
        }
        publicShare.changeItemHeight=function (index,height){
            if(that.state.elementHeights[index]===height){return}
            that.state.elementHeights[index]=height
            that.setState({
                elementHeights: that.state.elementHeights
            });
        }
        var elements = this.state.elementHeights.map(function(el, i) {
            return <ListItem key={i} index={i} cyclyView={that} height={el} lineHeight={el + "px"} data={that.state.data[i]}/>;
        })
        return <Infinite
            elementHeight={this.state.elementHeights}
            containerHeight={$('#ReplyUserContent').height()}
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
    if(document.getElementById('ReplyUserContent')){
        ReactDOM.render(<VariableInfiniteList/>,document.getElementById('ReplyUserContent'));
        clearInterval(timer)
    }
},100)





