//文章內容
var ArticleContent=createReactClass({
    render:function (){
            return  <div id="Content">
                <div className="flexslider">
                    <ul className="slides" id="imageList"></ul>
                    <div id="imageIndex">1/1</div>
                </div>
                <h3 className="title">
                    {`${(gBundle.title)}`}
                </h3>
                <h3 className="TextPlace" id="TextPlace" dangerouslySetInnerHTML={{__html: (gBundle.content)}}>
                </h3>
                <h3 className="comment"  id="replyCount">{`${gBundle.replyCount}`}則留言</h3>
                <div className="spi"></div>
            </div>
    },
    componentDidMount:function (){
        gBundle.image.map(function (data) {
            $('#imageList').append(`<li><img src="${data}" /></li>`)
        })
        $(".flexslider").flexslider({
            controlNav: false,
            directionNav: false, after: function (slider) {
                $('#imageIndex').html(`${slider.currentSlide + 1}/${gBundle.image.length}`)
            }
        });
        $('#imageIndex').html(`1/${gBundle.image.length}`)
        if($('#TextPlace').get(0)){
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
                                glitter.publicBeans.publicLogic.showArticleReply((gBundle.id+"."+that.props.data.id),that.props.data)
                            }}>回覆留言</span>
                        </div>
                        {(that.props.data.subMessage==='NA') ? '':
                            <div className={'inReplyContent'} onClick={function (e){
                                glitter.publicBeans.publicLogic.showArticleReply((gBundle.id+"."+that.props.data.id),that.props.data)
                            }}>
                                <img src={gBundle.head} className="img"></img>
                                <span className="inReplyContentText">
                                    {`${(that.props.data.subMessage)}`}
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




